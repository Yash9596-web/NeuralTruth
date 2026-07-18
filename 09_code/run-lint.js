const { ESLint } = require("eslint");
const fs = require("fs");

(async function main() {
  try {
    const eslint = new ESLint();
    const results = await eslint.lintFiles(["src/**/*.ts", "src/**/*.tsx"]);
    const formatter = await eslint.loadFormatter("json");
    const resultText = await formatter.format(results);
    fs.writeFileSync("lint-results.json", resultText);
    console.log("Linting complete.");
  } catch (error) {
    console.error("Error running ESLint programmatically:", error);
  }
})();
