import express from 'express';
import { join } from 'path';
import { Low, JSONFile } from 'lowdb';
import { nanoid } from 'nanoid';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const file = join(__dirname, '../data/db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

const PORT = 3000;
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

await db.read();

// set defaults
db.data = db.data || { posts: [] };
await db.write();

app.listen(PORT, function () {
  console.log('Listening on port 3000');
});

app.get('/', function (req, res) {
  const posts = db.data.posts;
  res.render(__dirname + '/index.ejs', { posts });
});

app.get('/posts', function (req, res) {
  const { posts } = db.data;
  res.json(posts);
});

app.post('/author', async function (req, res) {
  console.log('POST - /author');
  const newPost = {
    id: nanoid(),
    name: req.body.name,
  };
  db.data.posts.push(newPost);
  await db.write();
  res.redirect('/');
});
