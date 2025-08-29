let otpStore = {}; // { email: { otp, expireTime } }

const generateOTP = (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expireTime = Date.now() + 5 * 60 * 1000; // 5 phút

  otpStore[email] = { otp, expireTime };
  return otp;
};

const verifyOTP = (email, otp) => {
    console.log(otpStore);
  if (!otpStore[email]) {
    return { success: false, msg: 'No OTP request found' };
  }

  const { otp: storedOtp, expireTime } = otpStore[email];

  if (Date.now() > expireTime) {
    delete otpStore[email];
    return { success: false, msg: 'OTP expired' };
  }

  if (otp !== storedOtp) {
    return { success: false, msg: 'Invalid OTP' };
  }

  delete otpStore[email]; // Xóa sau khi verify thành công
  return { success: true, msg: 'OTP verified' };
};

module.exports = { generateOTP, verifyOTP };
