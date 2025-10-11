const express = require('express');
const app = express();
const PORT = 3001;
const cors = require('cors');

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Middleware
app.use(cors()); 
app.use(express.json()); 
app.use((req, res, next) => {
console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
next();
});

const booksRouter = require('./routes/books');
app.use('/api/books', booksRouter);

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
