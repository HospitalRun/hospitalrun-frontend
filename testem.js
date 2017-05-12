/*jshint node:true*/
module.exports = {
  "launchers": {
    "Chrome Beta": {
      "command": "google-chrome-beta"
    }
  },
  "framework": "qunit",
  "test_page": "tests/index.html?hidepassed",
  "disable_watching": true,
  "launch_in_ci": [
    "Chrome Beta"
  ],
  "launch_in_dev": [
    "Chrome"
  ],
  browser_args: {
    'Chrome': [ '--headless', '--disable-gpu', '--remote-debugging-port=9222' ],
  },
};
