import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const InvoiceContext = createContext();

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default api;
const deletSessionData = () => {
  sessionStorage.removeItem("invoiceData");
};

const InvoiceProvider = ({ children }) => {
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInvoices = async () => {
    const sessionData = sessionStorage.getItem("invoiceData");
    if (sessionData) {
      setInvoices(JSON.parse(sessionData));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/invoices");
      if (res.status !== 200) throw new Error("Failed to fetch invoices");
      sessionStorage.setItem("invoiceData", JSON.stringify(res.data.invoices));
      setInvoices(res.data.invoices || []);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async (invoiceData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/invoices", invoiceData);
      if (res.status !== 201) throw new Error("Failed to create invoice");
      deletSessionData();
      fetchInvoices();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateInvoice = async (invoice, invoiceData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.put(`/invoices/${invoice.invoice_id}`, invoiceData);
      if (res.status !== 200) throw new Error("Failed to update invoice");
      deletSessionData();
      fetchInvoices();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async (invoiceId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.delete(`/invoices/${invoiceId}`);
      deletSessionData();
      fetchInvoices();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async (invoiceId) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get(`/invoices/${invoiceId}/pdf`, {
        responseType: "text", // important: get raw base64 string as text
      });

      if (res.status !== 200) {
        throw new Error("Failed to generate PDF");
      }
      const base64PDF = res.data;

      const binaryString = atob(base64PDF);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create a Blob from the bytes
      const blob = new Blob([bytes], { type: "application/pdf" });

      // Create URL for Blob
      const url = window.URL.createObjectURL(blob);

      // Open PDF in new tab (or you can trigger download)
      window.open(url);

      // Optional: Revoke URL after some time
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error("PDF generation error:", error);
      setError(error.message || "Error generating PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <InvoiceContext.Provider
      value={{
        editingInvoice,
        invoices,
        loading,
        error,
        setEditingInvoice,
        fetchInvoices,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        generatePDF,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

const useInvoiceContext = () => useContext(InvoiceContext);

export { InvoiceProvider, useInvoiceContext };
