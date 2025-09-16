import { useState } from 'react';
import ProductList from '../components/ProductList';
import ProductSearch from '../components/ProductSearch';
import ProductFilter from '../components/ProductFilter';
function ProductPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filters, setFilters] = useState({});

  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: 20 }}>Danh sách sản phẩm</h1>

      {/* Search */}
      <ProductSearch onSearch={(keyword) => setSearchKeyword(keyword)} />

      {/* Filter */}
      <ProductFilter onFilter={(f) => setFilters(f)} />

      {/* Product List */}
      <ProductList searchKeyword={searchKeyword} filters={filters} />
    </div>
  );
}

export default ProductPage;
