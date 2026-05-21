"""
NeuralTruth - Full Auth Router
File: apps/backend/app/api/routes/auth.py
"""
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr

from app.core.security import hash_password, verify_password, create_access_token
from app.core.config import settings
from app.core.logger import logger

router = APIRouter()

# In-memory store for demo. Replace with DB queries in production.
_users_db: dict[str, dict] = {}


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class Token(BaseModel):
    access_token: str
    token_type: str


@router.post("/register", response_model=Token, status_code=201, summary="Register a new user")
def register(user: UserCreate):
    if user.email in _users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    _users_db[user.email] = {
        "email":           user.email,
        "full_name":       user.full_name,
        "hashed_password": hash_password(user.password),
    }
    token = create_access_token({"sub": user.email}, timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    logger.info(f"[Auth] New user registered: {user.email}")
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=Token, summary="Login and receive JWT")
def login(form: OAuth2PasswordRequestForm = Depends()):
    user = _users_db.get(form.username)
    if not user or not verify_password(form.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token({"sub": form.username}, timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    logger.info(f"[Auth] Login: {form.username}")
    return {"access_token": token, "token_type": "bearer"}
