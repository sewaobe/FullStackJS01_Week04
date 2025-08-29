import axios from './axios.customize';

const createUserApi = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = {
        name,
        email,
        password
    }
    return axios.post(URL_API, data)
}

const loginApi = (email, password) => {
    const URL_API = "/v1/api/login";
    const data = {
        email,
        password
    }
    return axios.post(URL_API, data);
}

const getUserApi = () => {
    const URL_API = "/v1/api/user";
    return axios.get(URL_API);
}

const sendOtpApi = (email) => {
  const URL_API = "/v1/api/forgot-password";
  return axios.post(URL_API, { email });
};

// Verify OTP forgot password
const verifyOtpApi = (email, otp, newPassword) => {
  const URL_API = "/v1/api/verify-otp";
  return axios.post(URL_API, { email, otp, newPassword });
};


export {
    createUserApi, loginApi, getUserApi, sendOtpApi, verifyOtpApi
}