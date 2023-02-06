'use strict';

const fs = require("fs");
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const {logger} = require('../../helpers/logger');

const imageService = require("./imageService");


const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', async function (req, res) {
  try {
    const response = await imageService.listImages(req.userId);
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.post('/', async function (req, res) {
  try {
    const {imgUrl} = req.body;

    const imageData = {
      userId: req.userId,
      imgUrl,
    };

    const response = await imageService.createImage(imageData);
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.delete('/', async function (req, res) {
  try {
    const { imgUrl } = req.body;

    const imageData = {
      userId: req.userId,
      imgUrl,
    };

    const response = await imageService.deleteImage(imageData);
    logger.info(response)

    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.post('/upload', upload.single('file'), async function(req, res) {
  try {
    const s3 = new AWS.S3({
      accessKeyId: 'AKIARSMX6LPO2KDCSC5P',
      secretAccessKey: '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',
    });
    const file = req.file;
    const fileContent = fs.readFileSync(file.path);
    const key = file.filename + '_' + file.originalname;
    s3.upload({
        Bucket: 'artyst-assets',
        Key: key,
        Body: fileContent
      }, function (err, data) {
        if (err) {
          throw err;
        }
        fs.unlink(file.path, err => {
          if (err) {
            throw err;
          }
          const url = s3.getSignedUrl('getObject', {
            Bucket: 'artyst-assets',
            Key: key,
            Expires: 24*3600
          });
       
          res.status(200).send({
              url,
              download,
            }).end();
        });
      });
  } catch (error) {
    logger.error(error)
    res.status(error.status || 500).send(error);
  }
})




module.exports = router;
