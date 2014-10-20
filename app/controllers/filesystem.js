export default Ember.Controller.extend({
    filerPromise: null,
    filer: null,
    size: (1024*1024*1024*8), //8GB max size,
    
    _onError: function(e) {
        console.log('Filer filesystem error: '+e);
    },
            
    /**
     * Get the filer object and initialize it if it is not already initialized
     * @param {Promise} returns a Promise that resolves once the filer object is initialized.
     */
    _getFiler: function() {
        if(Ember.isEmpty(this.filer)) {
            if (Ember.isEmpty(this.filerPromise)) {
                this.filerPromise = new Ember.RSVP.Promise(function(resolve, reject){
                    var size = this.get('size');
                    this.filer = new Filer();
                    this.filer.init({persistent: true, size: size}, function() {
                        console.log("FILER HAS BEEN INITIED");
                        resolve(this.filer);
                    }.bind(this), function(error) {
                        reject(error);
                    });
                }.bind(this));
            }
            return this.filerPromise;            
        } else {
            return Ember.RSVP.resolve(this.filer);
        }
        
    },
    
    /**
     * Add the specified file to the local filesystem
     * @param {File} file the file to save.
     * @param {String} path the file path to save the file to.
     * @param {Promise} returns a Promise that resolves once the file is saved.
     */
    addFile: function(file, path) {
        return new Ember.RSVP.Promise(function(resolve, reject){
            var currentDate = new Date(),
                fileName = file.name || '',          
                newFileName = path+currentDate.getTime()+fileName;
            if (Ember.isEmpty(fileName) && !Ember.isEmpty(file.type)) {
                var typeParts = file.type.split('/');
                if (typeParts.length > 1) {
                    newFileName += '.'+ typeParts[1];
                }
            }
            this._getFiler().then(function(filer) {
                filer.mkdir(path, false, function() {
                    filer.write(newFileName, {data: file, type: file.type}, function(fileEntry) {
                        console.log("SUCCESS SAVING FILE TO: "+newFileName);
                        resolve(fileEntry);
                    }, function(e) {
                        reject(e);
                    });
                }, function(e) {
                    reject(e);
                });
            }.bind(this));
        }.bind(this));    
    },
    
    fileToDataURL: function(file) {
        return new Ember.RSVP.Promise(function(resolve){
            var reader = new FileReader();
            reader.onloadend = function (e) {
                resolve(e.target.result);
            };
            reader.readAsDataURL(file);        
        });        
    }
});