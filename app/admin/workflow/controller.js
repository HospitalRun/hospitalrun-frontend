import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
export default AbstractEditController.extend({
  hideCancelButton: true,
  updateCapability: 'update_config',

  afterUpdate() {
    this.displayAlert(this.get('intl').t('admin.workflow.titles.optionsSaved'), this.get('intl').t('admin.workflow.messages.optionsSaved'));
  }
});
