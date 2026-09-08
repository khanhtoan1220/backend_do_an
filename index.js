const app = require("./app");
const config = require("./config/env");
const connectDB = require("./config/db");

const startServer = async () => {
  console.log("CONFIG PORT =", config.port);
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log("🚀 Server đang chạy tại: http://localhost:" + config.port);
    });
  } catch (error) {
    console.error("❌ Lỗi khởi động server:", error.message);
    process.exit(1);
  }
};

startServer();
