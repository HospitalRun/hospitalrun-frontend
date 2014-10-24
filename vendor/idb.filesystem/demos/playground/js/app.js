var filer = new Filer();
var logger = new Logger('#log div');

var entries = []; // Cache of current working directory's entries.
var currentLi = 1; // Keeps track of current highlighted el for keyboard nav.

// If the OS doesn't reconize certain types, let's help it. These (extra) types
// will be read as plaintext.
var PREVIEWABLE_FILES = [
  '.as',
  '.txt',
  '.pl',
  '.h',
  '.cc', '.cpp',
  '.csv', '.tsv',
  '.js',
  '.sh'
];

var TICKER_LIST = [
  'Drag in files from the desktop to import them.',
  'Use the "Import directory" button to import entire directories.',
  'Use the keyboard to navigate and browser folders or preview files.',
  'Some files can be previewed by clicking their <img src="images/icons/library.png" class="icon"> icon.',
  'ESC gets you out of preview mode.',
];

// Cache some frequently used DOM elements.
var filePreview = document.querySelector('#file-info');
var filesContainer = document.querySelector('#files');
var fileList = filesContainer.querySelector('ul');
var openFsButton = document.querySelector('#openFsButton');
var errors = document.querySelector('#errors');
//var importButton = document.querySelector('[type="file"]');
var importButton = document.querySelector('#importButton');
var fileDirInput = document.querySelector('input[type="file"]');
var createButton = document.querySelector('#createButton');
var ticker = document.querySelector('#ticker');

function toURL(entry) {
  // Can't polyfill opening filesystem: URLs, so create a blob: URL instead.
  // TODO(ericbidelman): cleanup URLs created using revokeObjectUR().
  if (entry.isFile && entry.file_.blob_) {
    var blob = entry.file_.blob_;
  } else {
    var blob = new Blob([]);
  }

  return window.URL.createObjectURL(blob);
}

function createNewEntry() {
  var type = document.querySelector('#entry-type').value;
  var name = document.querySelector('#entry-name').value;
  switch (type) {
    case 'dir':
      mkdir(name);
      break;
    case 'file':
      newFile(name);
      break;
  }
}

function onError(e) {
  logger.log('<p class="error">' + e.name + '</p>');
  errors.textContent = e.name;
}

function refreshFolder(e) {
  errors.textContent = ''; // Reset errors.

  // Open the FS, otherwise list the files.
  if (filer && !filer.isOpen) {
    openFS();
  } else {
    filer.ls('.', function(entries) {
      renderEntries(entries);
    }, onError);
  }
}
function display(el, type) {
  Util.toArray(document.querySelectorAll('[data-display-type]')).forEach(function(el, i) {
    el.classList.remove('active');
  });

  if (type == 'list') {
    filesContainer.classList.remove('large');
    document.querySelector('[data-display-type="list"]').classList.add('active');
  } else {
    filesContainer.classList.add('large');
    document.querySelector('[data-display-type="icons"]').classList.add('active');
  }
}

function toggleContentEditable(el) {
  if (el.isContentEditable) {
    el.removeAttribute('contenteditable');
  } else {
    el.setAttribute('contenteditable', '');
    el.focus();
  }
}

function toggleLog(opt_hide) {
  if (opt_hide) {
    document.querySelector('#log').classList.remove('active');
    document.querySelector('#toggle-log').checked = false;
  } else {
    document.querySelector('#log').classList.toggle('active');
  }
}


function click(el) {
  // Simulate link click on an element.
  var evt = document.createEvent('Event');
  evt.initEvent('click', false, false);
  el.dispatchEvent(evt);
}


function constructEntryHTML(entry, i) {
  var img = entry.isDirectory ?
      '<img src="images/icons/folder.png" class="folder" onclick="cd(' + i + ')" title="Open folder" alt="Open folder">' :
      '<img src="images/icons/file.png" class="file" onclick="openFile(' + i + ')" title="Open file" alt="Open file">';

  var html = [img, '<div data-filename ondblclick="toggleContentEditable(this)" onblur="rename(this, ', i, ')" title="Double-click to rename this entry">',
              entry.name, '</div>'];

  if (entry.isFile) {
    html.push('<a href="javascript:" data-preview-link onclick="readFile(', i, ')"><img src="images/icons/library.png" class="icon" title="Preview file" alt="Preview file"></a>');
    html.push('<a href="', toURL(entry), '" download><img src="images/icons/download.png" class="icon" title="Download" alt="Download"></a>');
  }

  html.push('<a href="javascript:" data-remove-link onclick="remove(this,', i, ');"><img src="images/icons/trash_empty.png" class="icon" title="Remove" alt="Remove"></a>');

  return html.join('');
}

function addEntryToList(entry, opt_idx) {

  // If an index isn't passed, we're creating a dir or adding a file. Append it.
  if (opt_idx == undefined) {
    entries.push(entry);
  }

  var idx = (opt_idx === undefined) ? entries.length - 1 : opt_idx;

  var li = document.createElement('li');
  li.innerHTML = constructEntryHTML(entry, idx);
  fileList.appendChild(li);
}

function renderEntries(resultEntries) {
  entries = resultEntries; // Cache the result set.

  fileList.innerHTML = ''; // Clear out existing entries and reset HTML.

  var li = document.createElement('li');
  li.innerHTML = '<a href="javascript:" onclick="cd(-1)" class="parentDir">' + 
      '<img src="images/icons/folder.png" class="folder" onclick="cd(-1)">' + 
      ' [ parent directory ]</a>';
  fileList.appendChild(li);

  if (!resultEntries.length) {
    var li = document.createElement('li');
    li.innerHTML = 'No files. Import some!'
    fileList.appendChild(li);
    return;
  }

  resultEntries.forEach(function(entry, i) {
    entry.getMetadata(function(meta) {
      console.log(meta.modificationTime, meta.size);
    }, function(e) {
      console.log(e.name);
    });
    addEntryToList(entry, i);
  });
}

function openFS() {
  try {
    filer.init({persistent: false, size: 1024 * 1024}, function(fs) {
      logger.log(fs.root.toURL());
      logger.log('<p>Opened: ' + fs.name, + '</p>');

      setCwd('/'); // Display current path as root.
      refreshFolder();
      openFsButton.innerHTML = '<div></div>';
      openFsButton.classList.add('fakebutton');
      importButton.disabled = true; // mozdirectory doesn't work in FF.
      createButton.disabled = false;
    }, function(e) {
      if (e.name == 'SECURITY_ERR') {
        errors.textContent = 'SECURITY_ERR: Are you running in incognito mode?';
        openFsButton.innerHTML = '<div></div>';
        openFsButton.classList.add('fakebutton');
        return;
      }
      onError(e);
    });
  } catch(e) {
    if (e.code == FileError.BROWSER_NOT_SUPPORTED) {
      fileList.innerHTML = 'BROWSER_NOT_SUPPORTED';
    }
  }
}

function setCwd(path) {
  var cwd = document.querySelector('#cwd').value;
  var rootPath = filer.pathToFilesystemURL('/');

  if (path == '/' || (path == '..' && (rootPath == cwd))) {
    document.querySelector('#cwd').value = filer.pathToFilesystemURL('/');
    return;
  } else if (path == '..') {
    var parts = cwd.split('/');
    parts.pop();
    path = parts.join('/');
    if (path == rootPath.substring(0, rootPath.length - 1)) {
      path += '/';
    }
  }

  document.querySelector('#cwd').value = filer.pathToFilesystemURL(path);
}

function mkdir(name, opt_callback) {
  if (!name) return;

  errors.textContent = ''; // Reset errors.

  try {
    if (opt_callback) {
      filer.mkdir(name, false, opt_callback, onError);
    } else {
      filer.mkdir(name, true, addEntryToList, onError);
    }
  } catch(e) {
    logger.log('<p class="error">' + e + '</p>');
  }
}

function cd(i, opt_callback) {
  errors.textContent = ''; // Reset errors.

  if (i == -1) {
    var path = '..';
  } else {
    var path = entries[i].fullPath;
  }

  setCwd(path);

  if (opt_callback) {
    filer.ls(path, opt_callback, onError);
  } else {
    filer.ls(path, renderEntries, onError);
  }
}

function openFile(i) {
  errors.textContent = ''; // Reset errors.
  var fileWin = self.open(toURL(entries[i]), 'fileWin');
}

function newFile(name) {
  if (!name) return;

  errors.textContent = ''; // Reset errors.

  try {
    filer.create(name, true, addEntryToList, onError);
  } catch(e) {
    onError(e);
  }
}

function writeFile(fileName, file, opt_rerender) {
  if (!file) return;

  var rerender = opt_rerender == undefined ? true : false;

  errors.textContent = ''; // Reset errors.

  filer.write(fileName, {data: file, type: file.type},
    function(fileEntry, fileWriter) {
      if (rerender) {
        addEntryToList(fileEntry);
        filer.ls('.', renderEntries, onError); // Just re-read this dir.
      }
    },
    onError
  );
}

function rename(el, i) {
  errors.textContent = ''; // Reset errors.

  filer.mv(entries[i].fullPath, '.', el.textContent, function(entry) {
    logger.log('<p>' + entries[i].name + ' renamed to ' + entry.name + '</p>');
    entries[i] = entry;

    // Fill download link with updated filsystem URL.
    var downloadLink = el.parentElement.querySelector('[download]');
    if (downloadLink) {
      downloadLink.href = toURL(entry);
    }
  });
  toggleContentEditable(el);
}

function remove(link, i) {
  errors.textContent = ''; // Reset errors.

  var entry = entries[i];

  if (!confirm('Delete ' + entry.name + '?')) {
    return;
  }

  filer.rm(entry, function() {
    var li = link.parentNode;
    li.classList.add('fadeout');
    li.addEventListener('webkitTransitionEnd', function(e) {
      this.parentNode.removeChild(this);
      filer.ls('.', renderEntries, onError); // Just re-read this dir.
    }, false);
    li.addEventListener('mozTransitionEnd', function(e) {
      this.parentNode.removeChild(this);
      filer.ls('.', renderEntries, onError); // Just re-read this dir.
    }, false);
  }, onError);
}

function copy(el, i) {
  errors.textContent = ''; // Reset errors.

  filer.cp(entries[i], el.textContent, function(entry) {
    logger.log('<p>' + entries[i].name + ' renamed to ' + entry.name + '</p>');
    entries[i] = entry;
  });
  toggleContentEditable(el);
}

function readFile(i) {
  errors.textContent = ''; // Reset errors.

  var entry = entries[i];

  try {
    filer.open(entry.name, function(file) {

      filePreview.classList.toggle('show');

      filePreview.innerHTML = [
        '<div><b>', file.name, '</b> ',
        (file.type ? '(' + file.type + ')' : ''), ' - ', file.size,
        ' bytes, modified: ', file.lastModifiedDate.toLocaleDateString(),
        '</div>'].join('');

      if (file.type.match(/audio.*/)) {
        var player = document.createElement('audio');
        player.controls = true;
        player.src = toURL(entry);

        filePreview.appendChild(player);

        player.load();
        player.play();

      } else if (file.type.match(/text.*/) ||
                 file.type.match(/application\/pdf/)) {

        var iframe = document.createElement('iframe');
        iframe.src = toURL(entry);

        filePreview.appendChild(iframe);

      } else if (file.type.match(/image.*/)) {

        var img = document.createElement('img');
        img.src = toURL(entry);

        filePreview.appendChild(img);

     } else if (PREVIEWABLE_FILES.indexOf(Util.getFileExtension(file.name)) != -1) {
        var reader = new FileReader();
        reader.onload = function(e) {
          var textarea = document.createElement('textarea');
          textarea.style.width = '50%';
          textarea.style.height = '350px';
          textarea.textContent = e.target.result;
          filePreview.appendChild(textarea);
        };
        reader.readAsText(file);
      } else {
        var p = document.createElement('p');
        p.textContent = 'No preview.'
        filePreview.appendChild(p);
      }

    }, onError);
  } catch(e) {
    logger.log('<p class="error">' + e + '</p>');
  }
}

function onKeydown(e) {
  var target = e.target;

  // Prevent enter key from inserting carriage return in the contenteditable
  // file/folder renaming.
  if (target.isContentEditable && 'filename' in target.dataset) {
    if (e.keyCode == 13) { // Enter
      e.preventDefault();
      e.stopPropagation();
      target.blur();
    }
    return;
  }

  var active = document.querySelector('#files li.on');

  if (e.keyCode == 27) { // ESC
    filePreview.classList.remove('show');
    filePreview.innerHTML = '';

    if (active) {
      active.classList.remove('on');
    }

    toggleLog(true);

    e.preventDefault();
    e.stopPropagation();
    return;
  }

  if (target.nodeName != 'INPUT') {
    if (e.keyCode == 8) { // Backspace.
      if (active) {
        click(active.querySelector('a[data-remove-link]'));
      }
      e.preventDefault();
      return;
    } else if (e.keyCode == 13) {  // Enter
      if (active) {
        if (active.querySelector('.folder')) {
          currentLi = 1; // reset current active to first item in current folder.
        }
        click(active.querySelector('a[data-preview-link]') || active.querySelector('img'));
        e.preventDefault();
        return;
      }
    }
  }

  if (active) {
    active.classList.remove('on');
  }

  var count = entries.length + 1;

  if (e.keyCode == 39 || e.keyCode == 40) { // Right/down arrow.
    currentLi = currentLi == count ? 1 : ++currentLi;
    document.querySelector('#files li:nth-of-type(' + currentLi + ')').classList.toggle('on');
    e.preventDefault();
  } else if (e.keyCode == 37 || e.keyCode == 38) { // Left/up arrow.
    currentLi = currentLi == 1 ? count : --currentLi;
    document.querySelector('#files li:nth-of-type(' + currentLi + ')').classList.toggle('on');
    e.preventDefault();
  }
}

function onImport(e) {
  var files = e.target.files;
  if (files.length) {
    var count = 0;
    Util.toArray(files).forEach(function(file, i) {

      var folders = file.webkitRelativePath.split('/');
      folders = folders.slice(0, folders.length - 1);

      // Add each directory. If it already exists, then a noop.
      mkdir(folders.join('/'), function(dirEntry) {
        var path = file.webkitRelativePath;

        ++count;

        // Write each file by it's path. Skipt '/.' (which is a directory).
        if (path.lastIndexOf('/.') !=  path.length - 2) {
          writeFile(path, file, false);
          if (count == files.length) {
            filer.ls('.', renderEntries, onError); // Rerender view on final file.
          }
        }
      });
    });
  }
}

function addListeners() {
  importButton.addEventListener('click', function(e) {
    fileDirInput.click();
  }, false);
  fileDirInput.addEventListener('change', onImport, false);
  document.addEventListener('keydown', onKeydown, false);

  var dnd = new DnDFileController('body', function(files) {
    Util.toArray(files).forEach(function(file, i) {
      writeFile(file.name, file);
    });
  });
}

// DOMContentLoaded seems to be an issue with FF.
window.addEventListener('load', function(e) {
  var count = 0;
  setInterval(function() {
    ticker.innerHTML =
        'Tip: ' + TICKER_LIST[count++ % TICKER_LIST.length];
    ticker.classList.add('fadedIn');
  }, 7000);
}, false);

window.addEventListener('load', function(e) {
  addListeners();
  document.querySelector('.offscreen').classList.remove('offscreen');
}, false);
