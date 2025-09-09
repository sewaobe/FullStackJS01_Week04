import React, { useState, useEffect } from 'react';
import { Select, InputNumber, Checkbox, Button, Space } from 'antd';
import { getCategoriesApi } from '../util/app';

const { Option } = Select;

export default function ProductFilter({ onFilter }) {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [discount, setDiscount] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategoriesApi(); // backend trả về mảng luôn
        setCategories(res || []);
      } catch (err) {
        console.error('Lỗi lấy danh mục:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleApply = () => {
    const filter = {};
    if (category) filter.category = category;
    if (minPrice !== undefined) filter.minPrice = minPrice;
    if (maxPrice !== undefined) filter.maxPrice = maxPrice;
    if (discount) filter.discount = discount;

    onFilter(filter);
  };

  const handleReset = () => {
    setCategory('');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setDiscount(false);
    onFilter({});
  };

  return (
    <Space wrap style={{ marginBottom: 20 }}>
      <Select
        placeholder='Chọn danh mục'
        value={category || undefined}
        onChange={setCategory}
        style={{ minWidth: 150 }}
        allowClear
      >
        {categories.map((cat) => (
          <Option key={cat._id} value={cat._id}>
            {cat.name}
          </Option>
        ))}
      </Select>

      <InputNumber
        placeholder='Giá từ'
        value={minPrice}
        min={0}
        onChange={setMinPrice}
        style={{ width: 120 }}
      />

      <InputNumber
        placeholder='Giá đến'
        value={maxPrice}
        min={0}
        onChange={setMaxPrice}
        style={{ width: 120 }}
      />

      <Checkbox
        checked={discount}
        onChange={(e) => setDiscount(e.target.checked)}
      >
        Có khuyến mãi
      </Checkbox>

      <Button type='primary' onClick={handleApply}>
        Áp dụng
      </Button>
      <Button onClick={handleReset}>Đặt lại</Button>
    </Space>
  );
}
