const express = require('express');
const app = express();
const productController = require('./controller/productController.ts')

app.use(express.json());
app.use('/', productController);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

