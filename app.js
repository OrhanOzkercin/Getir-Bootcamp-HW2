const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

const posts = [];

app.get('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        status: 'success',
        results: posts.length,
        data: posts,
        authData,
      });
    }
  });
});

app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const post = { id: posts.length, title: req.body.title, content: req.body.content };
      posts.push(post);
      res.status(201).json({
        status: 'success',
        data: post,
        authData,
      });
    }
  });
});

app.put('/api/posts/:id', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const post = { id: req.params.id, title: req.body.title, content: req.body.content };
      posts[req.params.id] = post;

      res.json({
        status: 'success',
        data: post,
        authData,
      });
    }
  });
});

app.delete('/api/posts/:id', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      posts.splice(req.params.id, 1);
      res.json({
        status: 'success',
        data: null,
        authData,
      });
    }
  });
});

app.post('/api/login', (req, res) => {
  //Mock user
  const user = {
    id: 1,
    username: 'Orhan',
    email: 'example@example.com',
  };

  jwt.sign({ user }, 'secretkey', (err, token) => {
    res.json({
      token,
    });
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
