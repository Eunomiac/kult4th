import fs from "fs";
import readline from "readline";
import { promisify } from "util";

// Promisify fs.writeFile for async/await usage
const writeFileAsync = promisify(fs.writeFile);

// Read item-data.ts line-by-line
const inputFilePath = "../src/ts/scripts/item-data.ts";
const outputFilePath = "../src/ts/scripts/item-data-sorted.ts";

const readInterface = readline.createInterface({
  input: fs.createReadStream(inputFilePath),
  output: process.stdout,
  console: false
});

let outputData = "";
let itemData = "";
let inItemData = false;
let currentArray = null;
const arrays = {
  advantage: [],
  disadvantage: [],
  darksecret: [],
  weapon: [],
  gear: [],
  move: [],
  relation: []
};

readInterface.on("line", (line) => {
  if (line.includes("const ITEM_DATA")) {
    inItemData = true;
  }

  if (inItemData) {
    itemData += line + "\n";
    if (line.includes("};")) {
      inItemData = false;
    }
  } else {
    outputData += line + "\n";
  }

  // Capture the start of an array
  if (inItemData && line.match(/^ {2}(\w+): \[/)) {
    currentArray = line.match(/^ {2}(\w+): \[/)[1];
  }

  // Capture the end of an array
  if (inItemData && line.match(/^ {2}\],?/)) {
    currentArray = null;
  }

  // Capture items within arrays
  if (currentArray && line.match(/^ {4}\{/)) {
    let item = line + "\n";
    let nestedLevel = 1;

    const nestedLines = [];
    nestedLines.push(line);

    readInterface.on("line", (nestedLine) => {
      nestedLines.push(nestedLine);
      if (nestedLine.match(/^ {4}\{/)) nestedLevel++;
      if (nestedLine.match(/^ {4}\}/)) nestedLevel--;

      if (nestedLevel === 0) {
        if (!arrays[currentArray]) {
          console.error(`Error: currentArray is undefined. Value: ${currentArray}`);
        } else {
          arrays[currentArray].push(nestedLines.join("\n"));
        }
        return;
      }
    });
  }
});

readInterface.on("close", async () => {
  try {
    // Sort each array by the "name" value
    for (const key in arrays) {
      arrays[key].sort((a, b) => {
        const nameA = a.match(/"name":\s*"([^"]+)"/)[1];
        const nameB = b.match(/"name":\s*"([^"]+)"/)[1];
        return nameA.localeCompare(nameB);
      });
    }

    // Reconstruct the ITEM_DATA object
    let sortedItemData = "const ITEM_DATA = {\n";
    for (const key in arrays) {
      sortedItemData += `  ${key}: [\n`;
      sortedItemData += arrays[key].join(",\n");
      sortedItemData += "  ],\n";
    }
    sortedItemData += "};\nexport default ITEM_DATA;";

    // Combine the sorted ITEM_DATA with the rest of the file
    outputData += sortedItemData;

    // Write the modified content to a new file
    await writeFileAsync(outputFilePath, outputData, "utf8");
    console.log("ITEM_DATA arrays sorted successfully.");
  } catch (err) {
    console.error("Error processing files:", err);
  }
});

readInterface.on("error", (err) => {
  console.error("Error reading file:", err);
});