from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.claim_verification import verify_claim_with_search

router = APIRouter()

class VerifyRequest(BaseModel):
    claim: str

@router.post("/verify")
async def verify_claim(request: VerifyRequest):
    result = await verify_claim_with_search(request.claim)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result
