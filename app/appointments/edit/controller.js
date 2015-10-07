import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import AppointmentStatuses from 'hospitalrun/mixins/appointment-statuses';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import VisitTypes from 'hospitalrun/mixins/visit-types';

export default AbstractEditController.extend(AppointmentStatuses, PatientSubmodule, VisitTypes, {
    needs: ['appointments'],
    
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

    beforeUpdate: function() {
        this._updateAppointmentDates();
        return Ember.RSVP.Promise.resolve();
    },  
    
    endHourChanged: function() {
        this._updateDate('endHour', 'endDate');
    }.observes('endHour'),
    
    endMinuteChanged: function() {
        this._updateDate('endMinute', 'endDate');
    }.observes('endMinute'),
    
    endTimeHasError: function() {
        Ember.run.once(this, function(){
            this.get('model').validate();
        });        
        var endDateError = this.get('model.errors.endDate');
        return (endDateError.length > 0);
    }.property('model.errors.endDate', 'model.startDate','model.endDate','model.isValid'),

    isAllDay: function() {
        var allDay = this.get('model.allDay'),
            isAdmissionAppointment = this.get('isAdmissionAppointment');            
        if (allDay) {
            var endDate = this.get('model.endDate'),
                startDate = this.get('model.startDate');
            this.set('model.startDate', moment(startDate).startOf('day').toDate());
            this.set('model.endDate', moment(endDate).endOf('day').toDate());
            this.set('dateFormat', 'l');
            this.set('showTime', false);
        } else {
            this.set('dateFormat', 'l h:mm A');
            this.set('showTime', true);
            if (isAdmissionAppointment) {
                this._updateAllTimes();
            }
        }
        return allDay;
    }.property('model.allDay'),
    
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
    
    _updateAppointmentDates: function() {
        var allDay = this.get('allDay'),            
            isAdmissionAppointment = this.get('isAdmissionAppointment'), 
            appointmentDate = this.get('model.appointmentDate');
        if (!isAdmissionAppointment) {
            this.set('model.endDate', appointmentDate);
            this.set('model.startDate', appointmentDate);
            if (!allDay) {
                this._updateAllTimes();
            }
        }
    },
    
    _updateDate: function(fieldName, dateFieldName) {
        var model = this.get('model'),
            fieldValue = model.get(fieldName),
            dateToChange = model.get(dateFieldName);
        if (!Ember.isEmpty(dateToChange)) {
            dateToChange = moment(dateToChange);
            if (fieldName.indexOf('Hour') > -1) {
                dateToChange.hour(fieldValue);                
            } else {
                dateToChange.minute(fieldValue);
            }
            model.set(dateFieldName, dateToChange.toDate());
            Ember.run.once(this, function(){
                model.validate();
            }); 
        }
    }
});
