# 🚀 Billio Invoice Generator (Work in Progress)

---

## 📌 Overview

**Billio Invoice Generator** is a **serverless, lightweight invoicing tool** designed for small businesses to generate, store, and manage professional invoices **paperlessly**. It uses modern AWS services and lightweight libraries for a scalable, cost-effective solution.

- Invoices securely stored in **AWS DynamoDB**
- PDF invoice templates hosted on **AWS S3**
- PDF generation done on-demand in **AWS Lambda** using **pdf-lib** (lightweight, no Puppeteer)
- APIs exposed via **AWS API Gateway**

Open your browser at: [https://billiofront.onrender.com](https://billiofront.onrender.com)

---

## ✨ Features

- ✅ Create, Retrieve, and Update invoices in DynamoDB
- ✅ Dynamically generate PDF invoices in Lambda using pdf-lib and S3-hosted templates
- ✅ Serverless architecture reduces maintenance and cost
- 🔜 Future: Email invoices, enhanced CloudWatch logging, CI/CD & containerization

---

## 🛠 Technologies Used

| Technology          | Purpose                                       |
| ------------------- | --------------------------------------------- |
| **AWS Lambda**      | Serverless backend for API and PDF generation |
| **AWS API Gateway** | API routing and security                      |
| **AWS DynamoDB**    | NoSQL invoice storage                         |
| **AWS S3**          | Hosting static PDF invoice templates          |
| **pdf-lib**         | Lightweight PDF generation in Lambda          |
| **Node.js**         | Lambda runtime                                |

---

## 📂 API Endpoints

| Endpoint             | Method | Description                              |
| -------------------- | ------ | ---------------------------------------- |
| `/invoices`          | POST   | Create and store a new invoice           |
| `/invoices`          | GET    | Retrieve all invoices                    |
| `/invoices/{id}`     | GET    | Retrieve invoice by ID                   |
| `/invoices/{id}`     | PUT    | Update invoice details                   |
| `/invoices/{id}`     | DELETE | Delete invoice details                   |
| `/invoices/{id}/pdf` | GET    | Generate and return PDF invoice (base64) |

---

## 🛠 Local Development Setup

### Prerequisites

- AWS credentials configured with permissions for Lambda, DynamoDB, S3, and API Gateway
- Node.js v18+ recommended

### Steps

```bash
git clone https://github.com/RonaldRommel/Billio.git
AWS Lambda Setup
Upload each folder as a separate Lambda function in AWS Lambda:
- Billio-CreateInvoice
- Billio-GetIndividualInvoice
- Billio-DeleteInvoice
- Billio-UpdateInvoice
- Billio-GetAllInvoices
- Billio-GeneratePDF

AWS API Gateway Setup
- Create a REST API in AWS API Gateway
- Configure REST methods to integrate with corresponding Lambda functions
# To run frontend
cd billio-frontend
npm install
npm run dev




```
