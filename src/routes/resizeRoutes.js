const express = require('express');
const resizeImage = require('../controllers/resizeController');
const upload = require('../utils/upload');
const resizeRouter = express.Router();

resizeRouter.post('/resize', upload.single('image'), resizeImage);

module.exports = resizeRouter;