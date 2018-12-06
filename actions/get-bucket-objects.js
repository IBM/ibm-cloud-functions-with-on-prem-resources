const request = require('request');

function main(params) {
  return new Promise(function (resolve, reject) {
    request({
      method: 'GET',
      uri: "https://" + params.CLOUD_HOST + "/buckets/" + params.bucketName,
    }, function (err, response, body) {
      if (err) {
        reject({rejected: err})
      } else {
        resolve({
            headers: { 'Content-Type': 'application/json' },
            statusCode: 200,
            body: body
        })
      }
    })
  });
}