const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "./global.css");

if (fs.existsSync(filePath)) {
  fs.unlinkSync(filePath);
  console.log("global.css telah dihapus sebelum build");
} else {
  console.log("global.css tidak ditemukan");
}
