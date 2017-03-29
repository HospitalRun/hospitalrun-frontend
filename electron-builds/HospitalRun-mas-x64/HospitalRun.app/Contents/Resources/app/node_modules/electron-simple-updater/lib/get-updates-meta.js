'use strict';

const semver  = require('semver');
const request = require('httpreq');

/**
 *
 * @type {Promise<Object|Boolean>}
 */
module.exports = getUpdatesMeta;


/**
 * Return promise which can return false if there are no updates available
 * or object which contains the update information
 * @param {string} updatesUrl
 * @param {string} build Something like win32, nsis, lin64
 * @param {string} channel prod, beta, dev and so on
 * @param {string} version 0.0.1
 * @returns {Promise<Object|Boolean>}
 */
function getUpdatesMeta(updatesUrl, build, channel, version) {
  return getJson(updatesUrl)
    .then((meta) => {
      return extractUpdateMeta(meta, build, channel, version);
    });
}

function extractUpdateMeta(updatesMeta, build, channel, version) {
  const meta = updatesMeta[`${build}-${channel}`];
  if (!meta || !meta.version) {
    return false;
  }

  if (semver.gt(meta.version, version)) {
    return meta;
  }

  return false;
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    request.get(url, (err, respose) => {
      if (err) {
        reject(err);
      } else {
        try {
          resolve(JSON.parse(respose.body));
        } catch (e) {
          e.message =
            `Error while parsing '${url}'. ${e.message}. Data:\n ${respose.body}`;
          reject(e);
        }
      }
    });
  });
}