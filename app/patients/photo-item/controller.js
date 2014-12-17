import Ember from "ember";
export default Ember.ObjectController.extend({
    needs: 'filesystem',
    
    fileSystem: Ember.computed.alias('controllers.filesystem'),
    isFileSystemEnabled: Ember.computed.alias('controllers.filesystem.isFileSystemEnabled'),
    
    photoUrl: function() {
        var fileName = this.get('fileName'),
        fileSystem = this.get('fileSystem'),
        isFileSystemEnabled = this.get('isFileSystemEnabled'),
        url = this.get('url');
        if (isFileSystemEnabled) {
            fileSystem.pathToFileSystemURL(fileName).then(function(photoUrl) {
                if (!Ember.isEmpty(photoUrl)) {
                    this.set('photoUrl', photoUrl);
                }                
            }.bind(this));
        }
        return url;
    }.property('fileName', 'url')    
});