import EmberObject from '@ember/object';
import { htmlSafe } from '@ember/string';
import { later, cancel } from '@ember/runloop';
import Mixin from '@ember/object/mixin';
export default Mixin.create({
  progressDialog: null,
  progressDialogDefaults: {
    showProgress: true,
    hideCancelButton: true,
    hideUpdateButton: true,
    progressBarValue: 0,
    progressBarStyle: 'width: 0%;'
  },
  progressInterval: 500,
  progressMessage: null,
  progressTimer: null,
  progressTitle: null,

  scheduleProgress(f) {
    return later(this, function() {
      f.apply(this);
      this.set('progressTimer', this.scheduleProgress(f));
    }, this.get('progressInterval'));
  },

  updateProgressBar() {
    let progressDialog = this.get('progressDialog');
    let progressBarValue = progressDialog.get('progressBarValue');
    progressBarValue += 10;
    if (progressBarValue > 100) {
      progressBarValue = 0;
    }
    progressDialog.set('progressBarValue', progressBarValue);
    let progressBarStyle = htmlSafe(`width: ${progressBarValue}%`);
    progressDialog.set('progressBarStyle', progressBarStyle);
  },

  closeProgressModal() {
    cancel(this.get('progressTimer'));
    this.send('closeModal');
  },

  showProgressModal() {
    let progressDialog = EmberObject.create(this.get('progressDialogDefaults'));
    progressDialog.progressBarStyle = htmlSafe(progressDialog.progressBarStyle);
    progressDialog.set('title', this.get('progressTitle'));
    progressDialog.set('message', this.get('progressMessage'));
    this.set('progressDialog', progressDialog);
    this.set('progressTimer', this.scheduleProgress(this.get('updateProgressBar')));
    this.send('openModal', 'dialog', progressDialog);
  }
});
