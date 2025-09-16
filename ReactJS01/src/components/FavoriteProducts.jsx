import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Empty } from 'antd';
import { getFavoritesApi, toggleFavoriteApi } from '../util/app';
import { HeartFilled } from '@ant-design/icons';

const { Meta } = Card;

const FavoriteProducts = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await getFavoritesApi(1, 50); // lấy tối đa 50 sp
      // giả sử backend trả về { favorites: [ { product: {...} } ] }
      setFavorites(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy sản phẩm yêu thích:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (productId) => {
    try {
      const res = await toggleFavoriteApi(productId);
      if (!res.favorited) {
        // bỏ sản phẩm khỏi danh sách
        setFavorites((prev) => prev.filter((p) => p._id !== productId));
      }
    } catch (err) {
      console.error('Lỗi khi bỏ yêu thích:', err);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      {loading ? (
        <Spin tip='Đang tải sản phẩm yêu thích...' />
      ) : favorites.length > 0 ? (
        <Row gutter={[16, 16]}>
          {favorites.map((product) => (
            <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <img
                    alt={product.name}
                    src={product.image || 'https://via.placeholder.com/300'}
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                }
                actions={[
                  <HeartFilled
                    key='fav'
                    style={{ color: 'red', fontSize: 20 }}
                    onClick={() => handleToggleFavorite(product._id)}
                  />,
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
      ) : (
        <Empty description='Bạn chưa có sản phẩm yêu thích nào' />
      )}
    </div>
  );
};

export default FavoriteProducts;
