import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
export default AbstractDeleteController.extend({
  title: 'Delete Visit',

  afterDeleteAction: function () {
    var deleteFromPatient = this.get('deleteFromPatient');
    if (deleteFromPatient) {
      return 'visitDeleted';
    } else {
      return 'closeModal';
    }
  }.property('deleteFromPatient')
});
