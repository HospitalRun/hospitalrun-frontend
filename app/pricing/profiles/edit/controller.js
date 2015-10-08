import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
export default AbstractEditController.extend({
  actions: {
    cancel: function () {
      this.send('closeModal');
    }
  },

  afterUpdate: function (record) {
    var message = 'The pricing profile %@ has been saved.'.fmt(record.get('name'));
    this.displayAlert('Pricing Profile Saved', message);
    this.send('refreshProfiles');
  }
});
