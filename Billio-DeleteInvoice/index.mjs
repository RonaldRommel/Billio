import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const invoiceId = event.pathParameters?.id;

  console.log("[INFO] 🔥 Delete invoice request received");
  console.log("[DEBUG] Path parameters:", JSON.stringify(event.pathParameters));

  if (!invoiceId) {
    console.warn("[WARN] ❗ Missing invoice ID in path parameters");
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Missing invoice ID in path parameters",
      }),
    };
  }

  const params = {
    TableName: "Billify",
    Key: { invoice_id: invoiceId },
  };

  try {
    await docClient.send(new DeleteCommand(params));

    console.log(
      `[INFO] ✅ Invoice with ID '${invoiceId}' deleted successfully`
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Invoice deleted successfully" }),
    };
  } catch (error) {
    console.error(`[ERROR] ❌ Failed to delete invoice with ID '${invoiceId}'`);
    console.error("[DEBUG] Error details:", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Failed to delete invoice",
        details: error.message,
      }),
    };
  }
};
