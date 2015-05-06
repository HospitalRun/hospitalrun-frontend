import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from "ember";
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import ReturnTo from 'hospitalrun/mixins/return-to';
import VisitTypes from 'hospitalrun/mixins/visit-types';

export default AbstractEditController.extend(PatientSubmodule, ReturnTo, VisitTypes, {
    needs: ['appointments','pouchdb'],

    dateFormat: 'l h:mm A',
    findPatientVisits: false,
    locationList: Ember.computed.alias('controllers.appointments.locationList'),

    lookupListsToUpdate: [{
        name: 'physicianList',
        property: 'provider',
        id: 'physician_list'
    }, {
        name: 'locationList',
        property: 'location',
        id: 'visit_location_list'
    }],
    
    physicianList: Ember.computed.alias('controllers.appointments.physicianList'),
    showTime: true,
    visitTypesList: Ember.computed.alias('controllers.appointments.visitTypeList'),
    
    cancelAction: function() {
        var returnTo = this.get('returnTo');
        if (Ember.isEmpty(returnTo)) {
            return this._super();
        } else {
            return 'returnTo';
        }
    }.property('returnTo'),
    
    dateChanged: function() {
        Ember.run.once(this, function(){
            this.get('model').validate();
        });
    }.observes('startDate','endDate'),
    
    updateCapability: 'add_appointment',

    afterUpdate: function() {
        this.send(this.get('cancelAction'));
    },

    allDayChanged: function() {
        var allDay = this.get('allDay');
        if (allDay) {
            var endDate = this.get('endDate'),
                startDate = this.get('startDate');
            this.set('startDate', moment(startDate).startOf('day').toDate());
            this.set('endDate', moment(endDate).endOf('day').toDate());
            this.set('dateFormat', 'l');
            this.set('showTime', false);
        } else {
            this.set('dateFormat', 'l h:mm A');
            this.set('showTime', true);
        }
    }.observes('allDay')
});
