import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const invoiceId = event.pathParameters?.id;

  console.log("Fetching invoice with ID:", invoiceId);

  if (!invoiceId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing invoice ID in path parameters" }),
      headers: { "Content-Type": "application/json" },
    };
  }

  const params = {
    TableName: "Billify",
    Key: { invoice_id: invoiceId },
  };

  try {
    const result = await docClient.send(new GetCommand(params));

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Invoice not found" }),
        headers: { "Content-Type": "application/json" },
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Invoice fetched successfully",
        invoice: result.Item,
      }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: { "Content-Type": "application/json" },
    };
  }
};
