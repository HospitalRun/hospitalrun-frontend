import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
export default AbstractEditController.extend({
  hideCancelButton: true,
  updateCapability: 'update_config',

  afterUpdate() {
    this.displayAlert(this.get('intl').t('admin.address.titles.optionsSaved'), this.get('intl').t('admin.address.messages.addressSaved'));
  }
});
