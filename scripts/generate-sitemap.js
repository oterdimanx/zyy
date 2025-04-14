const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const SITE_URL = 'https://zyysk8club.com';

async function fetchData() {
  const client = new MongoClient('mongodb+srv://local:lJ4Ks2MxaDxI8fsG@zyyclusterinstance.6nl8lxl.mongodb.net/?retryWrites=true&w=majority&appName=ZyyClusterInstance');

  try {
    await client.connect();
    const db = client.db('zyyLocal');

    const products = await db.collection('products').find().toArray();
    const categories = await db.collection('categories').find().toArray();

    return {
      products: products.map(p => ({
        id: p._id.toString(),
        slug: p.slug,
        updatedAt: p.updatedAt || new Date().toISOString(),
        name: p.productName || 'Unnamed Product',
        image: p.ProductImage || p.image || p.productImage || 'https://firebasestorage.googleapis.com/v0/b/your-bucket/o/default.jpg',
      })),
      categories: categories.map(c => ({
        id: c._id.toString(),
        updatedAt: c.updatedAt || new Date().toISOString(),
        name: c.categoryName || 'Unnamed Category',
      })),
    };
  } catch (err) {
    console.error('Mongo fetch error:', err);
    return { products: [], categories: [] };
  } finally {
    await client.close();
  }
}

function buildSitemap(products, categories) {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  const urlsetOpen = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;
  const urlsetClose = `</urlset>`;

  const staticPages = [
    {
      loc: `${SITE_URL}/Shop`,
      lastmod: '2025-04-10',
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      loc: `${SITE_URL}/Lookbook`,
      lastmod: '2025-04-10',
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      loc: `${SITE_URL}/Archive`,
      lastmod: '2025-04-10',
      changefreq: 'monthly',
      priority: 0.8,
    },
  ];

  const staticXML = staticPages.map(p => `
  <url>
    <loc>${p.loc}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`);

  const productXML = products.map(p => `
  <url>
    <loc>${SITE_URL}/product/product-detail/${p.id}</loc>
    <lastmod>${p.updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <image:image>
      <image:loc>${p.image}</image:loc>
      <image:title><![CDATA[${p.name}]]></image:title>
    </image:image>
  </url>`);

  const categoryXML = categories.map(c => `
  <url>
    <loc>${SITE_URL}/category/category-product/${c.id}</loc>
    <lastmod>${c.updatedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);

  return xmlHeader + urlsetOpen + staticXML.join('\n') + productXML.join('\n') + categoryXML.join('\n') + '\n' + urlsetClose;
}

async function generate() {
  const { products, categories } = await fetchData();
  const xml = buildSitemap(products, categories);

  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml);
  console.log('✅ Full sitemap generated at public/sitemap.xml');
}

generate();
