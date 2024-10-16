require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const validUrl = require('valid-url'); // Tambahkan valid-url
const app = express();

const port = process.env.PORT || 3000;
let urls = []; // Array untuk menyimpan URL

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// API untuk hello
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Endpoint POST untuk menambahkan short URL
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  
  // Validasi URL
  if (!validUrl.isWebUri(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Buat short URL (gunakan panjang array sebagai ID sementara)
  const shortUrl = urls.length + 1;

  // Simpan original URL dan short URL ke dalam array
  urls.push({ original_url: originalUrl, short_url: shortUrl });

  // Kembalikan JSON response
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// Endpoint GET untuk redirect berdasarkan short URL
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);

  // Cari URL berdasarkan short URL
  const urlData = urls.find(u => u.short_url === shortUrl);

  // Jika tidak ditemukan, kirimkan error
  if (!urlData) {
    return res.json({ error: 'No short URL found for the given input' });
  }

  // Redirect ke original URL
  res.redirect(urlData.original_url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
