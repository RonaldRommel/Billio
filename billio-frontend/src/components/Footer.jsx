import React from "react";

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container text-center">
        <h5 className="mb-3">Billio</h5>
        <p className="mb-1">
          A serverless invoicing tool built with React & AWS.
        </p>
        <p className="mb-1">© 2025 Ronald Rommel</p>

        <div className="d-flex justify-content-center mt-3">
          <a href="/" className="text-light mx-2 text-decoration-none">
            Home
          </a>
          <a href="/demo" className="text-light mx-2 text-decoration-none">
            Demo
          </a>
        </div>
      </div>
    </footer>
  );
}
