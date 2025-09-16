import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Spin,
  Empty,
  Typography,
  Button,
  Tag,
  List,
  Card,
  Input,
  message,
} from 'antd';
import {
  HeartOutlined,
  HeartFilled,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import {
  getDetailProduct,
  toggleFavoriteApi,
  getCommentsApi,
  createCommentApi,
  incrementViewApi, // ← import API tăng view
} from '../util/app';

const { Title, Paragraph } = Typography;
const { Meta } = Card;
const { TextArea } = Input;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [stats, setStats] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // --- Fetch product detail ---
  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const res = await getDetailProduct(id);
      setProduct(res.product);
      setStats(res.stats);
      setSimilar(res.similar || []);
      setFavorited(res.isFavorited || false);
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết sản phẩm:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch comments ---
  const fetchComments = async () => {
    try {
      const res = await getCommentsApi(id);
      setComments(res.data || []);
    } catch (err) {
      console.error('Lỗi khi lấy comments:', err);
    }
  };

  useEffect(() => {
    fetchProductDetail();
    fetchComments();

    // --- Tăng view sau 5 giây ---
    const viewTimeout = setTimeout(async () => {
      try {
        const res = await incrementViewApi(id);
        if (res && res.viewsCount !== undefined) {
          setStats((prev) => ({ ...prev, viewsCount: res.viewsCount }));
        }
      } catch (err) {
        console.error('Lỗi khi tăng view:', err);
      }
    }, 5000);

    return () => clearTimeout(viewTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // --- Toggle favorite ---
  const handleToggleFavorite = async () => {
    try {
      const res = await toggleFavoriteApi(id);
      setFavorited(res.isFavorited);
    } catch (err) {
      console.error('Lỗi khi toggle yêu thích:', err);
    }
  };

  // --- Create comment ---
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      message.warning('Vui lòng nhập nội dung bình luận');
      return;
    }
    try {
      await createCommentApi(id, newComment);
      message.success('Bình luận thành công');
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Lỗi khi tạo comment:', err);
      message.error('Không thể gửi bình luận');
    }
  };

  if (loading) return <Spin tip='Đang tải chi tiết sản phẩm...' />;

  if (!product) return <Empty description='Không tìm thấy sản phẩm' />;

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      {/* Nút quay lại */}
      <Button
        type='default'
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </Button>

      <Row gutter={[32, 32]}>
        {/* Bên trái: Hình ảnh */}
        <Col xs={24} md={10}>
          <img
            alt={product.name}
            src={product.image || 'https://via.placeholder.com/400'}
            style={{
              width: '100%',
              height: 400,
              objectFit: 'cover',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
        </Col>

        {/* Bên phải: Thông tin chi tiết */}
        <Col xs={24} md={14}>
          <div>
            <Title level={2}>{product.name}</Title>
            <Paragraph type='secondary'>{product.description}</Paragraph>

            <Paragraph>
              <b>Giá: </b>
              <span style={{ fontSize: 20, color: '#d4380d' }}>
                {product.price.toLocaleString()} VND
              </span>
            </Paragraph>

            <Paragraph>
              <b>Danh mục: </b> {product.category?.name || 'N/A'}
            </Paragraph>
            <Paragraph>
              <b>Khuyến mãi: </b> {product.discount}%
            </Paragraph>

            {/* Stats */}
            {stats && (
              <>
                <Paragraph>
                  <b>Lượt xem: </b> {stats.viewsCount}
                </Paragraph>
                <Paragraph>
                  <b>Yêu thích: </b> {stats.favoritesCount}
                </Paragraph>
                <Paragraph>
                  <b>Người mua: </b> {stats.buyersCount}
                </Paragraph>
                <Paragraph>
                  <b>Bình luận: </b> {stats.commentsCount}
                </Paragraph>
              </>
            )}

            {/* Tags */}
            <div style={{ margin: '12px 0' }}>
              {product.tags?.map((tag) => (
                <Tag key={tag} color='blue'>
                  {tag}
                </Tag>
              ))}
            </div>

            {/* Nút yêu thích */}
            <Button
              type={favorited ? 'primary' : 'default'}
              danger={favorited}
              icon={
                favorited ? (
                  <HeartFilled style={{ color: 'white' }} />
                ) : (
                  <HeartOutlined />
                )
              }
              onClick={handleToggleFavorite}
            >
              {favorited ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
            </Button>
          </div>
        </Col>
      </Row>

      {/* Bình luận */}
      <div style={{ marginTop: 40 }}>
        <Title level={3}>Bình luận</Title>

        {/* Form nhập bình luận */}
        <div style={{ marginBottom: 16 }}>
          <TextArea
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder='Viết bình luận...'
          />
          <Button
            type='primary'
            style={{ marginTop: 8 }}
            onClick={handleAddComment}
          >
            Gửi bình luận
          </Button>
        </div>

        {/* Danh sách comment */}
        <List
          dataSource={comments}
          locale={{ emptyText: 'Chưa có bình luận' }}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={<b>{item.user?.name || 'Ẩn danh'}</b>}
                description={item.content || item.text}
              />
            </List.Item>
          )}
        />
      </div>

      {/* Sản phẩm tương tự */}
      <div style={{ marginTop: 40 }}>
        <Title level={3}>Sản phẩm tương tự</Title>
        {similar.length > 0 ? (
          <Row gutter={[16, 16]}>
            {similar.map((sp) => (
              <Col key={sp._id} xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={sp.name}
                      src={sp.image}
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  }
                  onClick={() => navigate(`/products/${sp._id}`)}
                >
                  <Meta
                    title={sp.name}
                    description={`${sp.price.toLocaleString()} VND`}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description='Sản phẩm tương tự chưa có' />
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
