<<<<<<< HEAD
import Ember from 'ember';
export default Ember.Component.extend({
  computedPhotoUrl: null,
  filesystem: Ember.inject.service(),
  isFileSystemEnabled: Ember.computed.alias('filesystem.isFileSystemEnabled'),
  fileName: Ember.computed.alias('photo.fileName'),
  photo: null,
  url: Ember.computed.alias('photo.url'),

  photoUrl: function() {
    let computedPhotoUrl = this.get('computedPhotoUrl');
    let fileName = this.get('fileName');
    let filesystem = this.get('filesystem');
    let isFileSystemEnabled = this.get('isFileSystemEnabled');
    let url = this.get('url');
    if (!Ember.isEmpty(computedPhotoUrl)) {
      return computedPhotoUrl;
    } else if (isFileSystemEnabled) {
      filesystem.pathToFileSystemURL(fileName).then(function(photoUrl) {
        if (!Ember.isEmpty(photoUrl)) {
          this.set('computedPhotoUrl', photoUrl);
        }
      }.bind(this));
    }
    return url;
  }.property('computedPhotoUrl', 'fileName', 'url')
});
=======
import { isEmpty } from '@ember/utils';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
export default Component.extend({
  computedPhotoUrl: null,
  filesystem: service(),
  isFileSystemEnabled: alias('filesystem.isFileSystemEnabled'),
  fileName: alias('photo.fileName'),
  photo: null,
  url: alias('photo.url'),

  photoUrl: function() {
    let computedPhotoUrl = this.get('computedPhotoUrl');
    let fileName = this.get('fileName');
    let filesystem = this.get('filesystem');
    let isFileSystemEnabled = this.get('isFileSystemEnabled');
    let url = this.get('url');
    if (!isEmpty(computedPhotoUrl)) {
      return computedPhotoUrl;
    } else if (isFileSystemEnabled) {
      filesystem.pathToFileSystemURL(fileName).then(function(photoUrl) {
        if (!isEmpty(photoUrl)) {
          this.set('computedPhotoUrl', photoUrl);
        }
      }.bind(this));
    }
    return url;
  }.property('computedPhotoUrl', 'fileName', 'url')
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
