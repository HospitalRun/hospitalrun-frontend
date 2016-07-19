import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
import ProgressDialog from 'hospitalrun/mixins/progress-dialog';
export default Ember.Controller.extend(ModalHelper, ProgressDialog, {
    database: Ember.inject.service(),
    fileSystem: Ember.inject.service('filesystem'),
    progressMessage: t('admin.loaddb.progress_message'),
    progressTitle: t('admin.loaddb.progress_title'),
    syncResults: null,

    actions: {
      loadFile: function() {
        var fileSystem = this.get('fileSystem'),
          fileToImport = this.get('importFile');
        if (!fileToImport || !fileToImport.type) {
          this.displayAlert(
            this.get('i18n').t('admin.loaddb.display_alert_title'),
            this.get('i18n').t('admin.loaddb.display_alert_message')
          );
        } else {
          this.showProgressModal();
          this.set('syncResults');
          fileSystem.fileToString(fileToImport).then((fileAsString) => {
            var database = this.get('database');
            this.set('importFile');
            this.set('model.importFileName');
            database.loadDBFromDump(fileAsString).then((results) => {
              this.closeProgressModal();
              this.set('syncResults', results);
            }).catch((err) => {
              this.displayAlert(
                this.get('i18n').t('admin.loaddb.error_display_alert_title'),
                this.get('i18n').t('admin.loaddb.error_display_alert_message', { error: JSON.stringify(err) })
              );
            });
          });
        }
      }
    }
  });
