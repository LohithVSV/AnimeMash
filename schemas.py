from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    username:str
    email:EmailStr
    password:str

class UserResponse(BaseModel):
    id:int
    username:str
    email:EmailStr

    class Config:
        from_attributes=True

class VoteCast(BaseModel):
    winner_id:int
    loser_id:int