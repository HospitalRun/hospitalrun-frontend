import AppointmentIndexController from 'hospitalrun/appointments/index/controller';
import Ember from 'ember';
export default AppointmentIndexController.extend({
    startKey: [],
    startingDate: null,
    _setup: function() {    
        this.set('startingDate', new Date());
    }.on('init'),

    startingDateChanged: function() {
        var startingDate = this.get('startingDate');
        this.set('previousStartKey');
        this.set('previousStartKeys',[]);
        if (!Ember.isEmpty(startingDate)) {        
            this.set('startKey', [startingDate.getTime(),null,null]);
        }
    }.observes('startingDate')
});