const express = require('express');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const path = require('path');

const app = express();
const handler = multer();

const PORT = process.env.PORT || 3000;
const shortid = () => uuidv1().slice(0, 8);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.post('/upload', handler.single('file'), (req, res, next) => {
  const sid = (req.headers.cookie ? req.headers.cookie.split('=')[1] : shortid());
  const picStream = fs.createWriteStream(path.join(__dirname, `../public/img/${sid}.png`));
  picStream.on('close', () => {
    res.cookie('_sid', sid);
    res.send({message: 'finished'});
  });
  picStream.write(req.file.buffer);
  picStream.end();
});

app.get('/download', (req, res, next) => {
  if (req.headers.cookie) {
    const sid = req.headers.cookie.split('=')[1];
    res.download(path.join(__dirname, `../public/img/${sid}.png`), `${sid}.png`);
  }
});

// error handling
app.use((err, req, res, next) => {
  console.dir(`Error ocurred! (in user) status: ${err.status} | message: ${err.message}`);
  res.send({status: err.status, message: err.message});
});

app.listen(PORT, () => console.dir(`listening on port: ${PORT}`));
