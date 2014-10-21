export default {
    name: 'filer',
    
    initialize: function(container, application) {
        var size = application.get('fileSystemSize'),
            filer = new Filer();
        filer.init({persistent: true, size: size}, function() {
            application.register('filesystem:filer', filer, {instantiate: false});
            application.inject('controller:filesystem', 'filer', 'filesystem:filer');
        });        
    }        
};