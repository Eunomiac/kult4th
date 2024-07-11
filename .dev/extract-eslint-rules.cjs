const { ESLint } = require("eslint");

async function extractRules() {
  const eslint = new ESLint();
  const config = await eslint.calculateConfigForFile("dummy.ts");

  const rulesToDisable = Object.keys(config.rules)
    .filter((rule) => rule.startsWith("@typescript-eslint/"))
    .reduce((acc, rule) => {
      acc[rule] = "off";
      return acc;
    }, {});

  console.log(JSON.stringify(rulesToDisable, null, 2));
}

extractRules().catch((error) => {
  console.error(error);
  process.exit(1);
});