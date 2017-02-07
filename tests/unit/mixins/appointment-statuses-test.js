import AppointmentStatuses from 'hospitalrun/mixins/appointment-statuses';
import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

moduleFor('mixin:appointment-statuses', 'Unit | Mixin | appointment-statuses');

test('appointmentStatusList', function(assert) {
  let appointmentStatuses = Ember.Object.extend(AppointmentStatuses).create();
  assert.deepEqual(appointmentStatuses.get('appointmentStatusList'), [
    'Attended',
    'Scheduled',
    'Canceled',
    'Missed'
  ]);
});

test('appointmentStatuses', function(assert) {
  let appointmentStatuses = Ember.Object.extend(AppointmentStatuses).create();
  assert.deepEqual(appointmentStatuses.get('appointmentStatuses'), [
    {
      id: 'Attended',
      value: 'Attended'
    },
    {
      id: 'Scheduled',
      value: 'Scheduled'
    },
    {
      id: 'Canceled',
      value: 'Canceled'
    },
    {
      id: 'Missed',
      value: 'Missed'
    }
  ]);
});

test('appointmentStatusesWithEmpty', function(assert) {
  let appointmentStatuses = Ember.Object.extend(AppointmentStatuses).create();
  assert.deepEqual(appointmentStatuses.get('appointmentStatusesWithEmpty'), [
    {
      id: '',
      value: ''
    },
    {
      id: 'Attended',
      value: 'Attended'
    },
    {
      id: 'Scheduled',
      value: 'Scheduled'
    },
    {
      id: 'Canceled',
      value: 'Canceled'
    },
    {
      id: 'Missed',
      value: 'Missed'
    }
  ]);
});
