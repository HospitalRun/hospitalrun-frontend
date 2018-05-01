#!/usr/bin/env node

'use strict';

const http = require('http');
const process = require('process');
const child = require('child_process');

let couchurl = process.env.COUCHDB_URL ? process.env.COUCHDB_URL : 'http://localhost:5984';

if (typeof couchurl === undefined || couchurl === null) {
  couchurl = 'http://localhost:5984';
}

const testCouchServer = function(url) {
  return new Promise((resolve, reject) => {
    let request = http.get(url, (response) => {
      let dataChunk = '';
      if (response.statusCode !== 200) {
        reject(new Error('Access to chouchDB failed.'));
      }

      response.on('data', (data) => { dataChunk += data; });
      response.on('end', () => {
        resolve(JSON.parse(dataChunk));
      });
    });
    request.on('error', (err) => reject(err));
  });
};

testCouchServer(couchurl)
  .then(
    () => {
      console.log('Starting ember server');
      child.spawn('ember', ['serve'], {
        shell: true,
        stdio: ['inherit', 'inherit', 'inherit']
      });
    }
  )
  .catch((err) => {
    console.error('Oops! Looks like CouchDB isn\'t running. CouchDB must be running before you can start HospitalRun.');
    console.error('For help or more info see https://github.com/HospitalRun/hospitalrun-frontend#install');
  });
