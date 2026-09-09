const express = require("express");
const authRouter = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

authRouter.post("/register", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const pwd = req.body.password;
  try {
    const exists = await User.findOne({ email: email });
    if (exists) {
      return res.status(400).json({
        message: "Email da ton tai",
      });
    }
    const hashed = await bcrypt.hash(pwd, 10);
    const newUser = await User.create({
      name: name,
      email: email,
      password: hashed,
    });
    // req.session
    res.json({
      status: true,
      message: "Tao tk thanh cong",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
authRouter.post("/login", async (req, res) => {
  const email = req.body.email;
  const pwd = req.body.password;
  try {
    //tim user bang email
    const user = await User.findOne({
      email: email,
    });
    if (!user) {
      return res.status(401).json({
        message: "email hoac mat khau khong dung",
      });
    }
    //so sanh mat khau
    const validPwd = await bcrypt.compare(pwd, user.password);
    if (!validPwd) {
      return res.status(401).json({
        message: "email hoac mat khau khong dung",
      });
    }
    //luu thong tin nguoi dung vao session
    req.session.user = {
      id: user._id,
      email: user.email,
    };
    res.json({
      user: req.session.user,
      message: "Login successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

authRouter.post("/logout", (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          message: "Logout failure",
        });
      }
      res.clearCookie("connect.sid");
      return res.json({
        message: "Logout successfully",
      });
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

authRouter.put("/doimatkhau", async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const userId = req.session.user.id;

    // 2. Tìm user trong database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "Người dùng không tồn tại",
      });
    }

    // 3. Kiểm tra mật khẩu cũ có đúng không
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Mật khẩu cũ không chính xác",
      });
    }

    // 4. Mã hóa mật khẩu mới và lưu lại
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({
      status: true,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = authRouter;
