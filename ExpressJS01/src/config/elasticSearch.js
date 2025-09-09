const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  node: 'http://localhost:9200', // URL Elasticsearch
  auth: {
    username: 'elastic',
    password: 'r0BlFmal-10eZG*CDDcj',
  },
});

module.exports = client;
