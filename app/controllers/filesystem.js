export default Ember.Controller.extend({
    needs: 'pouchdb',
    pouchdb: Ember.computed.alias('controllers.pouchdb'),
    filer: null, //Injected via initializer
    fileSystemSize: (1024*1024*1024*8), //8GB max size for local filesystem;chrome only,
    
    _onError: function(e) {
        console.log('Filer filesystem error: '+e);
    },
    
    setup: function() {
        var size = this.get('fileSystemSize'),
            filer = new Filer();
        filer.init({persistent: true, size: size}, function() {
            this.set('filer', filer);
        }.bind(this));     
    },

    /**
     * Add the specified file to the local filesystem
     * @param {File} file the file to save.
     * @param {String} path the file path to save the file to.
     * @param {String} recordId database id that the file is associated with.
     * @returns {Promise} returns a Promise that resolves once the file is saved.
     */
    addFile: function(file, path, recordId) {
        return new Ember.RSVP.Promise(function(resolve, reject){
            var currentDate = new Date(),
                filer = this.get('filer'),
                fileName = file.name || '',
                newFileName = path+currentDate.getTime()+fileName,
                pouchdb = this.get('pouchdb');
            if (Ember.isEmpty(filer)) {
                reject('Local filesystem unavailable, please use Google Chrome browser');
            }
            if (Ember.isEmpty(fileName) && !Ember.isEmpty(file.type)) {
                var typeParts = file.type.split('/');
                if (typeParts.length > 1) {
                    newFileName += '.'+ typeParts[1];
                }
            }
            filer.mkdir(path, false, function() {
                filer.write(newFileName, {data: file, type: file.type}, function(fileEntry) {                    
                    pouchdb.saveFileLink(newFileName, recordId);
                    resolve(fileEntry);
                }, function(e) {
                    reject(e);
                });
            }, function(e) {
                reject(e);
            });
        }.bind(this));    
    },
    
    /** 
     * Delete the specified file
     * @param {String} filePath path of file to delete.
     * @returns {Promise} returns a Promise that resolves once the file is deleted.
     */
    deleteFile: function(filePath) {
        return new Ember.RSVP.Promise(function(resolve, reject){
            var filer = this.get('filer');
            try {
                filer.rm(filePath, function() {
                    resolve();
                }, reject);
            } catch(ex) {
                reject(ex);
            }
        }.bind(this));
    },
    
    /**
     * Convert specified file to a data url
     * @param {File} file to convert
     * @returns {String} the data url for the file
     */
    fileToDataURL: function(file) {
        return new Ember.RSVP.Promise(function(resolve){
            var reader = new FileReader();
            reader.onloadend = function (e) {
                resolve(e.target.result);
            };
            reader.readAsDataURL(file);        
        });        
    },
    
    /**
     * Property to to determine if file system API is available.
     */
    isFileSystemEnabled: function() {
        var filer = this.get('filer');
        return !(Ember.isEmpty(filer));
    }.property('filer'),
    
    
    /**
     * Get filesystem url from specified path.
     * @param {String} the path of the file to get the url for.
     * @returns {String} the file system url or null if the file doesn't exist.
     */
    pathToFileSystemURL: function(path) {
        return new Ember.RSVP.Promise(function(resolve){
            var filer = this.get('filer');
            filer.fs.root.getFile(path, {}, function(fileEntry) {
                resolve(fileEntry.toURL());
            }, function() {
                //if ls errs, just return empty, file doesn't exist.
                resolve();
            });        
        }.bind(this));
    }
});