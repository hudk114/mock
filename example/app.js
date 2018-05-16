const express = require('express');
const path = require('path');
const fs = require('fs');
const opn = require('opn');

const app = express();

fs.copyFileSync(
  path.resolve(__dirname, '../dist/proxyMock.js'),
  path.resolve(__dirname, './public/js/proxyMock.js')
);

app.use(express.static(path.resolve(__dirname, './public')));

app.get('/', (req, res) => {
  res.redirect('/index.html');
});

app.get('/user', (req, res) => {
  res.send('get /user');
});

app.post('/mock/user', (req, res) => {
  res.send('post /mock/user');
});

app.get('/m/user', (req, res) => {
  res.send('get /m/user');
});

app.listen(8888, _ => {
  console.log('listen to localhost:8888');
  opn('http://localhost:8888');
});
