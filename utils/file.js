const fs = require("fs").promises;
const path = require("path");

async function file(name) {
  const casesFilePath = path.join(__dirname, "..", name);
  try {
    const data = await fs.readFile(casesFilePath, "utf8");
    const casesData = JSON.parse(data);
    return casesData;
  } catch (err) {
    return {};
  }
}

module.exports = file;
