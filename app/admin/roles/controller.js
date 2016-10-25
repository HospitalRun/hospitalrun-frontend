import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import UserRoles from 'hospitalrun/mixins/user-roles';
import UserSession from 'hospitalrun/mixins/user-session';

export default AbstractEditController.extend(UserRoles, UserSession, {
  currentRole: '',
  disabledAction: false,
  hideCancelButton: true,
  updateCapability: 'user_roles',
  filteredRoles: Ember.computed.filter('userRoles', function(userRole) {
    return (userRole.name !== 'System Administrator');
  }),

  availableCapabilities: [{
    name: 'admin',
    capabilities: [
      'admin',
      'loadDb',
      'updateConfig',
      'userRoles'
    ]
  }, {
    name: 'appointments',
    capabilities: [
      'appointments',
      'addAppointment'
    ]
  }, {
    name: 'billing',
    capabilities: [
      'billing',
      'addCharge',
      'addPricing',
      'addPricingProfile',
      'addInvoice',
      'addPayment',
      'deleteInvoice',
      'deletePricing',
      'deletePricingProfile',
      'editInvoice',
      'invoices',
      'overrideInvoice',
      'pricing'
    ]
  }, {
    name: 'patients',
    capabilities: [
      'patients',
      'addDiagnosis',
      'addPhoto',
      'addPatient',
      'addProcedure',
      'addVisit',
      'addVitals',
      'admitPatient',
      'deletePhoto',
      'deletePatient',
      'deleteAppointment',
      'deleteDiagnosis',
      'deleteProcedure',
      'deleteSocialwork',
      'deleteVitals',
      'deleteVisit',
      'dischargePatient',
      'patientReports',
      'visits'
    ]
  }, {
    name: 'medication',
    capabilities: [
      'medication',
      'addMedication',
      'deleteMedication',
      'fulfillMedication'
    ]
  }, {
    name: 'labs',
    capabilities: [
      'labs',
      'addLab',
      'completeLab',
      'deleteLab'
    ]
  }, {
    name: 'imaging',
    capabilities: [
      'imaging',
      'addImaging',
      'completeImaging',
      'deleteImaging'
    ]
  }, {
    name: 'inventory',
    capabilities: [
      'inventory',
      'addInventoryRequest',
      'addInventoryItem',
      'addInventoryPurchase',
      'adjustInventoryLocation',
      'deleteInventoryItem',
      'fulfillInventory'
    ]
  }],

  capabilitySections: Ember.computed.map('availableCapabilities', function(section) {
    let mappedCapabilities = [];
    section.capabilities.forEach((key) => {
      mappedCapabilities.push({
        key: key,
        name: this.get('i18n').t(`admin.roles.capability.${key}`)
      });
    });
    return {
      name: this.get('i18n').t(`admin.roles.capability.${section.name}`),
      capabilities: mappedCapabilities
    };
  }),

  actions: {
    selectRole(role) {
      let roleToUpdate = this.get('model').findBy('id', role.dasherize());
      this.set('currentRole', role);
      this.set('roleToUpdate', roleToUpdate);
      if (roleToUpdate) {
        let capabilities = roleToUpdate.get('capabilities');
        this.get('availableCapabilities').forEach((section) => {
          section.capabilities.forEach((capability) => {
            if (capabilities.includes(capability)) {
              this.set(capability, true);
            } else {
              this.set(capability, false);
            }
          });
        });
      } else {
        let defaultCapabilities = this.get('defaultCapabilities');
        Object.keys(defaultCapabilities).forEach((capability) => {
          let capabilityRoles = defaultCapabilities[capability];
          if (capabilityRoles.includes(role)) {
            this.set(capability, true);
          } else {
            this.set(capability, false);
          }
        });
      }
    },

    update() {
      let currentRole = this.get('currentRole');
      let roleToUpdate = this.get('roleToUpdate');
      if (Ember.isEmpty(roleToUpdate)) {
        roleToUpdate = this.get('store').createRecord('user-role', {
          id: currentRole.dasherize(),
          name: currentRole
        });
      }
      let capabilitiesToSave = [];
      this.get('availableCapabilities').forEach((section) => {
        section.capabilities.forEach((capability) => {
          if (this.get(capability) === true) {
            capabilitiesToSave.push(capability);
          }
        });
      });
      roleToUpdate.set('capabilities', capabilitiesToSave);
      roleToUpdate.save().then(() => {
        this.displayAlert(this.get('i18n').t('admin.roles.titles.roleSaved'),
          this.get('i18n').t('admin.roles.messages.roleSaved', { roleName: currentRole }));
      });
    }
  }

});
