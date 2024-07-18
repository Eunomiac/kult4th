import fs from "fs";
import readline from "readline";
import Papa from "papaparse";
import { promisify } from "util";

// Promisify fs.writeFile for async/await usage
const writeFileAsync = promisify(fs.writeFile);

try {
  // Load CSV data
  const csvData = fs.readFileSync("../public/data/item-short-descs.csv", "utf8");
  const parsedData = Papa.parse(csvData, { header: true }).data;

  // Create a mapping of item names to their shortDesc values
  const shortDescMap = parsedData.reduce((acc, item) => {
    acc[item.name] = item.shortDesc;
    return acc;
  }, {});

  // Read item-data.ts line-by-line
  const inputFilePath = "../src/ts/scripts/item-data.ts";
  const outputFilePath = "../src/ts/scripts/item-data-updated.ts";

  const readInterface = readline.createInterface({
    input: fs.createReadStream(inputFilePath),
    output: process.stdout,
    console: false
  });

  let outputData = "";
  let traitName = "";

  readInterface.on("line", (line) => {
    // Check if the line contains the name property and extract the name
    if (/^ {6}"name"/.test(line)) {
      // Extract value in double quotes
      traitName = line.split('"')[3];
    }

    // Check if the line contains the system property
    if (/^ *"system"/.test(line)) {
      // Capture number of spaces before "system"
      const indent = line.match(/^ */)[0];
      // Add shortDesc to the next line of the system block, increasing indent of the next line by two spaces compared to the "system" line
      outputData += `${line}\n${indent}  shortDesc: "${shortDescMap[traitName]}",\n`;
    } else {
      outputData += line + "\n";
    }
  });

  readInterface.on("close", async () => {
    try {
      // Write the modified content to a new file
      await writeFileAsync(outputFilePath, outputData, "utf8");
      console.log("shortDesc properties added successfully.");
    } catch (err) {
      console.error("Error writing to file:", err);
    }
  });

  readInterface.on("error", (err) => {
    console.error("Error reading file:", err);
  });
} catch (err) {
  console.error("Error processing files:", err);
}