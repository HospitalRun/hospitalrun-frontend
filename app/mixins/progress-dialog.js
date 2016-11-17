import Ember from 'ember';
export default Ember.Mixin.create({
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
    return Ember.run.later(this, function() {
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
    let progressBarStyle = Ember.String.htmlSafe(`width: ${progressBarValue}%`);
    progressDialog.set('progressBarStyle', progressBarStyle);
  },

  closeProgressModal() {
    Ember.run.cancel(this.get('progressTimer'));
    this.send('closeModal');
  },

  showProgressModal() {
    let progressDialog = Ember.Object.create(this.get('progressDialogDefaults'));
    progressDialog.progressBarStyle = new Ember.String.htmlSafe(progressDialog.progressBarStyle);
    progressDialog.set('title', this.get('progressTitle'));
    progressDialog.set('message', this.get('progressMessage'));
    this.set('progressDialog', progressDialog);
    this.set('progressTimer', this.scheduleProgress(this.get('updateProgressBar')));
    this.send('openModal', 'dialog', progressDialog);
  }
});
