export default Ember.Controller.extend({
    filer: null, //Injected via initializer
    _onError: function(e) {
        console.log('Filer filesystem error: '+e);
    },

    /**
     * Add the specified file to the local filesystem
     * @param {File} file the file to save.
     * @param {String} path the file path to save the file to.
     * @returns {Promise} returns a Promise that resolves once the file is saved.
     */
    addFile: function(file, path) {
        return new Ember.RSVP.Promise(function(resolve, reject){
            var currentDate = new Date(),
                filer = this.get('filer'),
                fileName = file.name || '',
                newFileName = path+currentDate.getTime()+fileName;
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