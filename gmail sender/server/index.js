// server/index.js
const path = require("path");
const fs = require("fs");
const express = require("express");
const multer = require("multer");
const helmet = require("helmet");
const cors = require("cors");
const { parse } = require("csv-parse/sync");
const nodemailer = require("nodemailer");

require("dotenv").config({
  path: path.join(__dirname, "..", ".env")
});

const app = express();
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

// security middlewares
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ensure uploads folder exists
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// serve frontend
app.use(express.static(path.join(__dirname, "..", "public")));

// multer for CSV/images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"))
});
const upload = multer({ storage });

// parse emails from textarea
function parseEmailsText(txt) {
  if (!txt) return [];
  return txt.split(/[\n,;]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

// parse CSV emails
function parseCsvEmails(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const records = parse(raw, { columns: true, skip_empty_lines: true });
  if (records.length === 0) return [];

  const headers = Object.keys(records[0]).map(k => k.toLowerCase());
  const emailKey = headers.includes("email")
    ? Object.keys(records[0]).find(k => k.toLowerCase() === "email")
    : Object.keys(records[0])[0];

  return records
    .map(r => r[emailKey]?.trim())
    .filter(Boolean);
}

// create nodemailer transporter
function createTransport() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });
}

// POST /send
app.post(
  "/send",
  upload.fields([{ name: "csvFile", maxCount: 1 }, { name: "images", maxCount: 2 }]),
  async (req, res) => {
    try {
      const { emailsText, subject, body } = req.body;

      const manualList = parseEmailsText(emailsText);
      let csvList = [];

      if (req.files?.csvFile?.[0]) {
        csvList = parseCsvEmails(req.files.csvFile[0].path);
      }

      const emails = Array.from(new Set([...manualList, ...csvList]));

      if (emails.length === 0) {
        return res.status(400).json({ success: false, error: "No recipient emails provided" });
      }

      const attachments = req.files?.images?.map(f => ({
        filename: f.originalname,
        path: f.path
      })) || [];

      const transporter = createTransport();
      try {
        await transporter.verify();
      } catch {
        return res.status(500).json({
          success: false,
          error: "Email transporter cannot login. Check .env credentials."
        });
      }

      const results = [];
      for (const to of emails) {
        try {
          const info = await transporter.sendMail({
            from: process.env.EMAIL_ADDRESS,
            to,
            subject: subject || "(no subject)",
            text: body?.replace(/<\/?[^>]+(>|$)/g, "") || "",
            html: body || "",
            attachments
          });

          results.push({ to, success: true, info: info.response });

          await new Promise(r => setTimeout(r, 600)); // gmail friendly delay
        } catch (err) {
          results.push({ to, success: false, error: err.message });
        }
      }

      // cleanup uploaded files
      if (req.files) {
        Object.values(req.files).flat().forEach(file => {
          fs.unlink(file.path, () => {});
        });
      }

      res.json({ success: true, total: emails.length, results });

    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// fallback serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running: http://localhost:${port}`));
