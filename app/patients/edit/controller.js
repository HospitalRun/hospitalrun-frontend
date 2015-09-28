import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import BloodTypes from 'hospitalrun/mixins/blood-types';
import Ember from "ember";
import GenderList from 'hospitalrun/mixins/gender-list';
import ReturnTo from 'hospitalrun/mixins/return-to';
import UserSession from "hospitalrun/mixins/user-session";
export default AbstractEditController.extend(BloodTypes, GenderList, ReturnTo, UserSession, {

    canAddAppointment: function() {
        return this.currentUserCan('add_appointment');
    }.property(),

    canAddContact: function() {
        return this.currentUserCan('add_patient');
    }.property(),

    canAddImaging: function() {
        return this.currentUserCan('add_imaging');
    }.property(),

    canAddLab: function() {
        return this.currentUserCan('add_lab');
    }.property(),

    canAddMedication: function() {
        return this.currentUserCan('add_medication');
    }.property(),

    canAddPhoto: function() {
        var isFileSystemEnabled = this.get('isFileSystemEnabled');
        return (this.currentUserCan('add_photo') && isFileSystemEnabled);
    }.property(),

    canAddSocialWork: function() {
        return this.currentUserCan('add_socialwork');
    }.property(),

    canAddVisit: function() {
        return this.currentUserCan('add_visit');
    }.property(),

    canDeleteAppointment: function() {
        return this.currentUserCan('delete_appointment');
    }.property(),

    canDeleteContact: function() {
        return this.currentUserCan('add_patient');
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

    canDeletePhoto: function() {
        return this.currentUserCan('delete_photo');
    }.property(),

    canDeleteSocialWork: function() {
        return this.currentUserCan('delete_socialwork');
    }.property(),

    canDeleteVisit: function() {
        return this.currentUserCan('delete_visit');
    }.property(),

    economicClassificationTypes: [
        'A',
        'B',
        'C1',
        'C2',
        'C3',
        'D'
    ],

    livingArrangementList: [
        'Homeless',
        'Institution',
        'Owned',
        'Rent',
        'Shared'
    ],

    patientTypes: [
        'Charity',
        'Private'
    ],

    philhealthTypes: [
        'Employed: Government',
        'Employed: Non Paying Member/Lifetime',
        'Employed: OWWA/OFW',
        'Employed: Private',
        'Employed: Sponsored/Indigent',
        'Self Employed'
    ],

    filesystem: Ember.inject.service(),
    database: Ember.inject.service(),
    patientController: Ember.inject.controller('patients'),

    addressOptions: Ember.computed.alias('patientController.addressOptions'),
    address1Include: Ember.computed.alias('patientController.addressOptions.value.address1Include'),
    address1Label: Ember.computed.alias('patientController.addressOptions.value.address1Label'),
    address2Include: Ember.computed.alias('patientController.addressOptions.value.address2Include'),
    address2Label: Ember.computed.alias('patientController.addressOptions.value.address2Label'),
    address3Include: Ember.computed.alias('patientController.addressOptions.value.address3Include'),
    address3Label: Ember.computed.alias('patientController.addressOptions.value.address3Label'),
    address4Include: Ember.computed.alias('patientController.addressOptions.value.address4Include'),
    address4Label: Ember.computed.alias('patientController.addressOptions.value.address4Label'),

    clinicList: Ember.computed.alias('patientController.clinicList'),
    countryList: Ember.computed.alias('patientController.countryList'),
    isFileSystemEnabled: Ember.computed.alias('filesystem.isFileSystemEnabled'),

    pricingProfiles: Ember.computed.alias('patientController.pricingProfiles'),
    statusList: Ember.computed.alias('patientController.statusList'),

    haveAdditionalContacts: function() {
        var additionalContacts = this.get('additionalContacts');
        return (!Ember.isEmpty(additionalContacts));
    }.property('additionalContacts'),

    haveAddressOptions: function() {
        var addressOptions = this.get('addressOptions');
        return (!Ember.isEmpty(addressOptions));
    }.property('addressOptions'),

    lookupListsToUpdate: [{
        name: 'countryList',
        property: 'country',
        id: 'country_list'
    }, {
        name: 'clinicList',
        property: 'clinic',
        id: 'clinic_list'
    }, {
        name: 'statusList',
        property: 'status',
        id: 'patient_status_list'
    }],

    patientImaging: function() {
        return this._getVisitCollection('imaging');
    }.property('visits.@each.imaging'),

    patientLabs: function() {
        return this._getVisitCollection('labs');
    }.property('visits.@each.labs'),

    patientMedications: function() {
        return this._getVisitCollection('medication');
    }.property('visits.@each.medication'),

    patientProcedures: function() {
        return this._getVisitCollection('procedures');
    }.property('visits.@each.procedures'),

    showExpenseTotal: true,

    totalExpenses: function() {
        var expenses = this.get('expenses');
        if (!Ember.isEmpty(expenses)) {
            var total = expenses.reduce(function(previousValue, expense) {
                if (!Ember.isEmpty(expense.cost)) {
                    return previousValue +  parseInt(expense.cost);
                }
            }, 0);
            this.set('showExpenseTotal', true);
            return total;
        } else {
            this.set('showExpenseTotal', false);
        }
    }.property('expenses'),

    updateCapability: 'add_patient',

    actions: {
        addContact: function(newContact) {
            var additionalContacts = this.getWithDefault('additionalContacts', []);
            additionalContacts.addObject(newContact);
            this.set('additionalContacts', additionalContacts);
            this.send('update', true);
            this.send('closeModal');
        },

        /**
         * Add the specified photo to the patient's record.
         * @param {File} photoFile the photo file to add.
         * @param {String} caption the caption to store with the photo.
         * @param {boolean} coverImage flag indicating if image should be marked as the cover image (currently unused).
         */
        addPhoto: function(photoFile, caption, coverImage) {
            var dirToSaveTo = this.get('id') + '/photos/',
                fileSystem = this.get('filesystem'),
                photos = this.get('model.photos'),
                newPatientPhoto = this.get('store').createRecord('photo', {
                    patient: this.get('model'),
                    localFile: true,
                    caption: caption,
                    coverImage: coverImage,
                });
            newPatientPhoto.save().then(function(savedPhotoRecord) {
                var pouchDbId = this.get('database').getPouchId(savedPhotoRecord.get('id'),'photo');
                fileSystem.addFile(photoFile, dirToSaveTo, pouchDbId).then(function(fileEntry) {
                    fileSystem.fileToDataURL(photoFile).then(function(photoDataUrl) {
                        savedPhotoRecord = this.get('store').find('photo', savedPhotoRecord.get('id')).then(function(savedPhotoRecord) {
                            var dataUrlParts = photoDataUrl.split(',');
                            savedPhotoRecord.setProperties({
                                fileName: fileEntry.fullPath,
                                url: fileEntry.toURL(),
                                _attachments: {
                                    file: {
                                        content_type: photoFile.type,
                                        data: dataUrlParts[1]
                                    }
                                }
                            });
                            savedPhotoRecord.save().then(function(savedPhotoRecord) {
                                photos.addObject(savedPhotoRecord);
                                this.send('closeModal');
                            }.bind(this));
                        }.bind(this));
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        },

        appointmentDeleted: function(deletedAppointment) {
            var appointments = this.get('appointments');
            appointments.removeObject(deletedAppointment);
            this.send('closeModal');
        },

        deleteContact: function(model) {
            var contact = model.get('contactToDelete');
            var additionalContacts = this.get('additionalContacts');
            additionalContacts.removeObject(contact);
            this.set('additionalContacts', additionalContacts);
            this.send('update', true);
        },

        deleteExpense: function(model) {
            var expense = model.get('expenseToDelete'),
                expenses = this.get('expenses');
            expenses.removeObject(expense);
            this.set('expenses', expenses);
            this.send('update', true);
        },

        deleteFamily: function(model) {
            var family = model.get('familyToDelete'),
                familyInfo = this.get('familyInfo');
            familyInfo.removeObject(family);
            this.set('familyInfo', familyInfo);
            this.send('update', true);
        },

        deletePhoto: function(model) {
            var photo = model.get('photoToDelete'),
                photoId = model.get('id'),
                photos = this.get('model.photos'),
                filePath = photo.get('fileName');
            photos.removeObject(photo);
            photo.destroyRecord().then(function() {
                var fileSystem = this.get('filesystem'),
                    isFileSystemEnabled = this.get('isFileSystemEnabled');
                if (isFileSystemEnabled) {
                    var pouchDbId = this.get('database').getPouchId(photoId,'photo');
                    fileSystem.deleteFile(filePath, pouchDbId);
                }
            }.bind(this));
        },

        editAppointment: function(appointment) {
            appointment.set('returnToPatient', true);
            this.transitionToRoute('appointments.edit', appointment);
        },

        editImaging: function(imaging) {
            if (imaging.get('canEdit')) {
                imaging.setProperties({
                    'returnToPatient': true
                });
                this.transitionToRoute('imaging.edit', imaging);
            }
        },

        editLab: function(lab) {
            if (lab.get('canEdit')) {
                lab.setProperties({
                    'returnToPatient': true
                });
                this.transitionToRoute('labs.edit', lab);
            }
        },

        editMedication: function(medication) {
            if (medication.get('canEdit')) {
                medication.set('returnToPatient', true);
                this.transitionToRoute('medication.edit', medication);
            }
        },

        editPhoto: function(photo) {
            this.send('openModal', 'patients.photo', photo);
        },

        editProcedure: function(procedure) {
            this.transitionToRoute('procedures.edit', procedure);
        },

        editVisit: function(visit) {
            this.transitionToRoute('visits.edit', visit);
        },

        newAppointment: function() {
            this._addChildObject('appointments.edit');
        },

        newImaging: function() {
            this._addChildObject('imaging.edit');
        },

        newLab: function() {
            this._addChildObject('labs.edit');
        },

        newMedication: function() {
            this._addChildObject('medication.edit');
        },

        newVisit: function() {
            var patient = this.get('model'),
                visits = this.get('visits');
            this.send('createNewVisit', patient, visits);
        },

        showAddContact: function() {
            this.send('openModal', 'patients.add-contact', {});
        },

        showAddPhoto: function() {
            this.send('openModal', 'patients.photo', {
                isNew: true
            });
        },

        showDeleteAppointment: function(appointment) {
            appointment.set('deleteFromPatient', true);
            this.send('openModal', 'appointments.delete', appointment);
        },

        showDeleteContact: function(contact) {
            this.send('openModal', 'dialog', Ember.Object.create({
                confirmAction: 'deleteContact',
                title: 'Delete Contact',
                message: 'Are you sure you want to delete this contact?',
                contactToDelete: contact,
                updateButtonAction: 'confirm',
                updateButtonText: 'Ok'
            }));
        },

        showDeleteExpense: function(expense) {
            this.send('openModal', 'dialog', Ember.Object.create({
                confirmAction: 'deleteExpense',
                title: 'Delete Expense',
                message: 'Are you sure you want to delete this expense?',
                expenseToDelete: expense,
                updateButtonAction: 'confirm',
                updateButtonText: 'Ok'
            }));
        },

        showDeleteFamily: function(familyInfo) {
            this.send('openModal', 'dialog', Ember.Object.create({
                confirmAction: 'deleteFamily',
                title: 'Delete Family Member',
                message: 'Are you sure you want to delete this family member?',
                familyToDelete: familyInfo,
                updateButtonAction: 'confirm',
                updateButtonText: 'Ok'
            }));

        },

        showDeleteImaging: function(imaging) {
            this.send('openModal', 'imaging.delete', imaging);
        },

        showDeleteLab: function(lab) {
            this.send('openModal', 'labs.delete', lab);
        },

        showDeleteMedication: function(medication) {
            this.send('openModal', 'medication.delete', medication);
        },

        showDeletePhoto: function(photo) {
            this.send('openModal', 'dialog', Ember.Object.create({
                confirmAction: 'deletePhoto',
                title: 'Delete Photo',
                message: 'Are you sure you want to delete this photo?',
                photoToDelete: photo,
                updateButtonAction: 'confirm',
                updateButtonText: 'Ok'
            }));
        },

        showDeleteVisit: function(visit) {
            visit.set('deleteFromPatient', true);
            this.send('openModal', 'visits.delete', visit);
        },

        showEditExpense: function(model) {
            if (Ember.isEmpty(model)) {
                model = this.get('store').createRecord('social-expense');
            }
             this.send('openModal', 'patients.socialwork.expense', model);
        },

        showEditFamily: function(model) {
            if (Ember.isEmpty(model)) {
                model = this.get('store').createRecord('family-info');
            }
            this.send('openModal', 'patients.socialwork.family-info', model);
        },

        updateExpense: function(model) {
            var expenses = this.getWithDefault('expenses', []),
                isNew = model.isNew;
            if (isNew) {
                delete model.isNew;
                expenses.addObject(model);
            }
            this.set('expenses', expenses);
            this.send('update', true);
            this.send('closeModal');
        },

        updateFamilyInfo: function(model) {
            var familyInfo = this.getWithDefault('familyInfo',[]),
                isNew = model.isNew;
            if (isNew) {
                delete model.isNew;
                familyInfo.addObject(model);
                this.set('familyInfo', familyInfo);
            }
            this.send('update', true);
            this.send('closeModal');
        },

        updatePhoto: function(photo) {
            photo.save().then(function() {
                this.send('closeModal');
            }.bind(this));
        },

        visitDeleted: function(deletedVisit) {
            var visits = this.get('visits');
            visits.removeObject(deletedVisit);
            this.send('closeModal');
        }

    },

    _addChildObject: function(route) {
        this.transitionToRoute(route, 'new').then(function(newRoute) {
            newRoute.currentModel.setProperties( {
                patient: this.get('model'),
                returnToPatient: true,
                selectPatient: false
            });
        }.bind(this));
    },

    _getVisitCollection: function(name) {
        var returnList = [],
            visits = this.get('visits');
        if (!Ember.isEmpty(visits)) {
            visits.forEach(function(visit) {
                visit.get(name).then(function(items) {
                    returnList.addObjects(items);
                    if (returnList.length > 0) {
                        returnList[0].set('first', true);
                    }
                });
            });
        }
        return returnList;
    },

    afterUpdate: function(record) {
        var message =  'The patient record for %@ has been saved.'.fmt(record.get('displayName'));
        this.displayAlert('Patient Saved', message);
    }

});
