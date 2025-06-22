import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import axios from "axios";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

// DynamoDB setup
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const generatePDF = async (invoiceData) => {
  console.log(
    `[PDF] 🧾 Generating PDF for invoice_id: ${invoiceData.invoice_id}`
  );

  const imageUrl =
    "https://billio-project.s3.us-east-2.amazonaws.com/design1.jpg";
  let response;

  try {
    console.log(`[PDF] 🌐 Fetching background image: ${imageUrl}`);
    response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    console.log(
      `[PDF] ✅ Background image loaded (${response.data.length} bytes)`
    );
  } catch (error) {
    console.error(`[PDF] ❌ Failed to load background image: ${error.message}`);
    throw new Error("Failed to load background image");
  }

  try {
    const backgroundImageBytes = response.data;
    const pdfDoc = await PDFDocument.create();
    const backgroundImage = await pdfDoc.embedJpg(backgroundImageBytes);
    const width = 595.276;
    const height = 841.89;
    const page = pdfDoc.addPage([width, height]);

    page.drawImage(backgroundImage, { x: 0, y: 0, width, height });

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    let yPosition = height - 100;

    const drawText = (label, value) => {
      page.drawText(`${label}: ${value}`, {
        x: 50,
        y: yPosition,
        font,
        size: 12,
        color: rgb(0, 0, 0),
      });
      yPosition -= 20;
    };

    page.drawText("Invoice Details", { x: 50, y: yPosition, font, size: 18 });
    yPosition -= 30;

    drawText("Invoice ID", invoiceData.invoice_id);
    drawText("Created At", new Date(invoiceData.created_at).toLocaleString());
    drawText("Name", invoiceData.name);
    drawText("Email", invoiceData.email);
    drawText("Phone", invoiceData.phone || "N/A");

    yPosition -= 10;
    page.drawText("Items:", { x: 50, y: yPosition, font, size: 14 });
    yPosition -= 20;

    const headers = ["Item", "Price", "Qty", "Total"];
    const columnWidths = [200, 100, 100, 100];
    headers.forEach((h, i) => {
      page.drawText(h, {
        x: 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
        y: yPosition,
        font,
        size: 12,
      });
    });
    yPosition -= 20;

    invoiceData.items.forEach((item) => {
      const total = item.price * item.quantity;
      const row = [
        item.name,
        `$${item.price.toFixed(2)}`,
        item.quantity,
        `$${total.toFixed(2)}`,
      ];
      row.forEach((val, i) => {
        page.drawText(String(val), {
          x: 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
          y: yPosition,
          font,
          size: 12,
        });
      });
      yPosition -= 20;
    });

    const subtotal = invoiceData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    drawText("Subtotal", `$${subtotal.toFixed(2)}`);
    drawText("Tax", `$${invoiceData.tax.toFixed(2)}`);
    drawText("Total", `$${invoiceData.total.toFixed(2)}`);

    const pdfBytes = await pdfDoc.save();
    console.log(
      `[PDF] ✅ PDF generation successful (${pdfBytes.length} bytes)`
    );
    return pdfBytes;
  } catch (error) {
    console.error(`[PDF] ❌ Error generating PDF: ${error.message}`);
    throw new Error("Failed to generate PDF");
  }
};

export const handler = async (event) => {
  console.log("[HANDLER] 📥 PDF generation request received");
  const invoiceId = event.pathParameters?.id;

  if (!invoiceId) {
    console.warn("[HANDLER] ⚠️ Missing invoice ID in request");
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing invoice ID" }),
    };
  }

  console.log(`[HANDLER] 🔎 Fetching invoice from DynamoDB (ID: ${invoiceId})`);
  let data;
  try {
    data = await docClient.send(
      new GetCommand({
        TableName: "Billify",
        Key: { invoice_id: invoiceId },
      })
    );
  } catch (error) {
    console.error("[HANDLER] ❌ DynamoDB fetch failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error accessing database" }),
    };
  }

  if (!data.Item) {
    console.warn(`[HANDLER] ❌ Invoice not found (ID: ${invoiceId})`);
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Invoice not found" }),
    };
  }

  try {
    const pdfBuffer = await generatePDF(data.Item);
    console.log("[HANDLER] ✅ Sending PDF back as base64");
    console.log("PDF byte length:", pdfBuffer.length);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=invoice.pdf",
        "Content-Length": pdfBuffer.length.toString(),
      },
      body: pdfBuffer.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error("[HANDLER] ❌ PDF generation failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to generate PDF" }),
    };
  }
};
