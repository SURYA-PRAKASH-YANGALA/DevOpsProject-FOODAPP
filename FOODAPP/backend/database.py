from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "food_app_db")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Collections
foods = db["foods"]
users = db["users"]
orders = db["orders"]