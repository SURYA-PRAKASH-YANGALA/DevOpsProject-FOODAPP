from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB URL (from .env)
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
# Create client
client = AsyncIOMotorClient(MONGO_URL)

# Database
db = client["food_app_db"]

# Collections
foods = db["foods"]
users = db["users"]
orders = db["orders"]