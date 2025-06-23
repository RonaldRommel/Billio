// In LandingPage.jsx or your landing component
import styles from "../pages/LandingPage.module.css";

function TechnologiesUsed() {
  return (
    <section className={`mt-5 ${styles.techSection}`}>
      <h2 className="mb-4 text-center">🚀 Technologies Used</h2>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          ⚛️ <strong>React.js + Vite</strong> – Lightning-fast frontend
          development
        </li>
        <li className="list-group-item">
          🖥 <strong>AWS Lambda</strong> – Serverless backend for PDF generation
        </li>
        <li className="list-group-item">
          🌐 <strong>API Gateway</strong> – RESTful API layer for secure
          endpoints
        </li>
        <li className="list-group-item">
          🗂 <strong>AWS S3</strong> – For hosting invoice background and static
          assets
        </li>
        <li className="list-group-item">
          🔐 <strong>AWS IAM</strong> – Role-based access control to manage
          resources
        </li>
        <li className="list-group-item">
          📦 <strong>AWS DynamoDB</strong> – NoSQL database for storing invoices
        </li>
      </ul>
    </section>
  );
}

export default TechnologiesUsed;
