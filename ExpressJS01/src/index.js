require('dotenv').config();

//import các nguồn cần dùng
const express = require('express'); //commonjs
const configViewEngine = require('./config/viewEngine');
const apiRoutes = require('./routes/api.js');
const productRoutes = require('./routes/product.route.js');
const categoryRoutes = require('./routes/category.route.js');

const connection = require('./config/database');
const { getHomepage } = require('./controllers/homeController.js');
const cors = require('cors');
const { syncProductsToElastic } = require('./services/productService.js');
const app = express(); //cấu hình app là express
//cấu hình port, nếu tìm thấy port trong env, không thì trả về 8888
const port = process.env.PORT || 8888;
app.use(cors()); //config cors
app.use(express.json()); //config req.body cho json
app.use(express.urlencoded({ extended: true })); // for form data
configViewEngine(app); //config template engine
//config route cho view ejs
const webAPI = express.Router();
webAPI.get('/', getHomepage);
app.use('/', webAPI);
syncProductsToElastic();
//khai báo route cho API
app.use('/v1/api', apiRoutes);
app.use('/v1/api/products', productRoutes);
app.use('/v1/api/categories', categoryRoutes);

(async () => {
  try {
    //kết nối database using mongoose
    await connection();
    //lắng nghe port trong env
    app.listen(port, () => {
      console.log(`Backend Nodejs App listening on port ${port}`);
    });
  } catch (error) {
    console.log('>>> Error connect to DB: ', error);
  }
})();
