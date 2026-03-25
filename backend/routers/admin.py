from fastapi import APIRouter, HTTPException, Form
from typing import Literal
from database import foods, orders, users
from pydantic import BaseModel
from bson import ObjectId
from bson.errors import InvalidId

router = APIRouter()

# ✅ Hardcoded Admin Credentials (only 1 admin)
ADMIN_EMAIL = "admin@foodease.com"
ADMIN_PASSWORD = "admin123"


# ✅ Admin Login Model
class AdminLogin(BaseModel):
    email: str
    password: str


# ✅ 1. ADMIN LOGIN (hardcoded)
@router.post("/login")
async def admin_login(data: AdminLogin):
    if data.email != ADMIN_EMAIL or data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

    return {
        "message": "Login successful",
        "user_id": "admin_001",
        "name": "Admin",
        "email": ADMIN_EMAIL,
        "role": "admin"
    }


# ✅ 2. ADD FOOD (no image)
@router.post("/add-food")
async def add_food(
    name: str = Form(...),
    price: float = Form(...),
    category: Literal["Starters", "Main", "Desserts", "Drinks"] = Form(...),
):
    if price <= 0:
        raise HTTPException(status_code=400, detail="Invalid price")

    exist = await foods.find_one({"name": name.lower()})
    if exist:
        raise HTTPException(status_code=409, detail="Food item already exists")

    food = {
        "name": name.lower(),
        "price": price,
        "category": category,
        "image": ""
    }

    await foods.insert_one(food)
    return {"message": "Food added successfully"}


# ✅ 3. GET ALL FOODS
@router.get("/get-foods")
async def get_foods():
    all_foods = []
    async for food in foods.find():
        food["_id"] = str(food["_id"])
        all_foods.append(food)
    return {"foods": all_foods}


# ✅ 4. DELETE FOOD
@router.delete("/delete-food/{food_id}")
async def delete_food(food_id: str):
    try:
        obj_id = ObjectId(food_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID")

    food = await foods.find_one({"_id": obj_id})
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")

    await foods.delete_one({"_id": obj_id})
    return {"message": "Food deleted successfully"}


# ✅ 5. GET ALL ORDERS
@router.get("/orders")
async def get_orders():
    all_orders = []
    async for order in orders.find().sort("placed_at", -1):
        order["_id"] = str(order["_id"])
        all_orders.append(order)
    return {"orders": all_orders}


# ✅ 6. GET ALL USERS (password hidden)
@router.get("/users")
async def get_users():
    all_users = []
    async for user in users.find():
        user["_id"] = str(user["_id"])
        user.pop("password", None)
        all_users.append(user)
    return {"users": all_users}