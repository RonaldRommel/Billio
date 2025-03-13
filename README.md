# Automated Invoice Generator (Work in Progress)

## 📌 Overview
This project is a **serverless automated invoice generator** designed to allow businesses (such as restaurants) to generate and send invoices **paperlessly**. It provides an API for:
- Creating and storing invoices in **AWS DynamoDB**.
- Generating **PDF invoices** using Puppeteer.
- Retrieving and updating invoices.
- Future enhancements include **emailing invoices**, **Dockerization**, **API Gateway**, and **CloudWatch logging**.

## 🚀 Features
- **Create Invoices**: Generates and stores invoices with unique IDs.
- **Retrieve Invoices**: Fetch all invoices or a specific invoice.
- **Update Invoices**: Modify invoice details, including status.
- **Generate PDF**: Converts invoice details into a professional PDF.
- **Planned Enhancements**:
  - **Send Invoices via Email** (using Nodemailer/SMTP instead of AWS SES).
  - **Implement API Gateway** for better API management.
  - **Dockerization** for easy deployment.
  - **Logging with AWS CloudWatch**.
  - **Convert to AWS Lambda for serverless operation**.

## 🛠 Technologies Used
| **Technology** | **Purpose** |
|--------------|------------|
| **Node.js (Express.js)** | Backend API development |
| **AWS DynamoDB** | NoSQL database to store invoices |
| **Puppeteer** | PDF invoice generation |
| **Nodemailer (Planned)** | Email invoices to customers |
| **AWS API Gateway (Planned)** | Expose APIs securely |
| **AWS CloudWatch (Planned)** | Logging and monitoring |
| **AWS Lambda (Planned)** | Serverless invoice processing |
| **Docker (Planned)** | Containerization for deployment |

## 📂 API Endpoints
### 1️⃣ **Create an Invoice**
**Endpoint:** `POST /api/invoices/create`
- **Description:** Creates a new invoice and stores it in DynamoDB.
- **Request Body:**
```json
{
  "email": "customer@example.com",
  "phone": "1234567890",
  "items": [
    { "name": "Burger", "quantity": 2, "price": 10.0 }
  ],
  "tax": 2.0,
  "total": 22.0
}
```
- **Response:**
```json
{
  "message": "Invoice created successfully",
  "invoice_id": "UUID"
}
```

### 2️⃣ **Retrieve All Invoices**
**Endpoint:** `GET /api/invoices/all`
- **Response:** Returns a list of invoices from DynamoDB.

### 3️⃣ **Retrieve an Invoice by ID**
**Endpoint:** `GET /api/invoices/:id`
- **Response:** Returns invoice details for the given `invoice_id`.

### 4️⃣ **Update an Invoice**
**Endpoint:** `PUT /api/invoices/:id`
- **Description:** Updates an invoice's details, including status (`pending`, `sent`, `paid`).
- **Request Body:**
```json
{
  "status": "paid"
}
```
- **Response:**
```json
{
  "message": "Invoice updated successfully",
  "updatedInvoice": { ... }
}
```

### 5️⃣ **Generate and Send Invoice PDF**
**Endpoint:** `POST /api/invoices/:id/send`
- **Description:** Generates a PDF invoice and (in the future) will send it via email.
- **Response:**
```json
{
  "message": "Invoice sent successfully!"
}
```

## 🔧 How to Run Locally
### **1️⃣ Clone Repository**
```bash
git clone https://github.com/your-username/invoice-generator.git
cd invoice-generator
```
### **2️⃣ Install Dependencies**
```bash
npm install
```
### **3️⃣ Set Up Environment Variables**
Create a `.env` file in the root directory:
```
AWS_REGION=your-region
AWS_ACCESS_KEY=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```
### **4️⃣ Run the Server**
```bash
node server.js
```
Server runs on **port 3001** by default.

## 📌 Project Roadmap (Work in Progress)
1. **Implement Emailing Functionality** → Use **Nodemailer or SendGrid** to send invoices.
2. **Dockerization** → Create a `Dockerfile` and containerize the application.
3. **API Gateway Integration** → Expose APIs via **AWS API Gateway**.
4. **Logging & Monitoring** → Implement **AWS CloudWatch** for tracking logs.
5. **Serverless Migration** → Convert Express.js routes to **AWS Lambda**.

## 📜 License
This project is licensed under **MIT**.

## 👥 Contributors
- **Ronald Rommel Myloth** (Project Owner)

🚀 **This project is actively being developed. Stay tuned for more updates!**