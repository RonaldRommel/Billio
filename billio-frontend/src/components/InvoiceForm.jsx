import React, { useState, useEffect } from "react";
import styles from "./InvoiceForm.module.css";
import { useInvoiceContext } from "../context/InvoiceContext";

const createEmptyItem = () => ({ name: "", price: "", quantity: "" });

function InvoiceForm() {
  const { editingInvoice, setEditingInvoice, updateInvoice } =
    useInvoiceContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tax, setTax] = useState(0);
  const [items, setItems] = useState([createEmptyItem()]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (editingInvoice) {
      setName(editingInvoice.name);
      setEmail(editingInvoice.email);
      setPhone(editingInvoice.phone);
      setTax(editingInvoice.tax);
      setItems(editingInvoice.items);
      setTotal(editingInvoice.total);
    }
  }, [editingInvoice]);

  const cancelEdit = () => {
    setEditingInvoice(null);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setTax(3);
    setItems([createEmptyItem()]);
    setTotal(0);
  };

  const { createInvoice } = useInvoiceContext();
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
    calculateTotal(newItems);
  };

  const addItem = () => setItems([...items, createEmptyItem()]);

  const removeItem = (index) => {
    if (items.length === 1) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    calculateTotal(newItems);
  };

  const calculateTotal = (items) => {
    let t = 0;
    items.forEach((item) => {
      t += (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0); // Converting to numbers
    });
    t = t + (t * (parseFloat(tax) || 0)) / 100; // Adding tax
    setTotal(t);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Name is required");
      return;
    }
    const sanitizedItems = items
      .map((item) => ({
        name: item.name.trim(),
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity) || 0,
      }))
      .filter((item) => item.name !== "");

    if (sanitizedItems.length === 0) {
      alert("At least one item with name is required");
      return;
    }

    const invoiceData = {
      name,
      email,
      phone,
      tax: parseFloat(tax) || 0,
      items: sanitizedItems,
      total: parseFloat(total.toFixed(2)) || 0,
    };
    if (editingInvoice) {
      updateInvoice(editingInvoice, invoiceData);
      setEditingInvoice(null);
    } else {
      createInvoice(invoiceData);
    }
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3>{editingInvoice ? "Edit Invoice" : "Create Invoice"}</h3>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Phone</label>
        <input
          type="tel"
          className="form-control"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Tax (%)</label>
        <input
          type="number"
          className="form-control"
          value={tax}
          onChange={(e) => setTax(e.target.value)}
          step="0.1"
          min="0"
          required
        />
      </div>

      <hr />

      <h5>Items</h5>

      {items.map((item, i) => (
        <div key={i} className="d-flex align-items-center mb-3">
          <input
            type="text"
            placeholder="Item Name"
            className="form-control me-2"
            value={item.name}
            onChange={(e) => handleItemChange(i, "name", e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Price"
            className="form-control me-2"
            value={item.price}
            onChange={(e) => handleItemChange(i, "price", e.target.value)}
            min="0"
            step="1"
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            className="form-control me-2"
            value={item.quantity}
            onChange={(e) => handleItemChange(i, "quantity", e.target.value)}
            min="1"
            step="1"
            required
          />
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => removeItem(i)}
            disabled={items.length === 1}
          >
            &times;
          </button>
        </div>
      ))}

      <button
        type="button"
        className="btn btn-secondary mb-3"
        onClick={addItem}
      >
        + Add Item
      </button>
      <div className="mb-3">
        <label className="form-label">Total</label>
        <input
          type="tel"
          className="form-control"
          value={total.toFixed(2)}
          readOnly
          required
        />
      </div>

      <div>
        <button type="submit" className="btn btn-primary me-2">
          {editingInvoice ? "Update Invoice" : "Create Invoice"}
        </button>
        {true && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={cancelEdit}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default function InvoiceFormWrapper() {
  return <InvoiceForm />;
}
