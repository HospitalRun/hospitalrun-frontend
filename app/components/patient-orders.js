import Ember from 'ember';
import UserSession from 'hospitalrun/mixins/user-session';
export default Ember.Component.extend(UserSession, {
  editImagingAction: 'editImaging',
  editLabAction: 'editLab',
  editMedicationAction: 'editMedication',
  newImagingAction: 'newImaging',
  newLabAction: 'newLab',
  newMedicationAction: 'newMedication',
  showDeleteImagingAction: 'showDeleteImaging',
  showDeleteLabAction: 'showDeleteLab',
  showDeleteMedicationAction: 'showDeleteMedication',

  canAddImaging: function() {
    return this.currentUserCan('add_imaging');
  }.property(),

  canAddLab: function() {
    return this.currentUserCan('add_lab');
  }.property(),

  canAddMedication: function() {
    return this.currentUserCan('add_medication');
  }.property(),

  canDeleteImaging: function() {
    return this.currentUserCan('delete_imaging');
  }.property(),

  canDeleteLab: function() {
    return this.currentUserCan('delete_lab');
  }.property(),

  canDeleteMedication: function() {
    return this.currentUserCan('delete_medication');
  }.property(),

  i18n: Ember.inject.service(),
  visit: null,

  didReceiveAttrs() {
    this._super(...arguments);
    Ember.RSVP.hash({
      imaging: this.get('visit.imaging'),
      labs: this.get('visit.labs'),
      medication: this.get('visit.medication')
    }).then((results) => {
      let orderList = new Ember.A();
      orderList.addObjects(results.imaging.map((item) => {
        item.set('isImaging', true);
        item.set('name', item.get('imagingType.name'));
        item.set('dateProcessed', item.get('imagingDate'));
        this._setPermissions(item, 'canAddImaging', 'canDeleteImaging');
        return item;
      }));
      orderList.addObjects(results.labs.map((item) => {
        item.set('isLab', true);
        item.set('name', item.get('labType.name'));
        item.set('dateProcessed', item.get('labDate'));
        this._setPermissions(item, 'canAddLab', 'canDeleteLab');
        return item;
      }));
      orderList.addObjects(results.medication.map((item) => {
        item.set('isMedication', true);
        item.set('name', item.get('medicationName'));
        item.set('dateProcessed', item.get('prescriptionDate'));
        item.set('result', '');
        item.set('notes', item.get('prescription'));
        this._setPermissions(item, 'canAddMedication', 'canDeleteMedication');
        return item;
      }));
      this.set('orderList', orderList);
    });
  },

  _setPermissions: function(item, editPerm, deletePerm) {
    if (item.get('canEdit')) {
      if (this.get(editPerm)) {
        item.set('canEdit', true);
      }
      if (this.get(deletePerm)) {
        item.set('canDelete', true);
      }
    }
  },

  actions: {
    newImaging: function() {
      this.sendAction('newImagingAction');
    },

    newLab: function() {
      this.sendAction('newLabAction');
    },

    newMedication: function() {
      this.sendAction('newMedicationAction');
    },

    editOrder: function(order) {
      let modelName = order.get('constructor.modelName').capitalize();
      this.sendAction(`edit${modelName}Action`, order);
    },

    showDeleteOrder: function(order) {
      let modelName = order.get('constructor.modelName').capitalize();
      this.sendAction(`showDelete${modelName}Action`, order);
    }
  }

});
