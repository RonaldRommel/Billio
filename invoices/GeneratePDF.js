const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const generatePDF = async (invoiceData) => {
  const templatePath = path.join(__dirname, "template.html");
  let templateHTML = fs.readFileSync(templatePath, "utf8");
  const headers = Object.keys(invoiceData.items[0]);

  // Replace placeholders with actual data
  templateHTML = templateHTML
    .replace("{{invoice_id}}", invoiceData.invoice_id)
    .replace("{{date}}", invoiceData.created_at)
    .replace("{{business_name}}", "Billify Inc.")
    .replace("{{business_address}}", "123 Tech Street, Seattle, WA")
    .replace("{{business_email}}", "billify@gmail.com")
    .replace("{{customer_name}}", invoiceData.data.name)
    .replace("{{customer_email}}", invoiceData.email)
    .replace("{{subtotal}}", invoiceData.subtotal)
    .replace("{{tax}}", invoiceData.tax)
    .replace("{{total}}", invoiceData.total)
    .replace(
      "{{items_header}}",
      headers.map((item) => `<td>${item}</td>`).join("")
    )
    .replace(
      "{{items}}",
      invoiceData.items
        .map(
          (item) =>
            `<tr>
                ${Object.keys(item)
                  .map((key) => `<td>${item[key]}</td>`)
                  .join("")}
            </tr>`
        )
        .join("")
    );

  // Launch Puppeteer and generate PDF
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(templateHTML);

  const pdfPath = path.join(__dirname, `invoice_${invoiceData.invoice_id}.pdf`);
  await page.pdf({ path: pdfPath, format: "A4" });

  await browser.close();
  return pdfPath; // Return the file path
};

module.exports = {
  generatePDF,
};

// Example invoice data
// const invoiceData = {
//     invoice_id: "INV-001",
//     date: new Date().toISOString().split("T")[0],
//     business_name: "Blockhouse Inc.",
//     business_address: "123 Tech Street, Seattle, WA",
//     business_email: "contact@blockhouse.com",
//     customer_name: "John Doe",
//     customer_email: "johndoe@example.com",
//     items: [
//         { name: "Burger", quantity: 2, price: 10.0 },
//         { name: "Soda", quantity: 1, price: 2.5 }
//     ],
//     subtotal: "22.50",
//     tax: "1.50",
//     total: "24.00"
// };

// // Run the function to generate a PDF
// generatePDF(invoiceData).then((pdfPath) => {
//     console.log("PDF Generated:", pdfPath);
// });
