const request = require('request');
const btoa = require('btoa');

function main(params) {
  return new Promise(function (resolve, reject) {
    request({
      method: 'GET',
      encoding: null,
      uri: "https://" + params.CLOUD_HOST + "/buckets/" + params.bucketName + "/" + params.objectName,
    }, function (err, response, body) {
      if (err) {
        reject({rejected: err})
      } else {
        resolve({
            headers: { 'Content-Type': 'application/octet-stream' },
            statusCode: 200,
            body: btoa(body)
        })
      }
    })
  });
}