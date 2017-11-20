import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
export default Controller.extend({
  filesystem: service(),
  session: service(),
  _setup: function() {
    let fileSystem = this.get('filesystem');
    fileSystem.setup();
  }.on('init')
});
