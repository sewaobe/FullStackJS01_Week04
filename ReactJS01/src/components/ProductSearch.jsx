import React, { useState } from 'react';
import { Input } from 'antd';

const { Search } = Input;

export default function ProductSearch({ onSearch }) {
  const [keyword, setKeyword] = useState('');

  const handleSearch = (value) => {
    setKeyword(value);
    onSearch(value);
  };

  return (
    <div style={{ margin: '20px 0', textAlign: 'center' }}>
      <Search
        placeholder='Tìm kiếm sản phẩm...'
        allowClear
        enterButton='Tìm'
        size='large'
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onSearch={handleSearch}
        style={{ maxWidth: 500 }}
      />
    </div>
  );
}
