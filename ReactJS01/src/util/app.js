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

// Lấy chi tiết sản phẩm theo ID
const getDetailProduct = async (productId) => {
  const URL_API = `/v1/api/products/${productId}`;
  const res = await axios.get(URL_API);
  console.log(res);
  return res; // giả sử backend trả về { product: {...} }
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

const toggleFavoriteApi = async (productId) => {
  const URL_API = `/v1/api/products/favorites/${productId}`;
  // Backend yêu cầu user login → cần gửi kèm token/headers
  const res = await axios.post(URL_API);
  return res; // { favorited: true } hoặc { favorited: false }
};

// Lấy danh sách sản phẩm yêu thích
const getFavoritesApi = async (page = 1, limit = 10) => {
  const URL_API = `/v1/api/products/favorites?page=${page}&limit=${limit}`;
  const res = await axios.get(URL_API);
  return res; // { data: [...] }
};

// Lấy danh sách comment theo productId
const getCommentsApi = async (productId) => {
  const URL_API = `/v1/api/products/${productId}/comments`;
  const res = await axios.get(URL_API);
  return res; // { data: [...] }
};

// Tạo comment mới
const createCommentApi = async (productId, content) => {
  const URL_API = `/v1/api/products/${productId}/comments`;
  const res = await axios.post(URL_API, { content });
  return res; // { success: true, comment: {...} }
};
const incrementViewApi = async (productId) => {
  const URL_API = `/v1/api/products/${productId}/view`;
  try {
    const res = await axios.post(URL_API);
    return res; // backend trả về { success: true, viewsCount: 123 }
  } catch (err) {
    console.error('Lỗi khi tăng view:', err);
    return null;
  }
};

const getRecentlyViewed = async (page = 1, limit = 10) => {
  const URL_API = '/v1/api/products/users/me/views';
  try {
    const res = await axios.get(URL_API, { params: { page, limit } });
    return res.data || [];
  } catch (err) {
    console.error('Lỗi khi lấy sản phẩm đã xem gần đây:', err);
    return [];
  }
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
  toggleFavoriteApi,
  getFavoritesApi,
  getDetailProduct,
  getCommentsApi,
  createCommentApi,
  incrementViewApi,
  getRecentlyViewed,
};
