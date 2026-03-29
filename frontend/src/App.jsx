import { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

const initialForm = {
  id: "",
  name: "",
  description: "",
  price: "",
  quantity: ""
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(Number(value || 0));
}

function App() {
  const [products, setProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [status, setStatus] = useState({ type: "", text: "" });

  async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new Error(typeof data === "string" ? data : "Request failed");
    }

    return data;
  }

  async function loadProducts() {
    setLoading(true);
    setStatus({ type: "", text: "" });

    try {
      const data = await request("/products", { headers: {} });
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      setStatus({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function startCreate() {
    setActiveProduct(null);
    setForm(initialForm);
    setStatus({ type: "", text: "" });
  }

  function startEdit(product) {
    setActiveProduct(product);
    setForm({
      id: String(product.id),
      name: product.name,
      description: product.description,
      price: String(product.price),
      quantity: String(product.quantity)
    });
    setStatus({ type: "", text: "" });
  }

  async function searchProduct() {
    if (!searchId.trim()) {
      setStatus({ type: "error", text: "Enter a product ID to search." });
      return;
    }

    try {
      const data = await request(`/product/${searchId}`, { headers: {} });
      if (typeof data === "string") {
        setStatus({ type: "error", text: data });
        return;
      }

      startEdit(data);
      setStatus({ type: "success", text: `Loaded product #${data.id}.` });
    } catch (error) {
      setStatus({ type: "error", text: error.message });
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setStatus({ type: "", text: "" });

    const payload = {
      id: Number(form.id),
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity)
    };

    try {
      if (activeProduct) {
        await request(`/product?id=${activeProduct.id}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        setStatus({ type: "success", text: "Product updated successfully." });
      } else {
        await request("/product", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        setStatus({ type: "success", text: "Product created successfully." });
      }

      await loadProducts();
      setActiveProduct(null);
      setForm(initialForm);
      setSearchId("");
    } catch (error) {
      setStatus({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    setStatus({ type: "", text: "" });

    try {
      await request(`/product?id=${id}`, {
        method: "DELETE",
        headers: {}
      });
      setStatus({ type: "success", text: `Deleted product #${id}.` });
      if (activeProduct?.id === id) {
        setActiveProduct(null);
        setForm(initialForm);
      }
      await loadProducts();
    } catch (error) {
      setStatus({ type: "error", text: error.message });
    } finally {
      setDeletingId(null);
    }
  }

  const stats = {
    count: products.length,
    stock: products.reduce((sum, product) => sum + Number(product.quantity || 0), 0),
    value: products.reduce(
      (sum, product) => sum + Number(product.quantity || 0) * Number(product.price || 0),
      0
    )
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <main className="layout">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Product Dashboard</p>
            <h1>Inventory Studio</h1>
            <p className="hero-text">
              A clean React frontend for your FastAPI products service. Browse
              stock, search by ID, and manage items from one place.
            </p>
            <div className="hero-actions">
              <button className="primary-button" type="button" onClick={loadProducts}>
                Refresh Inventory
              </button>
              <button className="ghost-button" type="button" onClick={startCreate}>
                New Product
              </button>
            </div>
          </div>

          <div className="stats-grid">
            <article className="stat-card">
              <span>Total Products</span>
              <strong>{stats.count}</strong>
            </article>
            <article className="stat-card">
              <span>Units In Stock</span>
              <strong>{stats.stock}</strong>
            </article>
            <article className="stat-card">
              <span>Inventory Value</span>
              <strong>{formatCurrency(stats.value)}</strong>
            </article>
          </div>
        </section>

        {status.text ? (
          <div className={`banner ${status.type || "info"}`}>{status.text}</div>
        ) : null}

        <section className="dashboard-grid">
          <section className="panel panel-large">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Live Catalog</p>
                <h2>Products</h2>
              </div>
              <span className="chip">{loading ? "Loading..." : `${products.length} loaded`}</span>
            </div>

            <div className="products-grid">
              {loading ? (
                <div className="empty-card">Loading your inventory...</div>
              ) : products.length === 0 ? (
                <div className="empty-card">No products found yet.</div>
              ) : (
                products.map((product) => (
                  <article className="product-card" key={product.id}>
                    <div className="product-card-top">
                      <span className="product-id">#{product.id}</span>
                      <span className="product-stock">{product.quantity} in stock</span>
                    </div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="product-footer">
                      <strong>{formatCurrency(product.price)}</strong>
                      <div className="card-actions">
                        <button
                          className="tiny-button"
                          type="button"
                          onClick={() => startEdit(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="tiny-button danger"
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                        >
                          {deletingId === product.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="panel side-stack">
            <div className="lookup-card">
              <div className="panel-header">
                <div>
                  <p className="panel-kicker">Quick Search</p>
                  <h2>Find by ID</h2>
                </div>
              </div>
              <div className="search-row">
                <input
                  type="number"
                  min="1"
                  placeholder="Enter product ID"
                  value={searchId}
                  onChange={(event) => setSearchId(event.target.value)}
                />
                <button className="primary-button" type="button" onClick={searchProduct}>
                  Search
                </button>
              </div>
            </div>

            <form className="editor-card" onSubmit={handleSubmit}>
              <div className="panel-header">
                <div>
                  <p className="panel-kicker">Product Editor</p>
                  <h2>{activeProduct ? "Update Product" : "Create Product"}</h2>
                </div>
              </div>

              <div className="form-grid">
                <label>
                  <span>ID</span>
                  <input
                    name="id"
                    type="number"
                    min="1"
                    required
                    value={form.id}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  <span>Name</span>
                  <input
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                  />
                </label>

                <label className="full-span">
                  <span>Description</span>
                  <textarea
                    name="description"
                    rows="4"
                    required
                    value={form.description}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  <span>Price</span>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  <span>Quantity</span>
                  <input
                    name="quantity"
                    type="number"
                    min="0"
                    required
                    value={form.quantity}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className="form-actions">
                <button className="primary-button" type="submit" disabled={saving}>
                  {saving ? "Saving..." : activeProduct ? "Update Product" : "Create Product"}
                </button>
                <button className="ghost-button" type="button" onClick={startCreate}>
                  Clear
                </button>
              </div>
            </form>
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;
