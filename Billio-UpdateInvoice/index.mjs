import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import Joi from "joi";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Joi schema for update
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
}).min(1);

// Validation function
function validateUpdateInvoice(invoice) {
  const { error } = invoiceUpdateSchema.validate(invoice, {
    abortEarly: false,
  });
  if (error) {
    return error.details.map((detail) => detail.message);
  }
  return [];
}

export const handler = async (event) => {
  const invoiceId = event.pathParameters?.id;

  console.log(`[INFO] Update invoice request received for ID: ${invoiceId}`);

  if (!invoiceId) {
    console.warn("[WARN] Missing invoice ID in path parameters");
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing invoice ID in path parameters" }),
      headers: { "Content-Type": "application/json" },
    };
  }

  let updateData;
  try {
    updateData = JSON.parse(event.body || "{}");
    console.log("[INFO] Update data:", JSON.stringify(updateData));
  } catch (err) {
    console.warn("[WARN] Invalid JSON in request body");
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON in request body" }),
      headers: { "Content-Type": "application/json" },
    };
  }

  const errors = validateUpdateInvoice(updateData);
  if (errors.length) {
    console.warn("[WARN] Validation errors:", errors);
    return {
      statusCode: 400,
      body: JSON.stringify({ errors }),
      headers: { "Content-Type": "application/json" },
    };
  }

  // Prepare update expressions
  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};
  const UpdateExpressionParts = [];

  for (const key in updateData) {
    if (key === "invoice_id") continue; // never update primary key
    UpdateExpressionParts.push(`#${key} = :${key}`);
    ExpressionAttributeNames[`#${key}`] = key;
    ExpressionAttributeValues[`:${key}`] = updateData[key];
  }

  if (UpdateExpressionParts.length === 0) {
    console.warn("[WARN] No valid fields provided for update");
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No valid fields provided for update" }),
      headers: { "Content-Type": "application/json" },
    };
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
    const result = await docClient.send(new UpdateCommand(params));

    if (!result.Attributes) {
      console.warn(`[WARN] Invoice not found with ID: ${invoiceId}`);
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Invoice not found" }),
        headers: { "Content-Type": "application/json" },
      };
    }

    console.log(`[INFO] Successfully updated invoice ID: ${invoiceId}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Invoice updated successfully",
        updatedInvoice: result.Attributes,
      }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    console.error(`[ERROR] Error updating invoice ID ${invoiceId}:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: { "Content-Type": "application/json" },
    };
  }
};
