import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { translationMacro as t } from 'ember-i18n';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
import ProgressDialog from 'hospitalrun/mixins/progress-dialog';
export default Controller.extend(ModalHelper, ProgressDialog, {
  database: service(),
  fileSystem: service('filesystem'),
  progressMessage: t('admin.loaddb.progressMessage'),
  progressTitle: t('admin.loaddb.progressTitle'),
  syncResults: null,
  fileImportedName: null,

  actions: {
    loadFile() {
      let fileSystem = this.get('fileSystem');
      let fileToImport = this.get('importFile');
      if (!fileToImport || !fileToImport.type) {
        this.displayAlert(
          this.get('intl').t('admin.loaddb.displayAlertTitle'),
          this.get('intl').t('admin.loaddb.displayAlertMessage')
        );
      } else {
        this.showProgressModal();
        this.set('syncResults');
        this.set('fileImportedName');
        fileSystem.fileToString(fileToImport).then((fileAsString) => {
          let database = this.get('database');
          let fileName = this.get('importFile.name');
          this.set('fileImportedName', fileName);
          this.set('importFile');
          this.set('model.importFileName');
          database.loadDBFromDump(fileAsString).then((results) => {
            this.closeProgressModal();
            this.set('syncResults', results);
          }).catch((err) => {
            this.displayAlert(
              this.get('intl').t('admin.loaddb.errorDisplayAlertTitle'),
              this.get('intl').t('admin.loaddb.errorDisplayAlertMessage', { error: JSON.stringify(err) })
            );
          });
        });
      }
    }
  }
});
