const AWS = require('aws-sdk');
const fs = require('fs');
const colors = require('colors');
const path = require('path');

const deploy = function deploy(options) {
  // For dev purposes only
  AWS.config.update({
    accessKeyId: options.accessKeyId,
    secretAccessKey: options.secretAccessKey
  });

  // configuration
  const config = {
    s3BucketName: accessKeyId.s3BucketName,
    // path relative script's location
    folderPath: options.folderPath
  };

  // initialize S3 client
  const s3 = new AWS.S3({ signatureVersion: 'v4' });

  // resolve full folder path
  const distFolderPath = path.join(__dirname, config.folderPath);

  // recursively upload files
  const upload = function(distPath) {
    // get of list of files from 'dist' directory
    fs.readdir(distPath, (err, files) => {
      if (!files || files.length === 0) {
        console.log(
          `provided folder '${distPath}' is empty or does not exist.`.yellow
        );
        console.log('Make sure your project was compiled!'.yellow);
        return;
      }

      // for each file in the directory
      for (const fileName of files) {
        // get the full path of the file
        const filePath = path.join(distPath, fileName);

        // recursively upload subfolder
        if (fs.lstatSync(filePath).isDirectory()) {
          upload(filePath);
          continue;
        }

        // read file contents
        fs.readFile(filePath, (error, fileContent) => {
          // if unable to read file contents, throw exception
          if (error) {
            throw error;
          }

          // upload file to S3
          s3.putObject(
            {
              Bucket: config.s3BucketName,
              Key: fileName,
              Body: fileContent
            },
            (err, res) => {
              if (err && err.statusCode !== 200) {
                console.log(`Unable to upload '${fileName}'!`.red);
                console.log(`'${err.message}'!`.red);
              } else {
                console.log(`Successfully uploaded '${fileName}'!`.green);
              }
            }
          );
        });
      }
    });
  };

  upload(distFolderPath);
};

module.exports = deploy;
