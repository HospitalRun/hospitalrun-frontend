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
      'load_db',
      'update_config',
      'user_roles'
    ]
  }, {
    name: 'appointments',
    capabilities: [
      'appointments',
      'add_appointment'
    ]
  }, {
    name: 'billing',
    capabilities: [
      'billing',
      'add_charge',
      'add_pricing',
      'add_pricing_profile',
      'add_invoice',
      'add_payment',
      'delete_invoice',
      'delete_pricing',
      'delete_pricing_profile',
      'edit_invoice',
      'invoices',
      'override_invoice',
      'pricing'
    ]
  }, {
    name: 'patients',
    capabilities: [
      'patients',
      'add_diagnosis',
      'add_photo',
      'add_patient',
      'add_visit',
      'add_vitals',
      'admit_patient',
      'delete_photo',
      'delete_patient',
      'delete_appointment',
      'delete_diagnosis',
      'delete_procedure',
      'delete_socialwork',
      'delete_vitals',
      'delete_visit',
      'discharge_patient',
      'patient_reports',
      'visits'
    ]
  }, {
    name: 'medication',
    capabilities: [
      'medication',
      'add_medication',
      'delete_medication',
      'fulfill_medication'
    ]
  }, {
    name: 'labs',
    capabilities: [
      'labs',
      'add_lab',
      'complete_lab',
      'delete_lab'
    ]
  }, {
    name: 'imaging',
    capabilities: [
      'imaging',
      'add_imaging',
      'complete_imaging',
      'delete_imaging'
    ]
  }, {
    name: 'inventory',
    capabilities: [
      'inventory',
      'add_inventory_request',
      'add_inventory_item',
      'add_inventory_purchase',
      'adjust_inventory_location',
      'delete_inventory_item',
      'delete_inventory_purchase',
      'fulfill_inventory'
    ]
  }],

  capabilitySections: Ember.computed.map('availableCapabilities', function(section) {
    var mappedCapabilities = [];
    section.capabilities.forEach((key) => {
      mappedCapabilities.push({
        key: key,
        name: this.get('i18n').t('admin.roles.capability.' + key)
      });
    });
    return {
      name: this.get('i18n').t('admin.roles.capability.' + section.name),
      capabilities: mappedCapabilities
    };
  }),

  actions: {
    selectRole(role) {
      var roleToUpdate = this.get('model').findBy('id', role.dasherize());
      this.set('currentRole', role);
      this.set('roleToUpdate', roleToUpdate);
      if (roleToUpdate) {
        var capabilities = roleToUpdate.get('capabilities');
        this.get('availableCapabilities').forEach((section) => {
          section.capabilities.forEach((capability) => {
            if (capabilities.contains(capability)) {
              this.set(capability, true);
            } else {
              this.set(capability, false);
            }
          });
        });
      } else {
        var defaultCapabilities = this.get('defaultCapabilities');
        Object.keys(defaultCapabilities).forEach((capability) => {
          var capabilityRoles = defaultCapabilities[capability];
          if (capabilityRoles.contains(role)) {
            this.set(capability, true);
          } else {
            this.set(capability, false);
          }
        });
      }
    },

    update() {
      var currentRole = this.get('currentRole');
      var roleToUpdate = this.get('roleToUpdate');
      if (Ember.isEmpty(roleToUpdate)) {
        roleToUpdate = this.get('store').createRecord('user-role', {
          id: currentRole.dasherize(),
          name: currentRole
        });
      }
      var capabilitiesToSave = [];
      this.get('availableCapabilities').forEach((section) => {
        section.capabilities.forEach((capability) => {
          if (this.get(capability) === true) {
            capabilitiesToSave.push(capability);
          }
        });
      });
      roleToUpdate.set('capabilities', capabilitiesToSave);
      roleToUpdate.save().then(() => {
        this.displayAlert(this.get('i18n').t('admin.roles.titles.role_saved'),
          this.get('i18n').t('admin.roles.messages.role_saved', { roleName: currentRole }));
      });
    }
  }

});
