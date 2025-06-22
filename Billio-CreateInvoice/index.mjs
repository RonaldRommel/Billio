import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const itemSchema = Joi.object({
  name: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().precision(2).min(0).required(),
});

const invoiceSchema = Joi.object({
  invoice_id: Joi.string().optional(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  name: Joi.string().required(),
  items: Joi.array().items(itemSchema).min(1).required(),
  tax: Joi.number().precision(2).min(0).required(),
  total: Joi.number().precision(2).min(0).required(),
  status: Joi.string().valid("pending", "sent", "paid").optional(),
  created_at: Joi.string().isoDate().optional(),
});

function validateInvoice(invoice) {
  const { error } = invoiceSchema.validate(invoice, { abortEarly: false });
  if (error) {
    return error.details.map((detail) => detail.message);
  }
  return [];
}

export const handler = async (event) => {
  console.log("[INFO] 📥 Create invoice request received");
  console.debug("[DEBUG] Raw event body:", event.body);

  let requestBody;

  try {
    requestBody = JSON.parse(event.body || "{}");
  } catch (err) {
    console.warn("[WARN] ❗ Invalid JSON in request body");
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Invalid JSON in request body" }),
    };
  }

  const { email, phone, name, items, tax, total } = requestBody;

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

  console.debug("[DEBUG] Constructed invoice object:", newInvoice);

  const errors = validateInvoice(newInvoice);
  if (errors.length > 0) {
    console.warn("[WARN] ❗ Validation failed:", errors);
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ errors }),
    };
  }

  const params = {
    TableName: "Billify",
    Item: newInvoice,
  };

  try {
    await docClient.send(new PutCommand(params));
    console.log(
      `[INFO] ✅ Invoice created successfully with ID: ${newInvoice.invoice_id}`
    );

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Invoice created successfully",
        invoice_id: newInvoice.invoice_id,
      }),
    };
  } catch (error) {
    console.error("[ERROR] ❌ Failed to save invoice:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Failed to create invoice",
        details: error.message,
      }),
    };
  }
};
