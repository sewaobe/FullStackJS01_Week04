import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Empty, Button } from 'antd';
import { getRecentlyViewed } from '../util/app';

const { Meta } = Card;

const RecentlyViewedProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 8; // số sản phẩm trên 1 trang

  const fetchRecentlyViewed = async (page) => {
    try {
      setLoading(true);
      const data = await getRecentlyViewed(page, limit);
      setProducts(data);
    } catch (err) {
      console.error('Lỗi khi lấy sản phẩm đã xem gần đây:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentlyViewed(page);
  }, [page]);

  return (
    <div style={{ padding: 24 }}>
      {loading ? (
        <Spin tip='Đang tải sản phẩm đã xem gần đây...' />
      ) : products.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {products.map((product) => (
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
                  onClick={() =>
                    window.location.assign(`/products/${product._id}`)
                  }
                >
                  <Meta
                    title={product.name}
                    description={
                      <>
                        <p>{product.description || 'Không có mô tả'}</p>
                        <b>Giá: {product.price.toLocaleString()} VND</b>
                      </>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {/* Nút phân trang */}
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              style={{ marginRight: 8 }}
            >
              Trang trước
            </Button>
            <Button onClick={() => setPage((prev) => prev + 1)}>
              Trang sau
            </Button>
          </div>
        </>
      ) : (
        <Empty description='Chưa có sản phẩm đã xem gần đây' />
      )}
    </div>
  );
};

export default RecentlyViewedProduct;
