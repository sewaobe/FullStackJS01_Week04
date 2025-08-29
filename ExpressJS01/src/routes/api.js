const express = require('express');
const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  forgotPassword,
  verifyOtp
} = require('../controllers/userController.js');
const auth = require('../middleware/auth.js');
const delay = require('../middleware/delay.js');

const routerAPI = express.Router();

routerAPI.get('/', (req, res) => {
  return res.status(200).json('Hello world api');
});

routerAPI.post('/register', createUser);
routerAPI.post('/login', handleLogin);

routerAPI.get('/user', getUser);
routerAPI.get('/account', delay, getAccount);

routerAPI.post('/forgot-password', forgotPassword);
routerAPI.post('/verify-otp', verifyOtp);
module.exports = routerAPI; //export default
