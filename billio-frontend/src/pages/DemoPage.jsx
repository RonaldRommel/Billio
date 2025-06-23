import React, { useState, useEffect } from "react";
import InvoiceList from "../components/InvoiceList";
import InvoiceForm from "../components/InvoiceForm";
import { useInvoiceContext, InvoiceProvider } from "../context/InvoiceContext";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
function Demo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchInvoices } = useInvoiceContext();

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <>
      <div className="container my-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="m-0">
            <Link
              to="/"
              className="text-decoration-none"
              style={{
                color: "#0d6efd",
                fontWeight: "700",
                fontSize: "2.5rem",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                letterSpacing: "1px",
              }}
            >
              Billio
            </Link>
          </h1>
        </div>
        <h2>Invoice Demo</h2>

        {/* {error && <div className="alert alert-danger">{error}</div>} */}

        {loading && <div>Loading...</div>}

        <InvoiceList />

        <hr />

        <InvoiceForm />
      </div>
      <Footer />
    </>
  );
}

export default function DemoPage() {
  return (
    <>
      <InvoiceProvider>
        <Demo />
      </InvoiceProvider>
    </>
  );
}
