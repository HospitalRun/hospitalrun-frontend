// Nuke idb: /Users/{user}/Library/Application Support/Firefox/Profiles/i9soh8wz.default/indexedDB/

window.requestFileSystem = window.requestFileSystem ||
                           window.webkitRequestFileSystem;
window.URL = window.URL || window.webkitURL;

var openFSButton = document.querySelector('#openFSButton');
var preview = document.querySelector('#preview');
var logger = new Logger('#log');
var fs = null;
var cwd = null;
var html = [];

function onError(e) {
  console.log(e);
  logger.log('Error ' + e.code + ' - ' + e.name);
}

function clearFS() {
  fs.root.createReader().readEntries(function(results) {
    [].forEach.call(results, function(entry) {
      if (entry.isDirectory) {
        entry.removeRecursively(function() {}, onError);
      } else {
        entry.remove(function() {}, onError);
      }
    });
    getAllEntries(fs.root);
  }, onError);

  // idb.drop(function(e) {
  //   logger.log('<p>Database deleted!</p>');
  // }, onError);
}

function openFS() {
  window.requestFileSystem(TEMPORARY, 1024*1024, function(myFs) {
    fs = myFs;
    cwd = fs.root;
    openFSButton.disabled = true;
    logger.log('<p>Opened <em>' + fs.name, + '</em></p>');
    getAllEntries(fs.root);
  }, function(e) {
    logger.log(e);
  });
}

function writeFile(file, i) {
  cwd.getFile(file.name, {create: true, exclusive: false}, function(fileEntry) {
    fileEntry.createWriter(function(fileWriter) {
      fileWriter.onwritestart = function() {
        console.log('WRITE START');
      };
      fileWriter.onwriteend = function() {
        console.log('WRITE END');
      };
      fileWriter.write(file);
    }, onError);

    getAllEntries(cwd);
  }, onError);
}

function getAllEntries(dirEntry) {
  dirEntry.createReader().readEntries(function(results) {
    html = [];
    // var paths = results.map(function(el) { return el.fullPath.substring(1); });
    // renderFromPathObj(buildFromPathList(paths));
    // document.querySelector('#entries2').innerHTML = html.join('');

    var frag = document.createDocumentFragment();
    // Native readEntries() returns an EntryArray, which doesn't have forEach.
    [].forEach.call(results, function(entry) {
      var li = document.createElement('li');
      li.dataset.type = entry.isFile ? 'file' : 'folder';
      
      var deleteLink = document.createElement('a');
      deleteLink.href = '';
      deleteLink.innerHTML = '<img src="images/icons/delete.svg" alt="Delete this" title="Delete this">';
      deleteLink.classList.add('delete');
      deleteLink.onclick = function(e) {
        e.preventDefault();

        if (entry.isDirectory) {
          entry.removeRecursively(function() {
          logger.log('<p>Removed ' + entry.name + '</p>');
          getAllEntries(window.cwd);
        });
        } else {
          entry.remove(function() {
          logger.log('<p>Removed ' + entry.name + '</p>');
          getAllEntries(window.cwd);
        });
        }
        return false;
      };

      var span = document.createElement('span');
      span.appendChild(deleteLink);

      if (entry.isFile) {

        entry.file(function(f) {

          var size = Math.round(f.size * 100 / (1024 * 1024)) / 100;
          span.title = size + 'MB';

          if (size < 1) {
            size = Math.round(f.size * 100 / 1024) / 100;
            span.title = size + 'KB';
          }

          span.title += ', last modified: ' +
                        f.lastModifiedDate.toLocaleDateString();

          if (f.type.match('audio/') || f.type.match('video/ogg')) {

            var audio = new Audio();

            if (audio.canPlayType(f.type)) {
              audio.src = window.URL.createObjectURL(f);
              //audio.type = f.type;
              //audio.controls = true;
              audio.onended = function(e) {
                window.URL.revokeObjectURL(this.src);
              };

              var a = document.createElement('a');
              a.href = '';
              a.dataset.fullPath = entry.fullPath;
              a.textContent = entry.fullPath;
              a.appendChild(audio);
              a.onclick = playPauseAudio;

              span.appendChild(a);
            } else {
              span.appendChild(document.createTextNode(entry.fullPath + " (can't play)"));
            }
          } else {
            var a = document.createElement('a');
            a.href = '';
            a.textContent = entry.fullPath;

            a.onclick = function(e) {
              e.preventDefault();

              var iframe = preview.querySelector('iframe');
              if (!iframe) {
                iframe = document.createElement('iframe');
              } else {
                window.URL.revokeObjectURL(iframe.src);
              }

              preview.innerHTML = '';

              if (this.classList.contains('active')) {
                this.classList.remove('active');
                return;
              } else {
                this.classList.add('active');
              }

              iframe.src = window.URL.createObjectURL(f);
              preview.innerHTML = '';
              preview.appendChild(iframe);

              return false;
            };

            span.appendChild(a)
          }

          /*var img = document.createElement('img');
          img.src = 'images/icons/file.png';
          img.title = 'This item is a file';
          img.alt = img.title;
          span.appendChild(img);*/

          li.appendChild(span);
        }, onError);
      } else {
        var span2 = document.createElement('span');

        var folderLink = document.createElement('a');
        folderLink.textContent = entry.fullPath;
        folderLink.href = '';
        folderLink.onclick = function(e) {
          e.preventDefault();
          cwd.getDirectory(this.textContent, {}, function(dirEntry) {
            window.cwd = dirEntry; // TODO: not sure why we need to use window.cwd here.
            getAllEntries(dirEntry);
          }, onError);
          return false;
        };

        span2.appendChild(folderLink);
        span.appendChild(span2);
        span.classList.add('bold');
        var img = document.createElement('img');
        img.src = 'images/icons/folder.png';
        img.alt = 'This item is a folder';
        img.title = img.alt;
        span.title = img.alt;
        span.appendChild(img);

        li.appendChild(span);
      }
      frag.appendChild(li);
    });

    var entries = document.querySelector('#entries');
    entries.innerHTML = '<ul></ul>';
    entries.appendChild(frag);

  }, onError);
}

function create(el) {
  cwd.getFile(el.value, {create: true, exclusive: true}, function(fileEntry) {
    logger.log('<p>Created empty file <em>' + fileEntry.fullPath, + '</em></p>');
    getAllEntries(cwd);
    el.value = '';
  }, onError);
}

function mkdir(el) {
  cwd.getDirectory(el.value, {create: true, exclusive: true}, function(dirEntry) {
    logger.log('<p>Created folder <em>' + dirEntry.fullPath, + '</em></p>');
    getAllEntries(cwd);
    el.value = '';
  }, onError);
}

function buildFromPathList(paths) {
  var tree = {};
  for (var i = 0, path; path = paths[i]; ++i) {
    var pathParts = path.split('/');
    var subObj = tree;
    for (var j = 0, folderName; folderName = pathParts[j]; ++j) {
      if (!subObj[folderName]) {
        subObj[folderName] = j < pathParts.length - 1 ? {} : null;
      }
      subObj = subObj[folderName];
    }
  }
  return tree;
}

function renderFromPathObj(object) {
  for (var folder in object) {
    if (!object[folder]) { // file's will have a null value
      html.push('<li>', folder, '</li>');
    } else {
      html.push('<li>', folder);
      html.push('<ul>');
      renderFromPathObj(object[folder]);
      html.push('</ul>');
    }
  }
}

function playPauseAudio(e) {
  var a = e.target;
  var audio = a.querySelector('audio');
  if (audio.paused) {
    audio.play();
    a.classList.add('active');
  } else {
    audio.pause();
    a.classList.remove('active');
  }
  e.preventDefault();
}

window.addEventListener('DOMContentLoaded', function(e) {

}, false);

window.addEventListener('load', function(e) {
  var dnd = new DnDFileController('body', function(files) {
    [].forEach.call(files, writeFile);
  });
  openFS();
}, false);
