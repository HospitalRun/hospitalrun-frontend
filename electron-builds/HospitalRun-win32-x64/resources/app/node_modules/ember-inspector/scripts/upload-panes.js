/**
 * Uploads the current Ember Inspector pane
 * to S3 to later be downloaded by future versions
 * before publishing.
 *
 * Make sure you add the correct AWS credentials
 * to `config/secrets.yml` before uploading.
 */
var AWS = require('aws-sdk');
var packageJson = require('../package.json');
var fs = require('fs');
var secrets = require('../config/secrets.json');

var version = packageJson.emberVersionsSupported[0];

if (!packageJson.emberVersionsSupported[1]) {
  console.log("\x1b[31m%s\x1b[0m", "[FAILED] You need to set the right limit for the Ember versions supported (in package.json). Exiting...");
  process.exit();
}

var config = {
  accessKeyId: secrets.accessKeyId,
  secretAccessKey: secrets.secretAccessKey,
  region: 'eu-west-1',
};
AWS.config.update(config);

var env = process.env.EMBER_ENV || 'development';

var folderName = 'panes-' + version.replace(/\./g, '-');
var s3 = new AWS.S3({ params: { Bucket: 'ember-inspector-panes', ACL: 'public-read' } });

['chrome', 'firefox', 'bookmarklet'].forEach(function(dist) {
    var body = fs.createReadStream('dist/' + dist + '-pane.zip');
    s3.upload({ Body: body, Key: env + '/' + folderName  +'/' + dist + '.zip' }).
      send(function(err, data) { if (err) { throw err; } });
});
