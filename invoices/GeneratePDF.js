const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const axios = require("axios");

const generatePDF = async (invoiceData) => {
  try {
    // Load and compile the Handlebars template
    // const templatePath = path.join(__dirname, "template.html");
    // const templateHTML = fs.readFileSync(templatePath, "utf8");
    const templatePath =
      "https://billio-project.s3.us-east-2.amazonaws.com/template.html";
    const templateHTML = await axios.get(templatePath);
    const template = handlebars.compile(templateHTML.data);

    // Format the data for Handlebars
    const compiledHTML = template({
      invoice_id: "*****" + invoiceData.invoice_id.slice(-6),
      date: invoiceData.created_at,
      business_name: "Company XYZ",
      business_address: "123 Tech Street, Seattle, WA",
      business_email: "companyXYZ@gmail.com",
      customer_name: invoiceData.name,
      customer_email: invoiceData.email,
      items: invoiceData.items,
      tax: invoiceData.tax,
      total: invoiceData.total,
    });

    // Generate the PDF as a buffer
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(compiledHTML, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();
    return pdfBuffer;
  } catch (err) {
    console.error("Error generating PDF:", err);
    throw err;
  }
};

module.exports = { generatePDF };
