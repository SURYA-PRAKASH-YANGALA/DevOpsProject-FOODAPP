# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
# from typing import List
# from database import foods, orders, users
# from datetime import datetime
# import bcrypt   
# router = APIRouter()


# # ✅ Models
# class RegisterModel(BaseModel):
#     name: str
#     email: str
#     password: str


# class LoginModel(BaseModel):
#     email: str
#     password: str


# class CartItem(BaseModel):
#     food_id: str
#     name: str
#     price: float
#     quantity: int


# class OrderModel(BaseModel):
#     user_id: str
#     user_name: str
#     cart: List[CartItem]
#     total: float


# # ✅ 1. REGISTER
# @router.post("/register")
# async def register(data: RegisterModel):
#     exist = await users.find_one({"email": data.email})
#     if exist:
#         raise HTTPException(status_code=409, detail="Email already registered")

#     hashed = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()

#     doc = {
#         "name": data.name,
#         "email": data.email,
#         "password": hashed,
#         "role": "user"
#     }

#     result = await users.insert_one(doc)

#     return {
#         "message": "Registered successfully",
#         "user_id": str(result.inserted_id),
#         "name": data.name,
#         "email": data.email,
#         "role": "user"
#     }


# # ✅ 2. USER LOGIN (MongoDB only)
# @router.post("/login")
# async def login(data: LoginModel):
#     user = await users.find_one({"email": data.email})
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     if not bcrypt.checkpw(data.password.encode(), user["password"].encode()):
#         raise HTTPException(status_code=401, detail="Invalid password")

#     return {
#         "message": "Login successful",
#         "user_id": str(user["_id"]),
#         "name": user["name"],
#         "email": user["email"],
#         "role": "user"
#     }


# # ✅ 3. GET FOOD MENU
# @router.get("/foods")
# async def get_foods():
#     all_foods = []
#     async for food in foods.find():
#         food["_id"] = str(food["_id"])
#         all_foods.append(food)
#     return {"foods": all_foods}


# # ✅ 4. PLACE ORDER
# @router.post("/order")
# async def place_order(data: OrderModel):
#     if not data.cart:
#         raise HTTPException(status_code=400, detail="Cart is empty")

#     order = {
#         "user_id": data.user_id,
#         "user_name": data.user_name,
#         "cart": [item.dict() for item in data.cart],
#         "total": data.total,
#         "placed_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
#     }

#     result = await orders.insert_one(order)

#     return {
#         "message": "Order placed successfully",
#         "order_id": str(result.inserted_id)
#     }