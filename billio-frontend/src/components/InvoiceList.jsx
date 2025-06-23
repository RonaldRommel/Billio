import React from "react";
import { useContext } from "react";
import { useInvoiceContext } from "../context/InvoiceContext";

function InvoiceList() {
  const { invoices, deleteInvoice, setEditingInvoice, generatePDF } =
    useInvoiceContext();
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Invoice ID</th>
            <th>Name</th>
            <th>Date</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No invoices found.
              </td>
            </tr>
          ) : (
            invoices.map((invoice) => (
              <tr key={invoice.invoice_id}>
                <td>{"xxxx" + invoice.invoice_id.slice(-6)}</td>
                <td>{invoice.name}</td>
                <td>{new Date(invoice.created_at).toLocaleDateString()}</td>
                <td>${invoice.total.toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => setEditingInvoice(invoice)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger me-2"
                    onClick={() => deleteInvoice(invoice.invoice_id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => generatePDF(invoice.invoice_id)}
                  >
                    PDF
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function InvoiceListWrapper() {
  return (
    <>
      <InvoiceList />
    </>
  );
}
