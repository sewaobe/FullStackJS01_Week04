import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Pagination, Spin, Empty } from 'antd';
import {
  getProductsApi,
  searchProductsApi,
  toggleFavoriteApi,
  getFavoritesApi, // 👈 thêm API
} from '../util/app';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;

const ProductList = ({ searchKeyword, filters }) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const navigate = useNavigate();
  // 🔥 Gọi API lấy danh sách yêu thích khi component mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await getFavoritesApi(1, 100);
        console.log(res);
        // giả sử res.data = { favorites: [ { product: { _id, name, ... } } ] }
        const ids = res.data.map((f) => f._id);
        setFavoriteIds(new Set(ids));
      } catch (err) {
        console.error('Lỗi khi lấy danh sách yêu thích:', err);
      }
    };
    fetchFavorites();
  }, []);

  const fetchProducts = async (page = 1, limit = 8) => {
    try {
      setLoading(true);

      const hasKeyword = searchKeyword && searchKeyword.trim() !== '';
      const hasFilter = filters && Object.keys(filters).length > 0;

      const res =
        hasKeyword || hasFilter
          ? await searchProductsApi({
              keyword: searchKeyword,
              ...filters,
              page,
              limit,
            })
          : await getProductsApi(page, limit);

      setProducts(res.products || []);
      setPagination({
        page: res.pagination?.page || 1,
        limit: res.pagination?.limit || limit,
        total: res.pagination?.total || 0,
      });
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reload khi searchKeyword hoặc filters thay đổi → reset page = 1
  useEffect(() => {
    fetchProducts(1, pagination.limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword, filters]);

  const handlePageChange = (page, pageSize) => {
    fetchProducts(page, pageSize);
  };

  const handleToggleFavorite = async (productId) => {
    try {
      const res = await toggleFavoriteApi(productId);
      setFavoriteIds((prev) => {
        const newSet = new Set(prev);
        if (res.favorited) {
          newSet.add(productId);
        } else {
          newSet.delete(productId);
        }
        return newSet;
      });
    } catch (err) {
      console.error('Lỗi khi toggle yêu thích:', err);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      {loading ? (
        <Spin tip='Đang tải sản phẩm...' />
      ) : products.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col
                key={product._id || product.id}
                xs={24}
                sm={12}
                md={8}
                lg={6}
              >
                <Card
                  hoverable
                  onClick={() =>
                    navigate(`/products/${product._id || product.id}`)
                  } // 👈 thêm
                  cover={
                    <img
                      alt={product.name}
                      src={product.image || 'https://via.placeholder.com/300'}
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  }
                  actions={[
                    favoriteIds.has(product._id || product.id) ? (
                      <HeartFilled
                        key='fav'
                        style={{ color: 'red', fontSize: 20 }}
                        onClick={() =>
                          handleToggleFavorite(product._id || product.id)
                        }
                      />
                    ) : (
                      <HeartOutlined
                        key='fav'
                        style={{ fontSize: 20 }}
                        onClick={() =>
                          handleToggleFavorite(product._id || product.id)
                        }
                      />
                    ),
                  ]}
                >
                  <Meta
                    title={product.name}
                    description={
                      <>
                        <p>{product.description || 'Không có mô tả'}</p>
                        <b>Giá: {product.price} VND</b>
                      </>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>

          <div
            style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}
          >
            <Pagination
              current={pagination.page}
              pageSize={pagination.limit}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      ) : (
        <Empty description='Không tìm thấy sản phẩm nào' />
      )}
    </div>
  );
};

export default ProductList;
