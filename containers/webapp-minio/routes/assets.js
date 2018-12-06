const express = require("express");
const router = express.Router();
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
var Minio = require('minio')

var minioClient = new Minio.Client({
    endPoint: '127.0.0.1',
    port: 9000,
    useSSL: false,
    accessKey: '1234',
    secretKey: '12345678'
});

// List buckets
router.get("/", function(req, res) {
  minioClient.listBuckets(function (err, buckets) {
    if (err) {
      res.send(err)
    } else {
      res.send(buckets)
    }
  })
});

// get bucket's objects
router.get("/:bucketName", function(req, res) {
  let objects = []
  let stream = minioClient.listObjects(req.params.bucketName,'',true)
  stream.on('data', function (object) {
    objects.push(object)
  })
  stream.on('error', function (err) {
    res.send(err)
  })
  stream.on('end', function () {
    res.send(objects)
  })
});

// get object
router.get("/:bucketName/:objectName", function(req, res) {
  minioClient.getObject(req.params.bucketName, req.params.objectName, function(err, stream) {
    if (err) {
      res.send(err)
    } else {
      stream.on('data', function (data) {
        res.write(data)
      })
      stream.on('end', function () {
        res.end()
      })
      stream.on('error', function(error) {
        res.send(error)
      })
    }
  })
});

// create bucket
router.post("/:bucketName", function(req, res) {
  minioClient.makeBucket(
    req.params.bucketName,
    function(err) {
      if (err) {
        res.send(err)
      } else {
        res.send({'status': 'Successfully created bucket'})
      }
    }
  )
});

// upload object
router.post("/:bucketName/:objectName", upload.single('image'), function(req, res) {
  minioClient.putObject(
    req.params.bucketName,
    req.params.objectName,
    req.file.buffer,
    function(err, etag) {
      if (err) {
        res.send(err)
      } else {
        res.send({etag: etag})
      }
    }
  )
});

// delete object
router.delete("/:bucketName/:objectName", function(req, res) {
  minioClient.removeObject(
    req.params.bucketName,
    req.params.objectName,
    function(err) {
      if (err) {
        res.send(err)
      } else {
        res.send({'status':'Successfully removed object'})
      }
    }
  )
});

// delete bucket
router.delete("/:bucketName", function(req, res) {
  minioClient.removeBucket(req.params.bucketName, function (err) {
    if (err) {
      res.send(err)
    } else {
      res.send({'status':'Successfully removed bucket'})
    }
  })
});

module.exports = router;