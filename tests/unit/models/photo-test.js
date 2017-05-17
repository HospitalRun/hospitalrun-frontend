import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('photo', 'Unit | Model | photo', {
  needs: [
    'model:patient'
  ]
});

test('downloadImageFromServer', function(assert) {
  let photo = this.subject();

  let imageRecord = Ember.Object.create({
    url: 'http://example.com',
    patientId: '123'
  });

  /**
   * Fails with
   * `this.getPatientDirectory is not a function`
   */
  assert.ok(photo.downloadImageFromServer(imageRecord), 'This will fail with an error');
});
