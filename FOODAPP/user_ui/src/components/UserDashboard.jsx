import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000";
const CATEGORIES = ["All", "Starters", "Main", "Desserts", "Drinks"];

const CATEGORY_ICONS = {
  Starters: "🥗",
  Main: "🍛",
  Desserts: "🍰",
  Drinks: "🥤",
  All: "🍽️"
};

function Dashboard({ setPage }) {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState({});
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => { loadFoods(); }, []);

  async function loadFoods() {
    try {
      const res = await axios.get(`${API}/user/foods`);
      setFoods(res.data.foods);
    } catch { }
  }

  function addToCart(food) {
    setCart(prev => ({
      ...prev,
      [food._id]: {
        ...food,
        quantity: (prev[food._id]?.quantity || 0) + 1
      }
    }));
  }

  function removeFromCart(id) {
    setCart(prev => {
      const qty = prev[id]?.quantity;
      if (qty <= 1) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: { ...prev[id], quantity: qty - 1 } };
    });
  }

  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const filtered = activeCategory === "All"
    ? foods
    : foods.filter(f => f.category === activeCategory);

  async function handleCheckout() {
    if (cartItems.length === 0) return;
    setLoading(true);
    setMsg("");

    try {
      await axios.post(`${API}/user/order`, {
        user_id: user.user_id,
        user_name: user.name,
        cart: cartItems.map(i => ({
          food_id: i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity
        })),
        total: cartTotal
      });

      setCart({});
      setCartOpen(false);
      setMsg("Order placed successfully! 🎉");
      setMsgType("success");
      setTimeout(() => setMsg(""), 4000);

    } catch {
      setMsg("Checkout failed. Try again.");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("user");
    setPage("login");
  }

  return (
    <div className="user-wrapper">

      {/* NAVBAR */}
      <nav className="user-navbar">
        <div className="nav-brand">
          <span>🍽️</span>
          <span className="nav-brand-name">FoodEase</span>
        </div>
        <div className="nav-right">
          <span className="nav-welcome">Hey, {user.name}! 👋</span>
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            🛒 Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button className="nav-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* BANNER */}
      {msg && <div className={`top-banner ${msgType}`}>{msg}</div>}

      {/* HERO */}
      <div className="user-hero">
        <h1>What are you craving today?</h1>
        <p>Fresh food, crafted with love 🍴</p>
      </div>

      {/* CATEGORY FILTER */}
      <div className="category-bar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={activeCategory === cat ? "cat-btn active" : "cat-btn"}
            onClick={() => setActiveCategory(cat)}
          >
            {CATEGORY_ICONS[cat]} {cat}
          </button>
        ))}
      </div>

      {/* FOOD GRID */}
      <div className="food-grid">
        {filtered.map(food => (
          <div key={food._id} className="food-card">

            {/* ✅ Emoji icon instead of image */}
            <div className="food-icon-wrap">
              <span className="food-icon">{CATEGORY_ICONS[food.category]}</span>
            </div>

            <div className="food-body">
              <span className="food-name">{food.name}</span>
              <span className="food-category">{food.category}</span>
              <span className="food-price">₹{food.price}</span>
            </div>

            <div className="food-actions">
              {cart[food._id] ? (
                <div className="qty-control">
                  <button onClick={() => removeFromCart(food._id)}>−</button>
                  <span>{cart[food._id].quantity}</span>
                  <button onClick={() => addToCart(food)}>+</button>
                </div>
              ) : (
                <button className="add-btn" onClick={() => addToCart(food)}>
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="empty-menu">No items in this category yet.</div>
        )}
      </div>

      {/* CART SIDEBAR */}
      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <div className="cart-sidebar" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h3>Your Cart 🛒</h3>
              <button className="close-btn" onClick={() => setCartOpen(false)}>✕</button>
            </div>

            {cartItems.length === 0 ? (
              <div className="cart-empty">Your cart is empty</div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map(item => (
                    <div key={item._id} className="cart-item">

                      {/* ✅ Emoji icon instead of image */}
                      <div className="cart-item-icon">
                        {CATEGORY_ICONS[item.category]}
                      </div>

                      <div className="cart-item-info">
                        <span className="cart-item-name">{item.name}</span>
                        <span className="cart-item-price">
                          ₹{item.price} × {item.quantity}
                        </span>
                      </div>
                      <div className="cart-qty">
                        <button onClick={() => removeFromCart(item._id)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => addToCart(item)}>+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    className="checkout-btn"
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    {loading ? "Placing Order..." : "Checkout"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;