import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from "ember";
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import ReturnTo from 'hospitalrun/mixins/return-to';
import VisitTypes from 'hospitalrun/mixins/visit-types';

export default AbstractEditController.extend(PatientSubmodule, ReturnTo, VisitTypes, {
    needs: ['appointments','pouchdb'],

    dateFormat: 'l h:mm A',
    findPatientVisits: false,
    
    hourList: function(){
        var hour, 
            hourList = [];
        for (hour=0; hour < 24; hour++) {
            var hourText = (hour%12) + (hour<12 ? ' AM' : ' PM');
            if (hourText === '0 AM') {
                hourText = 'Midnight';
            } else if (hourText === '0 PM') {
                hourText = 'Noon';
            }
            hourList.push({
                name: hourText,
                value: hour
            });
        }
        return hourList;
    }.property(),
    
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
    
    minuteList: function(){
        var minute, 
            minuteList = [];
        for (minute=0; minute < 60; minute++) {
            minuteList.push(String('00' + minute).slice(-2));
        }
        return minuteList;
    }.property(),
    
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
    
    isAdmissionAppointment: function() {
        var appointmentType = this.get('appointmentType'),
            isAdmissionAppointment = (appointmentType === 'Admission');
        if (!isAdmissionAppointment) {
            this.set('allDay', true);
        }        
        return isAdmissionAppointment;
    }.property('appointmentType'),
    
    updateCapability: 'add_appointment',

    afterUpdate: function() {
        this.send(this.get('cancelAction'));
    },

    allDayChanged: function() {
        var allDay = this.get('allDay'),
            isAdmissionAppointment = this.get('isAdmissionAppointment');
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
            if (isAdmissionAppointment) {
                this._updateAllTimes();
            }
        }
    }.observes('allDay'),
    
    endHourChanged: function() {
        this._updateDate('endHour', 'endDate');
    }.observes('endHour'),
    
    endMinuteChanged: function() {
        this._updateDate('endMinute', 'endDate');
    }.observes('endMinute'),
    
    endTimeHasError: function() {
        var endDateError = this.get('errors.endDate');
        return (endDateError.length > 0);
    }.property('errors.endDate'),
    
    appointmentDateChanged: function() {
        var allDay = this.get('allDay'),            
            isAdmissionAppointment = this.get('isAdmissionAppointment'), 
            appointmentDate = this.get('appointmentDate');
        if (!isAdmissionAppointment) {
            this.set('endDate', appointmentDate);
            this.set('startDate', appointmentDate);
            if (!allDay) {
                this._updateAllTimes();
            }
        }
    }.observes('appointmentType', 'allDay', 'appointmentDate'),
    
    startHourChanged: function() {
        this._updateDate('startHour', 'startDate');
    }.observes('startHour'),
    
    startMinuteChanged: function() {
        this._updateDate('startMinute', 'startDate');
    }.observes('startMinute'),    
    
    _updateAllTimes: function() {
        this.endHourChanged();
        this.endMinuteChanged();
        this.startMinuteChanged();
        this.startHourChanged();
    },
    
    _updateDate: function(fieldName, dateFieldName) {
        var fieldValue = this.get(fieldName),
            dateToChange = this.get(dateFieldName);
        if (!Ember.isEmpty(dateToChange)) {
            dateToChange = moment(dateToChange);
            if (fieldName.indexOf('Hour') > -1) {
                dateToChange.hour(fieldValue);                
            } else {
                dateToChange.minute(fieldValue);
            }
            this.set(dateFieldName, dateToChange.toDate());
            this.dateChanged();
        }
    }
});
