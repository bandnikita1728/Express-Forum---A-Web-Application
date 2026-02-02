const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

let posts = [
    {id:uuidv4(), username:"nikita", content:"hardwork beats talent when talent doesn't work hard"},
    {id:uuidv4(), username:"sama", content:"i am learning web development"},
    {id:uuidv4(), username:"user3", content:"hello world"}
];

app.get('/posts', (req, res) => {
  res.render('index.ejs', { posts });
});

app.get('/posts/new', (req, res) => {
  res.render('new.ejs');
});

app.post('/posts', (req, res) => {
  let { username, content } = req.body;
  let id=uuidv4();
  posts.push({id, username, content });
  res.redirect('/posts');
});

app.get('/posts/:id', (req, res) => {
  let { id } = req.params;
  let post = posts.find(p => p.id === id);
  console.log('Looking for post with ID:', id);
  console.log('Available posts:', posts.map(p => ({ id: p.id, username: p.username })));
  res.render('show.ejs', { post });
});

app.patch('/posts/:id', (req, res) => {
  let { id } = req.params;
  let post = posts.find(p => p.id === id);
  let { username, content } = req.body;
  if (post) {
    post.username = username;
    post.content = content;
  }
  res.redirect('/posts');
});

app.get('/posts/:id/edit', (req, res) => {
  let { id } = req.params;
  console.log('Edit request for ID:', id);
  let post = posts.find(p => p.id === id);
  console.log('Found post:', post);
  if (!post) {
    return res.status(404).send('Post not found');
  }
  res.render('edit.ejs', { post });
});

app.delete('/posts/:id', (req, res) => {
  let { id } = req.params;
  console.log('DELETE request for ID:', id);
  console.log('Posts before deletion:', posts.length);
  posts = posts.filter(p => p.id !== id);
  console.log('Posts after deletion:', posts.length);
  res.redirect('/posts');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});