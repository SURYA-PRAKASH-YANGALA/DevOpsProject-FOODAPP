from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers
from routers import admin, user

app = FastAPI()

# CORS (IMPORTANT for React ↔ FastAPI)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # later we restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(user.router, prefix="/user", tags=["User"])


# Root route (test)
@app.get("/")
def home():
    return {"message": "Food App Backend Running 🚀"}