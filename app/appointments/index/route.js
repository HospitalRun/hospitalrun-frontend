import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
  editReturn: 'appointments.index',
  modelName: 'appointment',
  pageTitle: 'Appointments This Week',

  _getStartKeyFromItem: function (item) {
    var endDate = item.get('endDate'),
      id = this._getPouchIdFromItem(item),
      startDate = item.get('startDate');
    if (endDate && endDate !== '') {
      endDate = new Date(endDate);
      if (endDate.getTime) {
        endDate = endDate.getTime();
      }
    }
    if (startDate && startDate !== '') {
      startDate = new Date(startDate);
      if (startDate.getTime) {
        startDate = startDate.getTime();
      }
    }

    return [startDate, endDate, id];
  },

  _modelQueryParams: function () {
    var endOfWeek = moment().endOf('week').toDate().getTime(),
      startOfWeek = moment().startOf('week').toDate().getTime(),
      maxId = this._getMaxPouchId();
    return {
      options: {
        startkey: [startOfWeek, null, null],
        endkey: [endOfWeek, endOfWeek, maxId]
      },
      mapReduce: 'appointments_by_date'
    };
  },

  actions: {
    editAppointment: function (appointment) {
      appointment.set('returnTo', this.get('editReturn'));
      this.send('editItem', appointment);
    }
  }
});
