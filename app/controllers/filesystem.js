export default Ember.Controller.extend({
    filer: null,
    size: (1024*1024*1024*8), //8GB max size,
    
    
    _setup: function() {
        var size = this.get('size');
        this.filer = new Filer();
        this.filer.init({persistent: false, size: size}, function() {
            // filer.size == Filer.DEFAULT_FS_SIZE
            // filer.isOpen == true
            // filer.fs == fs
        }, function() {
            //ERROR Handler; gracefully ignore for now.
        });
    }.on('init')        
    
    
    
});