const express = require('express');
const cors =require('cors')
const app = express();
const productController = require('./controller/productController.ts')

app.use(cors())
app.use(express.json());
app.use('/', productController);

const PORT = process.env.PORT || 2500;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

