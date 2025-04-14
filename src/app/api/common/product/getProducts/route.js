/** Api Endpoint used for sitemap generation in next-sitemap.config.js */
const { MongoClient } = require('mongodb');

async function GET(req) {
  const client = new MongoClient(process.env.DB_URI);
  try {
    await client.connect();
    //console.log('MongoDB connected');
    const db = client.db(process.env.DB_NAME);

    // Fetch products
    const products = await db.collection('products').find().toArray();
    const productData = products.map(p => {
      //console.log('Raw product from MongoDB:', p); // Log raw document
      return {
        id: p._id.toString(),
        slug: p.slug,
        updatedAt: p.updatedAt || '2025-04-10',
        productName: p.productName || 'Unnamed Product',
        ProductImage: p.ProductImage || p.image || p.productImage || 'https://firebasestorage.googleapis.com/v0/b/your-bucket/o/default.jpg', // Fallback
        productPrice: p.productPrice || '0.00',
      };
    });

    // Fetch categories
    const categories = await db.collection('categories').find().toArray();
    const categoryData = categories.map(c => ({
      id: c._id.toString(),
      updatedAt: c.updatedAt || '2025-04-10',
      categoryName: c.categoryName || 'Unnamed Category',
    }));

    //console.log('MongoDB products:', productData);
    //console.log('MongoDB categories:', categoryData);

    return Response.json({
      products: productData,
      categories: categoryData,
    });
  } catch (error) {
    console.error('MongoDB error:', error);
    return Response.json({
      products: [
        { id: '1', slug: 'pro-deck-001', updatedAt: '2025-04-07', productName: 'Pro Deck', ProductImage: 'https://firebasestorage.googleapis.com/v0/b/your-bucket/o/pro-deck.jpg', productPrice: '99.99' },
        { id: '2', slug: 'trucks-xyz', updatedAt: '2025-04-06', productName: 'Trucks XYZ', ProductImage: 'https://firebasestorage.googleapis.com/v0/b/your-bucket/o/trucks.jpg', productPrice: '49.99' },
      ],
      categories: [
        { id: 'cat1', updatedAt: '2025-04-10', categoryName: 'Decks' },
        { id: 'cat2', updatedAt: '2025-04-10', categoryName: 'Trucks' },
      ],
    });
  } finally {
    await client.close();
    console.log('MongoDB closed');
  }
}

module.exports = { GET };