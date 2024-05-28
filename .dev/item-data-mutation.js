import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import ITEM_DATA from "./item-data.js";

function createEdge(sourceSchema, edgeString, isOverwriting) {
  const [, name, desc] = edgeString.trim().match(/#>text-edgename>([^<]+)<# &mdash; (.+)$/) ?? [];
  const descPhrase = `... to ${desc.charAt(0).toLowerCase()}${desc.slice(1)}`
    .replace(/to all allies get/, "to give all allies")
    .replace(/to you or one of your allies'/, "to have you or one of your allies'")
    .replace(/to you or an ally receive/, "to have you or an ally receive")
    .replace(/\.\.\. to you/, "... to");
  if (sourceSchema.system.subItems.some((subItem) => subItem.name === name)) {
    if (!isOverwriting) { return; }
    sourceSchema.system.subItems = sourceSchema.system.subItems.filter((subItem) => subItem.name !== name);
  }
  sourceSchema.system.subItems.push({
    "name": name,
    "type": "move",
    "img": sourceSchema.img,
    "system": {
      "chatName": name,
      "sourceItem": {
        "name": sourceSchema.name,
        "type": sourceSchema.type
      },
      "isCustom": false,
      "isEdge": true,
      "rules": {
        "outro": descPhrase
      },
      "subType": "active-static",
      "key": sourceSchema.system.key
    }
  });
}

function createEdges(sourceSchema, isOverwriting = false) {
  // First check whether this schema confers edges.
  if (!("edges" in sourceSchema.system.lists)) { return; }

  // Get the list of edges
  const edges = sourceSchema.system.lists.edges.items;

  // Create an edge submove for each one
  edges.forEach((edgeString) => createEdge(sourceSchema, edgeString, isOverwriting));
}

function MutateSubItemSchema(schema) {
  /* Delete 'attribute' from non-active-rolled sub-items */
  if (["active-static", "passive"].includes(schema.system.subType)) {
    delete schema.system.attribute;
  }

  return schema;
}

function MutateItemSchema(schema) {
  /* Delete 'attribute' from non-active-rolled items */
  if (["active-static", "passive"].includes(schema.system.subType)) {
    delete schema.system.attribute;
  }

  /* Create edges */
  createEdges(schema, true);

  if (schema.system.subItems) {
    schema.system.subItems = schema.system.subItems.map(MutateSubItemSchema);
  }
  return schema;
}

function MutateItemData() {
  Object.keys(ITEM_DATA).forEach((itemType) => {
    ITEM_DATA[itemType] = ITEM_DATA[itemType].map(MutateItemSchema);
  });
}

/**
 * Processes the item data by mutating it and then writing the mutated data to a new JSON file.
 */
function processAndSaveItemData() {
  // Stringify the existing data
  const existingDataJSON = JSON.stringify(ITEM_DATA, null, 2);
  // Make a safe copy of existing data
  const existingData = JSON.parse(existingDataJSON);
  // Write the existing data to a backup JSON file `./item-data-backups/item-data-backup-<timestamp>.jsonc`
  const timestamp = new Date().toISOString().replace(/:/g, "-");
  fs.writeFileSync(
    `./item-data-backups/item-data-backup-${timestamp}.js`,
    `export default const ITEM_DATA = ${existingDataJSON}`,
    "utf8"
  );
  // Call the function to mutate the item data based on custom logic
  MutateItemData();

  // Convert the mutated data back to a JSON string
  const mutatedDataJs = `
  const ITEM_DATA = ${JSON.stringify(ITEM_DATA, null, 2)};

  const PREV_DATA = ${existingDataJSON};

  export default ITEM_DATA;

  export { PREV_DATA };
  `;

  // Write the mutated data to both a .js and .ts file for use within Foundry
  fs.writeFileSync(
    "./item-data.js",
    mutatedDataJs,
    "utf8"
  );
  fs.writeFileSync(
    "../src/ts/scripts/item-data.ts",
    mutatedDataJs,
    "utf8"
  );
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if the script is being run directly from the command line
if (process.argv[1] === __filename) {
  processAndSaveItemData();
}
