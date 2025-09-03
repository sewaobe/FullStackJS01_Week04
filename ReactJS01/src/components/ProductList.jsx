import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Pagination, Spin } from 'antd';
import { getProductsApi } from '../util/app';

const { Meta } = Card;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (page, limit) => {
    try {
      setLoading(true);
      const res = await getProductsApi(page, limit);
      console.log(res);
      setProducts(res.products);
      setPagination({
        page,
        limit,
        total: res.pagination.total,
      });
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(pagination.page, pagination.limit);
  }, []);

  const handlePageChange = (page, pageSize) => {
    fetchProducts(page, pageSize);
  };

  return (
    <div style={{ padding: 24 }}>
      {loading ? (
        <Spin tip='Đang tải sản phẩm...' />
      ) : (
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
              showSizeChanger={false} // Ẩn chọn số item mỗi trang nếu muốn
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
