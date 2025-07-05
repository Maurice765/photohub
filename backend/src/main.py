from fastapi import FastAPI
from fastapi.routing import APIRoute
from src.photo.router import router as photo_router
from fastapi.middleware.cors import CORSMiddleware
from src.config import settings

def generate_unique_id(route: APIRoute):
    return route.name

app = FastAPI(
    title="FastAPI Photohub Service",
    description="An API to upload and search photos.",
    version="1.0.0",
    generate_unique_id_function=generate_unique_id,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(photo_router, prefix="/photo", tags=["photo"])

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Photohub API!"}