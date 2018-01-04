import Ember from 'ember';
export default Ember.Component.extend({
  computedDocumentUrl: null,
  filesystem: Ember.inject.service(),
  isFileSystemEnabled: Ember.computed.alias('filesystem.isFileSystemEnabled'),
  fileName: Ember.computed.alias('document.fileName'),
  document: null,
  url: Ember.computed.alias('document.url'),
  tagName: 'embed',

  didInsertElement() {
    this.$().attr('src', (this.get('url')));
    this.$().attr('width', 900);
    this.$().attr('height', 750);
  },
  /*
  fileUrl: function() {
    let computedDocumentUrl = this.get('computedDocumentUrl');
    let filesystem = this.get('filesystem');
    let isFileSystemEnabled = this.get('isFileSystemEnabled');
    let url = this.get('url');
    if (!Ember.isEmpty(computedDocumentUrl)) {
      return computedDocumentUrl;
    } else if (isFileSystemEnabled) {
      filesystem.pathToFileSystemURL(url).then(function(fileUrl) {
        if (!Ember.isEmpty(fileUrl)) {
          this.set('computedDocumentUrl', fileUrl);
        }
      }.bind(this));
    }
    return url;
  }.property('computedDocumentUrl', 'fileName', 'url'),
*/
  documentUrl: function() {
    let computedDocumentUrl = this.get('computedDocumentUrl');
    let fileName = this.get('fileName');
    let filesystem = this.get('filesystem');
    let isFileSystemEnabled = this.get('isFileSystemEnabled');
    let url = this.get('url');
    if (!Ember.isEmpty(computedDocumentUrl)) {
      return computedDocumentUrl;
    } else if (isFileSystemEnabled) {
      filesystem.pathToFileSystemURL(fileName).then(function(documentUrl) {
        if (!Ember.isEmpty(documentUrl)) {
          this.set('computedDocumentUrl', documentUrl);
        }
      }.bind(this));
    }
    return url;
  }.property('computedDocumentUrl', 'fileName', 'url')
});