const express = require("express");
const cors = require("cors");
const app = express();
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const { generatePDF } = require("./GeneratePDF");
const Joi = require("joi");
require("dotenv").config();
const fs = require("fs");

app.use(express.json());
app.use(cors());

// AWS DynamoDB Configuration
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Joi validation schema
const itemSchema = Joi.object({
  name: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().precision(2).min(0).required(),
});

const invoiceSchema = Joi.object({
  invoice_id: Joi.string().optional(), // Optional because you generate it server-side
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  name: Joi.string().required(),
  items: Joi.array().items(itemSchema).min(1).required(),
  tax: Joi.number().precision(2).min(0).required(),
  total: Joi.number().precision(2).min(0).required(),
  status: Joi.string().valid("pending", "sent", "paid").optional(),
  created_at: Joi.string().isoDate().optional(),
});


const invoiceUpdateSchema = Joi.object({
  email: Joi.string().email(),
  phone: Joi.string(),
  name: Joi.string(),
  items: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      quantity: Joi.number().required(),
      price: Joi.number().required(),
    })
  ),
  tax: Joi.number(),
  total: Joi.number(),
  status: Joi.string().valid("pending", "paid", "cancelled"),
}).min(1); // At least one field must be present


// Validation update function
function validateUpdateInvoice(invoice) {
  const { error } = invoiceUpdateSchema.validate(invoice, { abortEarly: false });
  if (error) {
    return error.details.map((detail) => detail.message);
  }
  return [];
}

// Validation function
function validateInvoice(invoice) {
  const { error } = invoiceSchema.validate(invoice, { abortEarly: false });
  if (error) {
    return error.details.map((detail) => detail.message);
  }
  return [];
}

// Function to get an invoice by ID
async function getInvoiceById(invoiceId) {
  const params = {
    TableName: "Billify",
    Key: {
      invoice_id: invoiceId,
    },
  };
  try {
    const data = await dynamoDB.get(params).promise();
    return data.Item;
  } catch (error) {
    console.error("Error fetching invoice:", error);
    throw new Error("Could not fetch invoice");
  }
}

// Create invoice
app.post("/api/invoices/create", async (req, res) => {
  console.log("Create invoice request received");
  const { email, phone, name, items, tax, total } = req.body;

  const newInvoice = {
    invoice_id: uuidv4(),
    email,
    phone,
    name,
    items,
    tax,
    total,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  const errors = validateInvoice(newInvoice);
  if (errors.length > 0) {
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
      invoice_id: newInvoice.invoice_id,
    });
  } catch (error) {
    console.error("Error saving invoice:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Generate PDF for invoice
app.get("/api/invoices/:id/pdf", async (req, res) => {
  try {
    const invoice = await getInvoiceById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    const pdfBuffer = await generatePDF(invoice);
    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=invoice.pdf",
      "Content-Length": pdfBuffer.length,
    });

    res.end(pdfBuffer);
  } catch (error) {
    console.log("HEre", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all invoices
app.get("/api/invoices/all", async (req, res) => {
  console.log("Get all invoices request received");
  const params = {
    TableName: "Billify",
  };
  try {
    const data = await dynamoDB.scan(params).promise();
    return res.json(data.Items);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Get invoice by ID
app.get("/api/invoices/:id", async (req, res) => {
  console.log(`Get invoice of ${req.params.id} request received`);
  try {
    const invoice = await getInvoiceById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    return res.json(invoice);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update invoice by ID
app.put("/api/invoices/:id", async (req, res) => {
  const invoiceId = req.params.id;
  const updateData = req.body;

  // Validate updateData against schema
  const errors = validateUpdateInvoice(updateData);
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  // Prepare the update expression and attribute values for DynamoDB
  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};
  const UpdateExpressionParts = [];

  for (const key in updateData) {
    if (key === "invoice_id") continue; // can't update primary key
    UpdateExpressionParts.push(`#${key} = :${key}`);
    ExpressionAttributeNames[`#${key}`] = key;
    ExpressionAttributeValues[`:${key}`] = updateData[key];
  }

  const params = {
    TableName: "Billify",
    Key: { invoice_id: invoiceId },
    UpdateExpression: "SET " + UpdateExpressionParts.join(", "),
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamoDB.update(params).promise();
    res.json({
      message: "Invoice updated successfully",
      updatedInvoice: result.Attributes,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete invoice by ID
app.delete("/api/invoices/:id", async (req, res) => {
  const invoiceId = req.params.id;

  const params = {
    TableName: "Billify",
    Key: { invoice_id: invoiceId },
  };

  try {
    await dynamoDB.delete(params).promise();
    res.json({ message: `Invoice ${invoiceId} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
