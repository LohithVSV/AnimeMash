from fastapi import FastAPI,Depends,HTTPException
from sqlalchemy.orm import session
from database import get_db
import models,schemas
from auth import hash_password,verify_password
from auth_jwt import create_acess_token,verify_token
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from character import router as characters_router

oauth2_scheme=OAuth2PasswordBearer(tokenUrl="login")

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(characters_router)

from database import Base, engine
Base.metadata.create_all(bind=engine)

def get_current_user(token:str=Depends(oauth2_scheme),db:session=Depends(get_db)):
    payload=verify_token(token)
    if payload is None:
        raise HTTPException(status_code=401,detail="token invalid or expired")
    username=payload.get("sub")
    user=db.query(models.User).filter(models.User.username==username).first()
    if user is None:
        raise HTTPException(status_code=401,detail="user not found")
    return user

@app.post("/login")
def login(form_data:OAuth2PasswordRequestForm=Depends(),db:session=Depends(get_db)):
    user=db.query(models.User).filter(models.User.username==form_data.username).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid Credentials")
    if not verify_password(form_data.password,user.password):
        raise HTTPException(status_code=401, detail="Invalid Credentials")
    access_token=create_acess_token(data={"sub":str(user.id)})
    return {"access_token":access_token,"token_type":"bearer"}

@app.post("/users",response_model=schemas.UserCreate)
def create_user(user:schemas.UserCreate,db:session=Depends(get_db)):
    db_user=models.User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/")
def work():
    return "panichesthundhi royyyyy"