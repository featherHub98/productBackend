const router = require('express').Router();
const serviceProduct = require('../services/serviceProducts.ts');
const jwtService = require("../services/jwtService.ts");

router.get('/products', jwtService.verifyToken, async (req: any, res: any) => {
  try {
    const products = await serviceProduct.getProducts(req, res);
    console.log("products:", products);
    res.json({ products: products });
  } catch (error) {
    switch (error) {
      case 500:
        return res.status(500).json({ message: "Server error" });
      case 404:
        return res.status(404).json({ message: "No products found" });
      default:
        return res.status(500).json({ message: "Unknown error" });
    }
  }
});

router.get('/products/:id', jwtService.verifyToken, async (req: any, res: any) => {
  try {
    const products = await serviceProduct.getProducts(req, res);
    const product = products.find((p: any) => p.id === parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json({ product });
  } catch (error) {
    switch (error) {
      case 500:
        return res.status(500).json({ message: "Server error" });
      case 404:
        return res.status(404).json({ message: "No products found" });
      default:
        return res.status(500).json({ message: "Unknown error" });
    }
  }
});

router.post('/products', jwtService.verifyToken, async (req: any, res: any) => {
  try {
    const result = await serviceProduct.addProduct(req, res);
    switch (result) {
      case 201:
        return res.status(201).redirect('/api/products');
      default:
        return res.status(500).json({ message: "Unknown response" });
    }
  } catch (error) {
    switch (error) {
      case 500:
        return res.status(500).json({ message: "Error processing request" });
      case 409:
        return res.status(409).json({ message: "Product already exists" });
      default:
        return res.status(500).json({ message: "Unknown error" });
    }
  }
});

router.delete('/products/delete', jwtService.verifyToken, async (req: any, res: any) => {
  try {
    const result = await serviceProduct.deleteProduct(req, res);
    switch (result) {
      case 200:
        return res.status(200).redirect('/api/products');
      default:
        return res.status(500).json({ message: "Unknown response" });
    }
  } catch (error) {
    switch (error) {
      case 500:
        return res.status(500).json({ message: "Error processing request" });
      case 404:
        return res.status(404).json({ message: "Product not found" });
      default:
        return res.status(500).json({ message: "Unknown error" });
    }
  }
});

router.delete('/products/:id', jwtService.verifyToken, async (req: any, res: any) => {
  try {
    req.body = { id: parseInt(req.params.id) };
    const result = await serviceProduct.deleteProduct(req, res);
    switch (result) {
      case 200:
        return res.status(200).json({ message: "Product deleted successfully" });
      default:
        return res.status(500).json({ message: "Unknown response" });
    }
  } catch (error) {
    switch (error) {
      case 500:
        return res.status(500).json({ message: "Error processing request" });
      case 404:
        return res.status(404).json({ message: "Product not found" });
      default:
        return res.status(500).json({ message: "Unknown error" });
    }
  }
});

router.put('/products/update', jwtService.verifyToken, async (req: any, res: any) => {
  try {
    const result = await serviceProduct.updateProduct(req, res);
    switch (result) {
      case 200:
        return res.status(200).redirect('/api/products');
      default:
        return res.status(500).json({ message: "Unknown response" });
    }
  } catch (error) {
    switch (error) {
      case 500:
        return res.status(500).json({ message: "Error processing request" });
      case 404:
        return res.status(404).json({ message: "Product not found" });
      default:
        return res.status(500).json({ message: "Unknown error" });
    }
  }
});

router.put('/products/:id', jwtService.verifyToken, async (req: any, res: any) => {
  try {
    req.body.id = parseInt(req.params.id);
    const result = await serviceProduct.updateProduct(req, res);
    switch (result) {
      case 200:
        return res.status(200).json({ message: "Product updated successfully" });
      default:
        return res.status(500).json({ message: "Unknown response" });
    }
  } catch (error) {
    switch (error) {
      case 500:
        return res.status(500).json({ message: "Error processing request" });
      case 404:
        return res.status(404).json({ message: "Product not found" });
      default:
        return res.status(500).json({ message: "Unknown error" });
    }
  }
});

router.patch('/products/:id', jwtService.verifyToken, async (req: any, res: any) => {
  try {
    req.body.id = parseInt(req.params.id);
    const result = await serviceProduct.updateProduct(req, res);
    switch (result) {
      case 200:
        return res.status(200).json({ message: "Product updated successfully" });
      default:
        return res.status(500).json({ message: "Unknown response" });
    }
  } catch (error) {
    switch (error) {
      case 500:
        return res.status(500).json({ message: "Error processing request" });
      case 404:
        return res.status(404).json({ message: "Product not found" });
      default:
        return res.status(500).json({ message: "Unknown error" });
    }
  }
});

router.get('/search', jwtService.verifyToken, async (req: any, res: any) => {
  try {
    const products = await serviceProduct.getProducts(req, res);
    const searchTerm = req.query.name?.toLowerCase();
    
    if (!searchTerm) {
      return res.status(400).json({ message: "Search term required" });
    }
    
    const filteredProducts = products.filter((p: any) => 
      p.name.toLowerCase().includes(searchTerm)
    );
    
    res.json({ products: filteredProducts });
  } catch (error) {
    switch (error) {
      case 500:
        return res.status(500).json({ message: "Server error" });
      case 404:
        return res.status(404).json({ message: "No products found" });
      default:
        return res.status(500).json({ message: "Unknown error" });
    }
  }
});

router.get('/', (req: any, res: any) => {
  res.json({ 
    message: 'Products API',
    endpoints: [
      'GET    /api/products',
      'GET    /api/products/:id',
      'POST   /api/products',
      'PUT    /api/products/update',
      'PUT    /api/products/:id',
      'PATCH  /api/products/:id',
      'DELETE /api/products/delete',
      'DELETE /api/products/:id',
      'GET    /api/search?name='
    ]
  });
});

module.exports = router;