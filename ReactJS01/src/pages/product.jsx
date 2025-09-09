import { useState } from 'react';
import ProductList from '../components/ProductList';
import ProductSearch from '../components/ProductSearch';
import ProductFilter from '../components/ProductFilter';

function ProductPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filters, setFilters] = useState({});

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', margin: 20 }}>Danh sách sản phẩm</h1>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 10,
          flexWrap: 'wrap',
        }}
      >
        <ProductSearch onSearch={(keyword) => setSearchKeyword(keyword)} />
        <ProductFilter onFilter={(f) => setFilters(f)} />
      </div>
      <ProductList searchKeyword={searchKeyword} filters={filters} />
    </div>
  );
}

export default ProductPage;
