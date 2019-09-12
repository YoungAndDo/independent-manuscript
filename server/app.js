const express = require('express');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const handler = multer();

const PORT = process.env.PORT || 3000;
const imgPath = path.join(__dirname, '../public/img/saveImage.png');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.post('/upload', handler.single('file'), (req, res, next) => {
  const picStream = fs.createWriteStream(imgPath);
  picStream.on('close', () => {
    res.send({message: 'finished'});
  });
  picStream.write(req.file.buffer);
  picStream.end();
});

app.get('/download', (req, res, next) => {
  const filename = `${new Date().toLocaleString()}.png`;
  res.download(imgPath, filename);
});

// error handling
app.use((err, req, res, next) => {
  console.dir(`Error ocurred! (in user) status: ${err.status} | message: ${err.message}`);
  res.send({status: err.status, message: err.message});
});

app.listen(PORT, () => console.dir(`listening on port: ${PORT}`));
