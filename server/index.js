const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const path = require("path");
const database = require("./config/database");

const adminRoutes = require("./routers/admin/index.route");
const clientRoutes = require("./routers/client/index.route");
const variableConfig = require("./config/variable");

const port = 3000;
const app = express();

// Kết nối database
database.connect();

// Thiết lập views
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'pug');

// Thiết lập thư mục chứa file tĩnh của Frontend
app.use(express.static(path.join(__dirname, "public")));

// Tạo biến toàn cục trong file PUG
app.locals.pathAdmin = variableConfig.pathAdmin;

// Tạo biến toàn cục trong các file BE
global.pathAdmin = variableConfig.pathAdmin;

// Cho phép gửi data lên dạng json
app.use(express.json());

// sử dụng cookie-parser
app.use(cookieParser());

// Thiết lập đường dẫn
app.use(`/${variableConfig.pathAdmin}`, adminRoutes);
app.use("/", clientRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
