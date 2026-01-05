const fs = require('fs');
const filePath = './data/db.json';


const ERROR_CODES = {
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500
};

const getProducts = async (req: any, res: any): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err: NodeJS.ErrnoException | null, data: string) => {
      if (err) {
        reject(ERROR_CODES.SERVER_ERROR);
        return;
      }
      if (!data) {
        reject(ERROR_CODES.NOT_FOUND);
        return;
      }
      try {
        const db = JSON.parse(data);
        resolve(db.products || []);
      } catch (error) {
        reject(ERROR_CODES.SERVER_ERROR);
      }
    });
  });
};

const addProduct = (req: any, res: any): Promise<number> => {
  const { name, price } = req.body;
  
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err: NodeJS.ErrnoException | null, data: string) => {
      if (err) {
        reject(ERROR_CODES.SERVER_ERROR);
        return;
      }
      
      let db;
      try {
        db = data ? JSON.parse(data) : { products: [] };
      } catch (error) {
        reject(ERROR_CODES.SERVER_ERROR);
        return;
      }
    
      if (db.products.some((prod: any) => prod.name === name)) {
        reject(ERROR_CODES.CONFLICT);
        return;
      }
   
      const newId = db.products.length > 0 
        ? parseInt(db.products[db.products.length - 1].id.toString()) + 1 
        : 1;
      
      const newProduct = {
        id: newId,
        name,
        price
      };
      
      db.products.push(newProduct);
      
      fs.writeFile(filePath, JSON.stringify(db, null, 2), (err: NodeJS.ErrnoException | null) => {
        if (err) {
          reject(ERROR_CODES.SERVER_ERROR);
          return;
        }
        resolve(201);
      });
    });
  });
};

const deleteProduct = (req: any, res: any): Promise<number> => {
  const id = parseInt(req.body.id);
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err: NodeJS.ErrnoException | null, data: string) => {
      if (err) {
        reject(ERROR_CODES.SERVER_ERROR);
        return;
      }
      
      if (!data) {
        reject(ERROR_CODES.NOT_FOUND);
        return;
      }
      
      let db;
      try {
        db = JSON.parse(data);
      } catch (error) {
        reject(ERROR_CODES.SERVER_ERROR);
        return;
      }
      
      const initialLength = db.products.length;
      db.products = db.products.filter((prod: any) => prod.id !== id);
      
      if (db.products.length === initialLength) {
        reject(ERROR_CODES.NOT_FOUND);
        return;
      }
      
      fs.writeFile(filePath, JSON.stringify(db, null, 2), (err: NodeJS.ErrnoException | null) => {
        if (err) {
          reject(ERROR_CODES.SERVER_ERROR);
          return;
        }
        resolve(200);
      });
    });
  });
};

const updateProduct = (req: any, res: any): Promise<number> => {
  const {id, name, price } = req.body;
  
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err: NodeJS.ErrnoException | null, data: string) => {
      if (err) {
        reject(ERROR_CODES.SERVER_ERROR);
        return;
      }
      
      if (!data) {
        reject(ERROR_CODES.NOT_FOUND);
        return;
      }
      
      let db;
      try {
        db = JSON.parse(data);
      } catch (error) {
        reject(ERROR_CODES.SERVER_ERROR);
        return;
      }
      
      const productIndex = db.products.findIndex((prod: any) => prod.id === parseInt(id.toString()));
      
      if (productIndex === -1) {
        reject(ERROR_CODES.NOT_FOUND);
        return;
      }

      db.products[productIndex] = {
        ...db.products[productIndex],
        name: name || db.products[productIndex].name,
        price: price || db.products[productIndex].price
      };
      
      fs.writeFile(filePath, JSON.stringify(db, null, 2), (err: NodeJS.ErrnoException | null) => {
        if (err) {
          reject(ERROR_CODES.SERVER_ERROR);
          return;
        }
        resolve(200);
      });
    });
  });
};

module.exports = {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct
};