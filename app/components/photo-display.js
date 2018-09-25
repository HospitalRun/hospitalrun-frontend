import { isEmpty } from '@ember/utils';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  computedPhotoUrl: null,
  filesystem: service(),
  isFileSystemEnabled: alias('filesystem.isFileSystemEnabled'),
  fileName: alias('photo.fileName'),
  photo: null,
  url: alias('photo.url'),

  photoUrl: computed('computedPhotoUrl', 'fileName', 'url', function() {
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
  })
});
