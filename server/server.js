const express = require('express');
const path = require('path');

const app = express();

const port = process.env.PORT || 3000;

// Set Static Folder
// console.log(__dirname);
// console.log(path.join(__dirname, '../public'));
app.use(express.static(path.join(__dirname, '../public')));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
