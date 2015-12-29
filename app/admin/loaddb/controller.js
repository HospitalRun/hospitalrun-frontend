import Ember from 'ember';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
import ProgressDialog from 'hospitalrun/mixins/progress-dialog';
export default Ember.Controller.extend(ModalHelper, ProgressDialog, {
    database: Ember.inject.service(),
    fileSystem: Ember.inject.service('filesystem'),
    progressMessage: 'Please wait while your database is loaded.',
    progressTitle: 'Loading Database',
    syncResults: null,

    actions: {
      loadFile: function() {
        var fileSystem = this.get('fileSystem'),
          fileToImport = this.get('importFile');
        if (!fileToImport || !fileToImport.type) {
          this.displayAlert('Select File To Load', 'Please select file to load.');
        } else {
          this.showProgressModal();
          this.set('syncResults');
          fileSystem. fileToString(fileToImport).then((fileAsString) => {
            var database = this.get('database');
            this.set('importFile');
            this.set('model.importFileName');
            database.loadDBFromDump(fileAsString).then((results) => {
              this.closeProgressModal();
              this.set('syncResults', results);
            }).catch((err) => {
              this.displayAlert('Error Loading', `The database could not be imported.  The error was:${JSON.stringify(err)}`);
            });
          });
        }
      }
    }
  });
