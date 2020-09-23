const multer = require("multer");

const uploadLocal = multer({
  dest: "./public/uploads/",
});

module.exports = uploadLocal;
