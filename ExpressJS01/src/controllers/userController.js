const {
  createUserService,
  loginService,
  getUserService,
  findByEmail,
  updatePassword
} = require('../services/userService');
const otpService = require('../services/otpService');
const mailer = require('../services/mailService');
const bcrypt = require('bcrypt')
const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const data = await createUserService(name, email, password);
  return res.status(200).json(data);
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  const data = await loginService(email, password);
  return res.status(200).json(data);
};

const getUser = async (req, res) => {
  const data = await getUserService();
  return res.status(200).json(data);
};

const getAccount = async (req, res) => {
  return res.status(200).json(req.user);
};

const forgotPassword = async (req, res) => {
  console.log(req.body);
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: 'Email is required' });
    const user = await findByEmail(email);
    console.log(user);

    if (!user) {
      return res.status(404).json({ msg: 'Email not found' });
    }
    const otp = otpService.generateOTP(email);

    await mailer.sendMail({
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    });

    res.json({ status: 200,msg: 'OTP sent successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error sending OTP' });
  }
};

const verifyOtp =async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // 1. Kiểm tra OTP
    const result = otpService.verifyOTP(email, otp);
    if (!result.success) {
      return res.status(400).json({ msg: result.msg });
    }

    // 2. Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Cập nhật mật khẩu trong DB
    await updatePassword(email, hashedPassword);

    return res.json({
      status: 200,
      msg: "Password reset successfully!"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
module.exports = {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  forgotPassword, 
  verifyOtp
};
