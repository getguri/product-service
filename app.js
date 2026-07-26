// product-service/app.js (modified)
const express = require('express');
const app = express();
const PORT = 3002;
const axios = require('axios'); // npm install axios

app.use(express.json());

const products = [
  { id: 101, name: 'Laptop', price: 1200, userId: 1 },
  { id: 102, name: 'Mouse', price: 25, userId: 1 },
  { id: 103, name: 'Keyboard', price: 75, userId: 2 },
];

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/products/user/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const userProducts = products.filter(p => p.userId === userId);

  try {
    // Call the user-service using its Kubernetes Service DNS name
    const userResponse = await axios.get(`http://user-service:3001/users/${userId}`);
    const user = userResponse.data;
	
	console.log(user);

    res.json({
      user: user,
      products: userProducts
    });
  } catch (error) {
    console.error('Error fetching user from user-service:', error.message);
    res.status(500).send('Error fetching user data');
  }
});

app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
});
