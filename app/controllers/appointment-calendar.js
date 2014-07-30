import AppointmentEvent from 'hospitalrun/views/appointment-event';
export default Ember.Calendar.CalendarController.extend({
    init: function() {
        //There probably is a better way to do this, but due to how ember-calendar is loading
        //the event view class, we need to add it to the window (Ember.lookup) so that ember-calendar
        //can find it.
        if (!Ember.lookup.Hospitalrun.AppointmentEvent) {
            Ember.lookup.Hospitalrun.AppointmentEvent = AppointmentEvent;
        }
        this._super();
    },
    
    needs: 'appointments/index',
    
    parentModel: Ember.computed.alias('controllers.appointments/index.model'),
    eventViewClass: 'Hospitalrun.AppointmentEvent',    
    states: ['day', 'week'], 
    initialState: 'week', 
    content: function () {
        console.log("in appointment content");
        var parentModel = this.get('parentModel');
        return parentModel.map(function(appointment) {
            return {
                name: appointment.get('patient.displayName'),
                start: moment(appointment.get('startDate')),
                end: moment(appointment.get('endDate')),
                appointment: appointment
            };
        });
    }.property('controllers.appointments/index.model.@each.startDate', 
               'controllers.appointments/index.model.@each.endDate')
});