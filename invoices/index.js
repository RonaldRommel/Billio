const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const { generatePDF } = require("./GeneratePDF");
require('dotenv').config();

// AWS DynamoDB Configuration
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const dynamoDB = new AWS.DynamoDB.DocumentClient();

app.post("/api/invoices/create", async (req, res) => {
  console.log("Create invoice request received");
  const {
    invoice_id,
    email,
    phone,
    items,
    tax,
    total,
    status,
    created_at,
    ...data
  } = req.body;
  const newInvoice = {
    invoice_id: uuidv4(),
    email,
    phone,
    items: items,
    tax,
    total,
    status: "pending",
    created_at: new Date().toISOString(),
    data: data,
  };
  const errors = validateInvoice(newInvoice);
  if (errors.length) {
    return res.status(400).json({ errors });
  }
  const params = {
    TableName: "Billify",
    Item: newInvoice,
  };
  try {
    await dynamoDB.put(params).promise();
    return res.status(201).json({
      message: "Invoice created successfully",
      invoice_id: newInvoice.id,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.put("/api/invoices/:id", async (req, res) => {
  console.log("Update invoice request received");
  const invoiceId = req.params.id;
  const {
    invoice_id,
    email,
    phone,
    items,
    tax,
    total,
    status,
    created_at,
    ...data
  } = req.body;

  // Prepare the update expression and attribute values
  let updateExpression = "SET";
  let expressionAttributeValues = {};

  // Dynamically add fields to update based on request body
  if (email) {
    updateExpression += " #email = :email";
    expressionAttributeValues[":email"] = email;
  }
  if (phone) {
    if (updateExpression !== "SET") updateExpression += ",";
    updateExpression += " #phone = :phone";
    expressionAttributeValues[":phone"] = phone;
  }
  if (items) {
    if (updateExpression !== "SET") updateExpression += ",";
    updateExpression += " #items = :items";
    expressionAttributeValues[":items"] = items;
  }
  if (tax) {
    if (updateExpression !== "SET") updateExpression += ",";
    updateExpression += " #tax = :tax";
    expressionAttributeValues[":tax"] = tax;
  }
  if (total) {
    if (updateExpression !== "SET") updateExpression += ",";
    updateExpression += " #total = :total";
    expressionAttributeValues[":total"] = total;
  }
  if (status) {
    if (updateExpression !== "SET") updateExpression += ",";
    updateExpression += " #status = :status";
    expressionAttributeValues[":status"] = status;
  }
  if (data) {
    if (updateExpression !== "SET") updateExpression += ",";
    updateExpression += " #data = :data";
    expressionAttributeValues[":data"] = data;
  }

  // Define attribute names to handle reserved words (e.g., 'status')
  const expressionAttributeNames = {
    "#email": "email",
    "#phone": "phone",
    "#items": "items",
    "#tax": "tax",
    "#total": "total",
    "#status": "status",
    "#data": "data",
  };

  const params = {
    TableName: "Billify",
    Key: {
      invoice_id: invoiceId, // The key of the invoice to update
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: expressionAttributeNames,
    ReturnValues: "ALL_NEW", // Return the updated item
  };

  try {
    // Perform the update operation
    const result = await dynamoDB.update(params).promise();
    return res.status(200).json({
      message: "Invoice updated successfully",
      updatedInvoice: result.Attributes, // Return the updated item
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/invoices/:id/send", (req, res) => {
  console.log("PDF send request received");
  const {
    invoice_id,
    email,
    phone,
    items,
    tax,
    total,
    status,
    created_at,
    ...data
  } = req.body;
  const newInvoice = {
    invoice_id: invoice_id.slice(-4),
    email,
    phone,
    items: items,
    tax,
    total,
    status,
    created_at: new Date().toISOString(),
    data: data,
  };
  const errors = validateInvoice(newInvoice);
  if (errors.length) {
    return res.status(400).json({ errors });
  }
  generatePDF(newInvoice).then((pdfPath) => {
    console.log("PDF Generated:", pdfPath);
  });
  res.json({
    message: `Invoice ${invoice_id} sent successfully!`,
  });
});

app.get("/api/invoices/all", async (req, res) => {
  console.log("Get all invoices request received");
  const params = {
    TableName: "Billify",
  };
  try {
    const data = await dynamoDB.scan(params).promise();
    return res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/invoices/:id", async (req, res) => {
  console.log(`Get invoice of ${req.params.id} request received`);
  const params = {
    TableName: "Billify",
    Key: {
      invoice_id: req.params.id,
    },
  };
  try {
    const data = await dynamoDB.get(params).promise();
    if (!data.Item) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    return res.json(data.Item);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});

const validateInvoice = (invoice) => {
  const { id, email, phone, items, tax, total, status, created_at } = invoice;
  let errors = [];

  // 🔹 Validate required fields
  if ((!email && !phone) || !items || !total) {
    errors.push("Missing required fields: email or phone, items, total");
  }

  // 🔹 Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    errors.push("Invalid email format");
  }

  // Validate Phone number format XXXXXXXXXX
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  // Validate items is present and not 0
  if (!Array.isArray(items) || items.length === 0) {
    errors.push("Items must be a non-empty array");
  }

  // Validate total is a positive
  if (isNaN(total) || total <= 0) {
    errors.push("Total must be a positive number");
  }

  // Validate tax is a number greater than or equal to 0
  if (isNaN(tax) || tax < 0) {
    errors.push("Tax must be a number greater than or equal to 0");
  }

  // Validate status is one of "pending", "sent", or "paid"
  const validStatuses = ["pending", "sent", "paid"];
  if (status && !validStatuses.includes(status)) {
    errors.push(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  return errors;
};
