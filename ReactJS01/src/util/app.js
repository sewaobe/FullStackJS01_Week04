import axios from './axios.customize';

const createUserApi = (name, email, password) => {
  const URL_API = '/v1/api/register';
  const data = {
    name,
    email,
    password,
  };
  return axios.post(URL_API, data);
};

const loginApi = (email, password) => {
  const URL_API = '/v1/api/login';
  const data = {
    email,
    password,
  };
  return axios.post(URL_API, data);
};

const getUserApi = () => {
  const URL_API = '/v1/api/user';
  return axios.get(URL_API);
};

const sendOtpApi = (email) => {
  const URL_API = '/v1/api/forgot-password';
  return axios.post(URL_API, { email });
};

// Verify OTP forgot password
const verifyOtpApi = (email, otp, newPassword) => {
  const URL_API = '/v1/api/verify-otp';
  return axios.post(URL_API, { email, otp, newPassword });
};

const getProductsApi = async (page = 1, limit = 10) => {
  const URL_API = `/v1/api/products?page=${page}&limit=${limit}`;
  const res = await axios.get(URL_API);

  return res;
};

const searchProductsApi = async ({
  keyword,
  category,
  minPrice,
  maxPrice,
  discount,
  page = 1,
  limit = 8,
} = {}) => {
  const URL_API = `/v1/api/products/search`;

  const params = { page, limit };

  if (keyword) params.keyword = keyword;
  if (category) params.category = category;
  if (minPrice !== undefined) params.minPrice = minPrice;
  if (maxPrice !== undefined) params.maxPrice = maxPrice;
  if (discount !== undefined) params.discount = discount;

  const res = await axios.get(URL_API, { params });
  return res;
};
const getCategoriesApi = async () => {
  const URL_API = '/v1/api/categories';
  const res = await axios.get(URL_API);
  console.log('Categories', res);
  return res; // giả sử backend trả về [{ _id, name }]
};

export {
  createUserApi,
  loginApi,
  getUserApi,
  sendOtpApi,
  verifyOtpApi,
  getProductsApi,
  searchProductsApi,
  getCategoriesApi,
};
