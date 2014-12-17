import Ember from "ember";
export default Ember.ObjectController.extend({
    longDateFormat: 'l h:mm A',
    shortDateFormat: 'l',
    timeFormat:  'h:mm A',
    
    _getDateSpan: function(startDate, endDate, format) {
        var formattedStart = startDate.format(format),
            formattedEnd = endDate.format(format);
        return '%@ - %@'.fmt(formattedStart, formattedEnd);
    },
    
    appointmentDate: function() {
        var allDay = this.get('allDay'),
            endDate = moment(this.get('endDate')),
            dateFormat = '',
            formattedDate = '',
            startDate = moment(this.get('startDate'));

        if (startDate.isSame(endDate, 'day')) {
            formattedDate = startDate.format(this.get('shortDateFormat'));
            if (!allDay) {                
                formattedDate += ' ';
                formattedDate += this._getDateSpan(startDate, endDate, this.get('timeFormat'));
            }
        } else {            
            if (allDay) {
                dateFormat = this.get('shortDateFormat');
            } else {
                dateFormat = this.get('longDateFormat');
            }
            formattedDate = this._getDateSpan(startDate, endDate, dateFormat);
        }        
        return formattedDate;
    }.property('startDate','endDate')
});