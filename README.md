# deploy-aws-s3

[![Greenkeeper badge](https://badges.greenkeeper.io/AvraamMavridis/deploy-aws-s3.svg)](https://greenkeeper.io/)

Simple script to deploy static website to s3

How to use:

```js
const deploy = require('deploy-aws-s3');

deploy({
  accessKeyId: 'your access key',
  secretAccessKey: 'your secret key',
  s3BucketName: 'your bucket name',
  folderPath: 'your path to the folder of the static content e.g. ../build/'
})
```
