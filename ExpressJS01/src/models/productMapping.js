const client = require('../config/elasticSearch');

async function createProductIndex() {
  const index = 'products';

  const exists = await client.indices.exists({ index });
  if (!exists) {
    await client.indices.create({
      index,
      body: {
        mappings: {
          properties: {
            name: { type: 'text' },
            category: { type: 'keyword' },
            price: { type: 'float' },
            discount: { type: 'boolean' },
            views: { type: 'integer' },
            image: { type: 'keyword' }, // 👈 thêm image
          },
        },
      },
    });
    console.log("Index 'products' created");
  }
}

module.exports = createProductIndex;
