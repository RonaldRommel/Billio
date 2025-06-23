import React from "react";
import styles from "./LandingPage.module.css";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className="display-4 fw-bold">📄 Billio</h1>
        <p className="lead">
          A lightweight serverless invoicing tool that generates professional
          PDFs.
        </p>
        <Link to="/demo" className="btn btn-primary mt-3">
          Try the Demo
        </Link>
      </section>

      {/* What is Billio Section */}
      <section className={`${styles.section} container`}>
        <h2 className={styles.sectionTitle}>💡 What is Billio?</h2>
        <p>
          <strong>Billio</strong> is a simple, efficient, and serverless
          invoicing platform designed for freelancers, small businesses, and
          developers. It allows users to create, manage, and generate invoices
          with ease using a secure and scalable cloud-based infrastructure.
          Every invoice is stored in AWS DynamoDB and can be downloaded as a
          stylish PDF built in real-time with Lambda.
        </p>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <h2>🔄 How It Works</h2>
        <div className="container">
          <div className="row">
            <div className="col-md-4 step">
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepTitle}>Fill the Invoice Form</div>
              <p className={styles.stepDesc}>
                Enter customer info, item details, and tax in an easy-to-use
                form.
              </p>
            </div>
            <div className="col-md-4 step">
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepTitle}>Stored in AWS DynamoDB</div>
              <p className={styles.stepDesc}>
                Your invoice data is securely stored in a fast, reliable NoSQL
                database.
              </p>
            </div>
            <div className="col-md-4 step">
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepTitle}>PDF Generated with Lambda</div>
              <p className={styles.stepDesc}>
                On demand, a serverless function generates a styled PDF using
                PDF-lib.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features + " container"}>
        <h2 className={styles.sectionTitle}>⚡ Why Serverless?</h2>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            🚀 Instant scalability with no server management
          </li>
          <li className="list-group-item">💸 Pay only for what you use</li>
          <li className="list-group-item">🔐 Built-in security with IAM</li>
          <li className="list-group-item">
            🧩 Easy integration with other AWS services
          </li>
          <li className="list-group-item">📉 Low maintenance, low cost</li>
        </ul>
      </section>

      {/* Technologies Used */}
      <section className={styles.technologies + " container"}>
        <h2 className={styles.sectionTitle}>🛠 Technologies Used</h2>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            ⚛️ <strong>React.js + Vite</strong> – Frontend SPA
          </li>
          <li className="list-group-item">
            🖥 <strong>AWS Lambda</strong> – Serverless function for PDF
            generation
          </li>
          <li className="list-group-item">
            🌐 <strong>API Gateway</strong> – REST API routing
          </li>
          <li className="list-group-item">
            🗂 <strong>AWS S3</strong> – Image/background asset hosting
          </li>
          <li className="list-group-item">
            📦 <strong>AWS DynamoDB</strong> – Invoice storage (NoSQL)
          </li>
          <li className="list-group-item">
            🔐 <strong>AWS IAM</strong> – Secure access management
          </li>
        </ul>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>🎉 Ready to Go Paperless?</h2>
        <p>Generate invoices instantly. Try the demo now.</p>
        <Link to="/demo" className="btn btn-dark mt-2">
          Go to Demo
        </Link>
      </section>
      <Footer />
    </div>
  );
}
