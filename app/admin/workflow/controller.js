import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
export default AbstractEditController.extend({
  hideCancelButton: true,
  updateCapability: 'update_config',

  afterUpdate: function() {
    this.displayAlert(this.get('i18n').t('admin.workflow.titles.optionsSaved'), this.get('i18n').t('admin.workflow.messages.optionsSaved'));
  }
});
