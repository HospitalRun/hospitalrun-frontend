'use strict';

const { app } = require('electron');
const path =    require('path');
const fs =      require('fs');
const request = require('httpreq');

module.exports.downloadUpdate = downloadUpdate;

function downloadUpdate(downloadUrl) {
  const appImagePath = process.env.APPIMAGE;
  let downloadedImage;
  let desktopText;

  return checkAppImageFile(appImagePath)
    .then(() => {
      return getTemporaryFilePath(appImagePath);
    })
    .then((tempFile) => {
      downloadedImage = tempFile;
      return downloadFile(downloadUrl, tempFile);
    })
    .then(() => {
      return setExecFlag(downloadedImage);
    })
    .then(() => {
      return extractDesktopFileFromAppImage(downloadedImage);
    })
    .then((desktopFileContent) => {
      desktopText = desktopFileContent;
      return replaceFile(downloadedImage, appImagePath);
    })
    .then(() => {
      return patchDesktopFile(desktopText);
    })
    .then(() => {
      return appImagePath;
    });
}

function checkAppImageFile(appImagePath) {
  return new Promise((resolve, reject) => {
    if (!appImagePath) {
      return reject('It seems that the app is not in AppImage fromat');
    }
    fs.access(appImagePath, fs.W_OK, (err) => {
      if (err) {
        reject(`Cannot write update to ${appImagePath}`);
      } else {
        resolve(appImagePath);
      }
    });
  });
}

function getTemporaryFilePath(appImagePath) {
  const saveDir = path.dirname(appImagePath);
  return new Promise((resolve, reject) => {
    fs.access(saveDir, fs.W_OK, (err) => {
      if (err) {
        reject(`Cannot write to the directory ${saveDir}`);
      } else {
        resolve(appImagePath + '.update');
      }
    });
  });
}

function downloadFile(url, tempPath) {
  return new Promise((resolve, reject) => {
    request.download(url, tempPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(tempPath);
      }
    });
  });
}

function setExecFlag(filePath) {
  return new Promise((resolve, reject) => {
    fs.access(filePath, fs.X_OK, (err) => {
      if (!err) {
        resolve(filePath);
      }

      fs.chmod(filePath, '0755', (err) => {
        if (err) {
          reject(`Could not make a file ${filePath} executable`);
        }
        resolve(filePath);
      });
    });
  });
}

function replaceFile(src, dest) {
  return new Promise((resolve, reject) => {
    fs.rename(src, dest, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(dest);
      }
    });
  });
}

function extractDesktopFileFromAppImage(appImagePath) {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(appImagePath);
    let desktopFileContent = '';
    fileStream
      .on('data', (chunk) => {
        let startIdx = -1;
        if (desktopFileContent) {
          startIdx = 0;
        } else {
          startIdx = chunk.indexOf('[Desktop Entry]');
        }
        if (startIdx === -1) {
          return;
        }

        const endIdx = chunk.indexOf('\0', startIdx);
        if (endIdx === -1) {
          desktopFileContent += chunk.slice(startIdx).toString('utf8');
        } else {
          desktopFileContent += chunk.slice(startIdx, endIdx).toString('utf8');
          fileStream.destroy();
        }
      })
      .on('close', function () {
        if (desktopFileContent) {
          resolve(desktopFileContent);
        } else {
          reject('Could not read desktop shortcut in AppImage');
        }
      })
      .on('error', reject);
  });
}

function patchDesktopFile(desktopFileContent) {
  const desktopFilePath = path.join(
    process.env.HOME,
    '.local',
    'share',
    'applications',
    'appimagekit-' + path.basename(app.getPath('exe')) + '.desktop'
  );

  const VERSION_MATCH = /X-AppImage-Version=(\d+\.\d+\.\d+)/;
  const BUNDLE_ID_MATCH = /X-AppImage-BuildId=([\w-]+)/;


  const version = desktopFileContent.match(VERSION_MATCH)[1];
  const bundleId = desktopFileContent.match(BUNDLE_ID_MATCH)[1];

  if (!version || !bundleId) {
    return Promise.reject('Error parsing a desktop file from new AppImage');
  }

  return new Promise((resolve, reject) => {
    fs.readFile(desktopFilePath, 'utf8', (err, originalContent) => {
      if (err) {
        reject(err);
      }

      originalContent = originalContent
        .replace(VERSION_MATCH, 'X-AppImage-Version=' + version)
        .replace(BUNDLE_ID_MATCH, 'X-AppImage-BuildId=' + bundleId);

      fs.writeFile(desktopFilePath, originalContent, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  });
}