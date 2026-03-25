import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000";
const CATEGORIES = ["Starters", "Main", "Desserts", "Drinks"];

const CATEGORY_ICONS = {
  Starters: "🥗",
  Main: "🍛",
  Desserts: "🍰",
  Drinks: "🥤",
};

function Dashboard({ setPage }) {
  const [view, setView] = useState("add");

  // Add Food states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [loading, setLoading] = useState(false);

  // Data states
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const admin = JSON.parse(localStorage.getItem("admin") || "{}");

  useEffect(() => {
    if (view === "add") loadFoods();
    if (view === "orders") loadOrders();
    if (view === "users") loadUsers();
  }, [view]);

  async function loadFoods() {
    try {
      const res = await axios.get(`${API}/admin/get-foods`);
      setFoods(res.data.foods);
    } catch { }
  }

  async function loadOrders() {
    try {
      const res = await axios.get(`${API}/admin/orders`);
      setOrders(res.data.orders);
    } catch { }
  }

  async function loadUsers() {
    try {
      const res = await axios.get(`${API}/admin/users`);
      setUsers(res.data.users);
    } catch { }
  }

  async function handleAddFood(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);

    try {
      await axios.post(`${API}/admin/add-food`, formData);
      setMsg("Food item added successfully!");
      setMsgType("success");
      setName("");
      setPrice("");
      setCategory("");
      loadFoods();
    } catch (err) {
      const detail = err.response?.data?.detail;
      setMsg(typeof detail === "string" ? detail : "Failed to add food");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteFood(id) {
    if (!window.confirm("Delete this food item?")) return;
    try {
      await axios.delete(`${API}/admin/delete-food/${id}`);
      setFoods(foods.filter(f => f._id !== id));
    } catch {
      alert("Failed to delete");
    }
  }

  function handleLogout() {
    localStorage.removeItem("admin");
    setPage("login");
  }

  return (
    <div className="dashboard-wrapper">

      {/* NAVBAR */}
      <nav className="dash-navbar">
        <div className="dash-brand">
          <span>🍽️</span>
          <span className="dash-brand-name">FoodEase</span>
          <span className="dash-badge">Admin</span>
        </div>
        <div className="dash-nav-links">
          <button
            className={view === "add" ? "dash-nav-btn active" : "dash-nav-btn"}
            onClick={() => setView("add")}
          >
            🍕 Add Items
          </button>
          <button
            className={view === "orders" ? "dash-nav-btn active" : "dash-nav-btn"}
            onClick={() => setView("orders")}
          >
            📋 Orders
          </button>
          <button
            className={view === "users" ? "dash-nav-btn active" : "dash-nav-btn"}
            onClick={() => setView("users")}
          >
            👥 Users
          </button>
        </div>
        <div className="dash-nav-right">
          <span className="dash-admin-name">👤 {admin.name}</span>
          <button className="dash-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="dash-content">

        {/* ADD FOOD */}
        {view === "add" && (
          <div className="section">
            <div className="section-header">
              <h2>Food Menu</h2>
              <p>Add and manage food items</p>
            </div>

            <div className="add-layout">

              {/* Form */}
              <div className="add-card">
                <h3>Add New Item</h3>
                {msg && <div className={`msg ${msgType}`}>{msg}</div>}
                <form onSubmit={handleAddFood} className="add-form">
                  <div className="field-group">
                    <label>Item Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Chicken Tikka"
                      value={name}
                      required
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <label>Category</label>
                    <select
                      value={category}
                      required
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="" disabled>Select category</option>
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 250"
                      value={price}
                      min="1"
                      required
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Adding..." : "Add Food Item"}
                  </button>
                </form>
              </div>

              {/* Food List — same card style as user */}
              <div className="food-list">
                {CATEGORIES.map(cat => {
                  const catFoods = foods.filter(f => f.category === cat);
                  return catFoods.length > 0 && (
                    <div key={cat} className="cat-group">
                      <h4 className="cat-label">
                        {CATEGORY_ICONS[cat]} {cat}
                      </h4>
                      <div className="food-grid">
                        {catFoods.map(food => (
                          <div key={food._id} className="food-card">
                            <div className="food-icon-wrap">
                              <span className="food-icon">
                                {CATEGORY_ICONS[food.category]}
                              </span>
                            </div>
                            <div className="food-body">
                              <span className="food-name">{food.name}</span>
                              <span className="food-category">{food.category}</span>
                              <span className="food-price">₹{food.price}</span>
                            </div>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteFood(food._id)}
                            >
                              🗑 Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {foods.length === 0 &&
                  <div className="empty-state">No food items yet. Add some!</div>
                }
              </div>

            </div>
          </div>
        )}

        {/* ORDERS */}
        {view === "orders" && (
          <div className="section">
            <div className="section-header">
              <h2>All Orders</h2>
              <p>{orders.length} total orders</p>
            </div>
            <div className="orders-list">
              {orders.length === 0 &&
                <div className="empty-state">No orders yet.</div>
              }
              {orders.map((order, idx) => (
                <div key={order._id} className="order-card">
                  <div
                    className="order-summary"
                    onClick={() => setExpandedOrder(expandedOrder === idx ? null : idx)}
                  >
                    <div className="order-num">#{idx + 1}</div>
                    <div className="order-user-info">
                      <span className="order-username">{order.user_name}</span>
                      <span className="order-date">{order.placed_at}</span>
                    </div>
                    <div className="order-right">
                      <span className="order-items-count">
                        {order.cart.length} item(s)
                      </span>
                      <span className="order-total">₹{order.total}</span>
                    </div>
                    <span className="expand-icon">
                      {expandedOrder === idx ? "▲" : "▼"}
                    </span>
                  </div>

                  {expandedOrder === idx && (
                    <div className="order-details">
                      <table className="order-table">
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.cart.map((item, i) => (
                            <tr key={i}>
                              <td>{item.name}</td>
                              <td>{item.quantity}</td>
                              <td>₹{item.price}</td>
                              <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={3}><strong>Total</strong></td>
                            <td><strong>₹{order.total}</strong></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS */}
        {view === "users" && (
          <div className="section">
            <div className="section-header">
              <h2>All Users</h2>
              <p>{users.length} registered users</p>
            </div>
            <div className="users-table-wrap">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u._id}>
                      <td>{i + 1}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge ${u.role}`}>{u.role}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 &&
                <div className="empty-state">No users yet.</div>
              }
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;