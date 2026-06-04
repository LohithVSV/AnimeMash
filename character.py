import httpx
from fastapi import APIRouter, HTTPException
from sqlalchemy import func
from schemas import VoteCast
from fastapi import Depends
from auth_jwt import verify_token
from fastapi.security import OAuth2PasswordBearer
from database import get_db
from models import voting_characters
from sqlalchemy.orm import Session
    

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

router=APIRouter()

@router.get("/battle")
async def battle():
    async with httpx.AsyncClient() as client:
        res1 = await client.get("https://api.jikan.moe/v4/random/characters")
        res2 = await client.get("https://api.jikan.moe/v4/random/characters")
    if res1.status_code != 200 or res2.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch character data")
    character1 = res1.json()["data"]
    character2 = res2.json()["data"]
    return {
    "character1": {
        "id": character1["mal_id"],
        "name": character1["name"],
        "image_url": character1["images"]["webp"]["image_url"],
        "bio": character1["about"][:200] + "..." if character1["about"] else "No bio available."
    },
    "character2": {
        "id": character2["mal_id"],
        "name": character2["name"],
        "image_url": character2["images"]["webp"]["image_url"],
        "bio": character2["about"][:200] + "..." if character2["about"] else "No bio available."
    }
    }


@router.post("/vote")
async def cast_vote(vote: VoteCast, token:str=Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user=verify_token(token)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    existing=db.query(voting_characters).filter(
        voting_characters.user_id==int(user["sub"]),
        ((voting_characters.winner_id == vote.winner_id) & (voting_characters.loser_id == vote.loser_id)) |
        ((voting_characters.winner_id == vote.loser_id) & (voting_characters.loser_id == vote.winner_id))
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You already voted on this pair!")
    new_vote = voting_characters(
        user_id=int(user["sub"]),
        winner_id=vote.winner_id,
        loser_id=vote.loser_id
    )
    db.add(new_vote)
    db.commit()
    db.refresh(new_vote)
    return {"message":"vote recieved"}

@router.get("/leaderboard")
async def leaderboard(db: Session = Depends(get_db)):
    results = db.query(
        voting_characters.winner_id,
        func.count(voting_characters.winner_id).label("wins")
    ).group_by(voting_characters.winner_id)\
     .order_by(func.count(voting_characters.winner_id).desc())\
     .limit(10)\
     .all()

    leaderboard = []
    async with httpx.AsyncClient() as client:
        for r in results:
            res = await client.get(f"https://api.jikan.moe/v4/characters/{r.winner_id}")
            name = res.json()["data"]["name"] if res.status_code == 200 else "Unknown"
            leaderboard.append({
                "character_id": r.winner_id,
                "character_name": name,
                "wins": r.wins
            })

    return leaderboard
