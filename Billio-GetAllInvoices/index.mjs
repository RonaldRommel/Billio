import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log("[INFO] 🔍 Received request to fetch all invoices");
  console.log("[DEBUG] Request event:", JSON.stringify(event));

  const params = {
    TableName: "Billify",
  };

  try {
    const data = await docClient.send(new ScanCommand(params));
    const invoices = data?.Items || [];

    console.log(
      `[INFO] ✅ Retrieved ${invoices.length} invoice(s) from DynamoDB`
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      body: JSON.stringify({
        message: "Invoices fetched successfully",
        invoices,
      }),
    };
  } catch (error) {
    console.error("[ERROR] ❌ Failed to fetch invoices from DynamoDB");
    console.error("[DEBUG] Error details:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Failed to fetch invoices",
        details: error.message,
      }),
    };
  }
};
