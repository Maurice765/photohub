from fastapi import FastAPI
from src.photo.router import router as photo_router

app = FastAPI(
    title="FastAPI Photohub Service",
    description="An API to upload and search photos.",
    version="1.0.0"
)

app.include_router(photo_router, prefix="/photo", tags=["photo"])

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Photohub API!"}