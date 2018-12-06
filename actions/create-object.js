const request = require('request');

function main(params) {
  return new Promise(function (resolve, reject) {
    request({
      method: 'GET',
      uri: params.imageUrl,
      encoding: null
    }, function (err, response, body) {
      if (err) {
        reject({rejected: err})
      } else {
        request({
          method: 'POST',
          formData: {
            image: {
              value: body,
              options: {
                filename: 'test'
              }
            }
          },
          uri: 'https://' + params.CLOUD_HOST + "/buckets/" + params.bucketName + "/" + params.objectName,
        }, function (error, response, body) {
          if (error) {
            reject({rejected: error})
          } else {
            resolve({
              headers: { 'Content-Type': 'application/json' },
              statusCode: 200,
              body: body
            })
          }
        })
      }
    })
  });
}