// generateTemplate.js (ESM version)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatesDir = path.join(__dirname, "assets/templates");

function getTemplates() {
  const categories = fs.readdirSync(templatesDir);

  return categories.map((category, index) => {
    const folderPath = path.join(templatesDir, category);
    const files = fs.readdirSync(folderPath);

    return {
      id: `${index + 1}`,
      category,
      templates: files.map((file, i) => ({
        id: `${category}_${i + 1}`,
        image: `${category}/${file}`,
      })),
    };
  });
}

const data = getTemplates();

// Save JSON
fs.writeFileSync(
  path.join(__dirname, "assets/templates/templates.json"),
  JSON.stringify(data, null, 2)
);

// Generate imageMap.js
let imports = "";
let exports = "export const imageMap = {\n";

data.forEach((cat) => {
  cat.templates.forEach((t) => {
    const key = `${t.image}`;
    const varName = key.replace(/[^a-zA-Z0-9]/g, "_");
    imports += `import ${varName} from "./${t.image}";\n`;
    exports += `  "${key}": ${varName},\n`;
  });
});

exports += "};\n";

fs.writeFileSync(
  path.join(__dirname, "assets/templates/imageMap.js"),
  imports + "\n" + exports
);

console.log("✅ templates.json & imageMap.js generated!");
