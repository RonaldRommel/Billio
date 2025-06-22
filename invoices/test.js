import { PDFDocument, rgb, StandardFonts }  from 'pdf-lib';
import fs from 'fs';
import axios from 'axios';

// async function createPdf(invoiceData) {
//   // Load your background image
//   const backgroundImageBytes = fs.readFileSync('design1.jpg');

//   // Create a new PDF document
//   const pdfDoc = await PDFDocument.create();

//   // Embed the background image
//   const backgroundImage = await pdfDoc.embedJpg(backgroundImageBytes);

//   // A4 size in points (595.276 x 841.890)
//   const width = 595.276;
//   const height = 841.890;

//   // Add a page with A4 dimensions
//   const page = pdfDoc.addPage([width, height]);

//   // Draw the background image (scaled to fit the page)
//   page.drawImage(backgroundImage, {
//     x: 0,
//     y: 0,
//     width: width,
//     height: height,
//   });

//   // Embed the Helvetica font
//   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

//   // Starting Y-position for the content
//   let yPosition = height - 100;

//   // Title: Invoice Info
//   page.drawText('Invoice Details', {
//     x: 50,
//     y: yPosition,
//     font,
//     size: 18,
//     color: rgb(0, 0, 0),
//   });
//   yPosition -= 30;

//   // Drawing basic information (name, email, etc.)
//   page.drawText(`Invoice ID: ${invoiceData.invoice_id}`, {
//     x: 50,
//     y: yPosition,
//     font,
//     size: 12,
//     color: rgb(0, 0, 0),
//   });
//   yPosition -= 20;
//   page.drawText(`Created At: ${new Date(invoiceData.created_at).toLocaleString()}`, {
//     x: 50,
//     y: yPosition,
//     font,
//     size: 12,
//     color: rgb(0, 0, 0),
//   });
//   yPosition -= 20;
//   page.drawText(`Name: ${invoiceData.name}`, {
//     x: 50,
//     y: yPosition,
//     font,
//     size: 12,
//     color: rgb(0, 0, 0),
//   });
//   yPosition -= 20;
//   page.drawText(`Email: ${invoiceData.email}`, {
//     x: 50,
//     y: yPosition,
//     font,
//     size: 12,
//     color: rgb(0, 0, 0),
//   });
//   yPosition -= 20;
//   page.drawText(`Phone: ${invoiceData.phone}`, {
//     x: 50,
//     y: yPosition,
//     font,
//     size: 12,
//     color: rgb(0, 0, 0),
//   });
//   yPosition -= 30;

//   // Title: Items Table
//   page.drawText('Items', {
//     x: 50,
//     y: yPosition,
//     font,
//     size: 14,
//     color: rgb(0, 0, 0),
//   });
//   yPosition -= 20;

//   // Drawing table headers
//   const headers = ['Item', 'Price', 'Quantity', 'Total'];
//   const columnWidths = [200, 100, 100, 100];

//   // Draw table headers
//   page.drawText(headers[0], { x: 50, y: yPosition, font, size: 12, color: rgb(0, 0, 0) });
//   page.drawText(headers[1], { x: 50 + columnWidths[0], y: yPosition, font, size: 12, color: rgb(0, 0, 0) });
//   page.drawText(headers[2], { x: 50 + columnWidths[0] + columnWidths[1], y: yPosition, font, size: 12, color: rgb(0, 0, 0) });
//   page.drawText(headers[3], { x: 50 + columnWidths[0] + columnWidths[1] + columnWidths[2], y: yPosition, font, size: 12, color: rgb(0, 0, 0) });
//   yPosition -= 20;

//   // Drawing table rows for each item
//   invoiceData.items.forEach(item => {
//     const total = item.price * item.quantity;

//     page.drawText(item.name, { x: 50, y: yPosition, font, size: 12, color: rgb(0, 0, 0) });
//     page.drawText(`$${item.price.toFixed(2)}`, { x: 50 + columnWidths[0], y: yPosition, font, size: 12, color: rgb(0, 0, 0) });
//     page.drawText(`${item.quantity}`, { x: 50 + columnWidths[0] + columnWidths[1], y: yPosition, font, size: 12, color: rgb(0, 0, 0) });
//     page.drawText(`$${total.toFixed(2)}`, { x: 50 + columnWidths[0] + columnWidths[1] + columnWidths[2], y: yPosition, font, size: 12, color: rgb(0, 0, 0) });

//     yPosition -= 20;
//   });

//   // Drawing totals
//   page.drawText('Subtotal:', { x: 50, y: yPosition, font, size: 12, color: rgb(0, 0, 0) });
//   page.drawText(`$${(invoiceData.items.reduce((sum, item) => sum + item.price * item.quantity, 0)).toFixed(2)}`, {
//     x: 50 + columnWidths[0] + columnWidths[1] + columnWidths[2], y: yPosition, font, size: 12, color: rgb(0, 0, 0)
//   });
//   yPosition -= 20;

//   page.drawText('Tax:', { x: 50, y: yPosition, font, size: 12, color: rgb(0, 0, 0) });
//   page.drawText(`$${invoiceData.tax.toFixed(2)}`, {
//     x: 50 + columnWidths[0] + columnWidths[1] + columnWidths[2], y: yPosition, font, size: 12, color: rgb(0, 0, 0)
//   });
//   yPosition -= 20;

//   page.drawText('Total:', { x: 50, y: yPosition, font, size: 12, color: rgb(0, 0, 0) });
//   page.drawText(`$${invoiceData.total.toFixed(2)}`, {
//     x: 50 + columnWidths[0] + columnWidths[1] + columnWidths[2], y: yPosition, font, size: 12, color: rgb(0, 0, 0)
//   });

//   // Save the PDF document
//   const pdfBytes = await pdfDoc.save();

//   // Write the PDF to a file
//   fs.writeFileSync('invoice_output.pdf', pdfBytes);

//   console.log('PDF created successfully!');
// }


const generatePDF = async (invoiceData) => {
  console.log(`[PDF] 🧾 Generating PDF for invoice_id: ${invoiceData.invoice_id}`);

  const imageUrl = "https://billio-project.s3.us-east-2.amazonaws.com/design1.jpg";
  let response;

  try {
    console.log(`[PDF] 🌐 Fetching background image: ${imageUrl}`);
    response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    console.log(`[PDF] ✅ Background image loaded (${response.data.length} bytes)`);
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
        `$${total.toFixed(2)}`
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

    const subtotal = invoiceData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    drawText("Subtotal", `$${subtotal.toFixed(2)}`);
    drawText("Tax", `$${invoiceData.tax.toFixed(2)}`);
    drawText("Total", `$${invoiceData.total.toFixed(2)}`);

    const pdfBytes = await pdfDoc.save();
    console.log(`[PDF] ✅ PDF generation successful (${pdfBytes.length} bytes)`);
    return pdfBytes;
  } catch (error) {
    console.error(`[PDF] ❌ Error generating PDF: ${error.message}`);
    throw new Error("Failed to generate PDF");
  }
};

// Sample invoice data
const invoiceData = {
  "created_at": "2025-06-02T03:13:48.839Z",
  "invoice_id": "f63e69f4-3975-4819-b2c5-6bcc526be31a",
  "status": "pending",
  "tax": 203,
  "total": 2648,
  "email": "julia.reed@cloudcore.io",
  "items": [
    { "name": "Cloud Setup", "price": 600, "quantity": 1 },
    { "name": "Server Maintenance", "price": 200, "quantity": 2 },
    { "name": "Security Audit", "price": 350, "quantity": 1 },
    { "name": "Email Integration", "price": 75, "quantity": 3 },
    { "name": "Custom Dashboard", "price": 900, "quantity": 1 }
  ],
  "name": "Julia Reed",
  "phone": "6463217890"
};

// Create PDF with the invoice data
// createPdf(invoiceData);
const pdfBytes = await generatePDF(invoiceData);
  fs.writeFileSync('invoice_output.pdf', pdfBytes);
