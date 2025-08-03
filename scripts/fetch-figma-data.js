require("dotenv").config();
const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

const FIGMA_FILE_ID = process.env.FIGMA_FILE_ID;
const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;

if (!FIGMA_FILE_ID || !FIGMA_ACCESS_TOKEN) {
  console.error(
    "Error: FIGMA_FILE_ID and FIGMA_ACCESS_TOKEN must be set in your .env file.",
  );
  process.exit(1);
}

const figmaApi = axios.create({
  baseURL: "https://api.figma.com/v1/",
  headers: {
    "X-Figma-Token": FIGMA_ACCESS_TOKEN,
  },
});

async function fetchFigmaData() {
  try {
    console.log(`Fetching Figma data for file ID: ${FIGMA_FILE_ID}...`);
    const response = await figmaApi.get(`files/${FIGMA_FILE_ID}`);
    const figmaData = response.data;

    const outputPath = path.join(__dirname, "..", "figma-data.json");
    await fs.writeFile(outputPath, JSON.stringify(figmaData, null, 2), "utf8");

    console.log(
      `✅ Figma data successfully fetched and saved to ${outputPath}`,
    );
  } catch (error) {
    console.error(
      "❌ Error fetching Figma data:",
      error.response ? error.response.data : error.message,
    );
    process.exit(1);
  }
}

fetchFigmaData();
