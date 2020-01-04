const express = require('express');
const app = express();
const txt2json = require('./middleware/txt2json');

app.get('/hello', function(req, res) {
  res.send({
    Output: 'Hello World!'
  });
});

app.post('/hello', function(req, res) {
  res.send({
    Output: 'Hello World!'
  });
});

app.post('/', txt2json);

// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app;
