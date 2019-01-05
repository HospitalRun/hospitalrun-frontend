import EmberObject from '@ember/object';
import ArrayProxy from '@ember/array/proxy';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import sinon from 'sinon';
import { setupTest } from 'ember-qunit';
import { taskGroup } from 'ember-concurrency';
import CascadingDeletion from 'hospitalrun/mixins/cascading-deletion';
import VisitInvoicesMixin from 'hospitalrun/mixins/visit-invoices';
import PatientAppointmentsMixin from 'hospitalrun/mixins/patient-appointments';
import PatientVisitsMixin from 'hospitalrun/mixins/patient-visits';

module('Unit | Mixin | cascading-deletion', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.store = function() {
      return this.owner.lookup('service:store');
    };

    this.recursiveCreateRecordArray = function(recordType, howManyChildren, stubs) {
      let result = ArrayProxy.create({ content: [] });
      for (let i = 0; i < howManyChildren; i++) {
        result.addObject(this.recursiveCreateRecord(recordType, recordType, howManyChildren, stubs));
      }
      return result;
    };

    // creates fake record and populates the hasMany relations with child records
    // stubs the save() and unloadRecord() methods for all created records
    // excludes the hasMany('payment') relationship on the invoice model, since deletion
    // does not currently cascade along this relation
    this.recursiveCreateRecord = function(originalRecordType, recordType, howManyChildren, stubs) {
      return run(() => {
        let record = this.store().createRecord(recordType, {});
        stubs.push({
          saveStub: sinon.stub(record, 'save').callsFake(() => {}),
          unloadRecordStub: sinon.stub(record, 'unloadRecord').callsFake(() => {}),
          recordType
        });

        // for all relationships
        this.store().modelFor(recordType).eachRelationship((key, descriptor) => {
          if ((descriptor.kind == 'hasMany') && !(key == 'payments' && originalRecordType == 'invoice')) { // payments get deleted off of patient, not invoice
            let childRecordsArray = ArrayProxy.create({ content: [] });

            // for however many child records are desired
            for (let i = 0; i < howManyChildren; i++) {

              // call this method recursively
              childRecordsArray.pushObject(this.recursiveCreateRecord(originalRecordType, descriptor.type, howManyChildren, stubs));
            }

            // and attach the child records to the parent record hasMany key
            record.set(key, childRecordsArray);
          }
        });
        return record;
      });
    };
  });

  test('deleteVisit, 1 child record to each parent', function(assert) {
    let cascadingDeletion = EmberObject.extend(CascadingDeletion).extend(VisitInvoicesMixin).create();
    cascadingDeletion.deleting = taskGroup();

    let childrenPerRecord = 1;
    let stubs = [];
    let visit = this.recursiveCreateRecord('visit', 'visit', childrenPerRecord, stubs);
    let invoices = this.recursiveCreateRecordArray('invoice', childrenPerRecord, stubs);

    // STUBS
    sinon.stub(cascadingDeletion, 'getVisitInvoices').returns(invoices);

    run(() => cascadingDeletion.deleteVisit(visit));

    // ASSERTS
    assert.equal(stubs.length, 16, "There were 16 total records created");
    stubs.forEach(function(stub) {
      assert.equal(stub.saveStub.getCalls().length, 1, `save() method was called once for model:  + ${stub.recordType}`);
    });
  });

  test('deleteVisit, 2 child record to each parent', function(assert) {
    let cascadingDeletion = EmberObject.extend(CascadingDeletion).extend(VisitInvoicesMixin).create();
    cascadingDeletion.deleting = taskGroup();

    let childrenPerRecord = 2;
    let stubs = [];
    let visit = this.recursiveCreateRecord('visit', 'visit', childrenPerRecord, stubs);
    let invoices = this.recursiveCreateRecordArray('invoice', childrenPerRecord, stubs);

    // STUBS
    sinon.stub(cascadingDeletion, 'getVisitInvoices').returns(invoices);

    run(() => cascadingDeletion.deleteVisit(visit));

    // ASSERTS
    assert.equal(stubs.length, 45, "There were 45 total records created");
    stubs.forEach(function(stub) {
      assert.equal(stub.saveStub.getCalls().length, 1, `save() method was called once for model:  + ${stub.recordType}`);
    });
  });

  test('deletePatient, 1 child record to each parent', function(assert) {
    let cascadingDeletion = EmberObject.extend(CascadingDeletion).extend(VisitInvoicesMixin).extend(PatientVisitsMixin).extend(PatientAppointmentsMixin).create();
    cascadingDeletion.deleting = taskGroup();

    let childrenPerRecord = 1;
    let stubs = [];
    let patient = this.recursiveCreateRecord('patient', 'patient', childrenPerRecord, stubs);
    let visits = this.recursiveCreateRecordArray('visit', childrenPerRecord, stubs);
    let invoices = this.recursiveCreateRecordArray('invoice', childrenPerRecord, stubs);
    let appointments = this.recursiveCreateRecordArray('appointment', childrenPerRecord, stubs);

    // STUBS
    sinon.stub(cascadingDeletion, 'getVisitInvoices').returns(invoices);
    sinon.stub(cascadingDeletion, 'getPatientVisits').returns(visits);
    sinon.stub(cascadingDeletion, 'getPatientAppointments').returns(appointments);

    run(() => cascadingDeletion.deletePatient(patient));

    // ASSERTS
    assert.equal(stubs.length, 26, "There were 26 total records created");
    stubs.forEach(function(stub) {
      assert.equal(stub.saveStub.getCalls().length, 1, `save() method was called once for model:  + ${stub.recordType}`);
    });
  });

  test('deletePatient, 2 child record to each parent', function(assert) {
    let cascadingDeletion = EmberObject.extend(CascadingDeletion).extend(VisitInvoicesMixin).extend(PatientVisitsMixin).extend(PatientAppointmentsMixin).create();
    cascadingDeletion.deleting = taskGroup();

    let childrenPerRecord = 2;
    let stubs = [];
    let patient = this.recursiveCreateRecord('patient', 'patient', childrenPerRecord, stubs);
    let visits = this.recursiveCreateRecordArray('visit', childrenPerRecord, stubs);
    let firstVisitInvoices = this.recursiveCreateRecordArray('invoice', childrenPerRecord, stubs);
    let secondVisitInvoices = this.recursiveCreateRecordArray('invoice', childrenPerRecord, stubs);
    let appointments = this.recursiveCreateRecordArray('appointment', childrenPerRecord, stubs);

    // STUBS
    let getVisitInvoicesStub = sinon.stub(cascadingDeletion, 'getVisitInvoices');
    getVisitInvoicesStub.onCall(0).returns(firstVisitInvoices);
    getVisitInvoicesStub.onCall(1).returns(secondVisitInvoices);
    sinon.stub(cascadingDeletion, 'getPatientVisits').returns(visits);
    sinon.stub(cascadingDeletion, 'getPatientAppointments').returns(appointments);

    run(() => cascadingDeletion.deletePatient(patient));

    // ASSERTS
    assert.equal(stubs.length, 115, "There were 115 total records created");
    stubs.forEach(function(stub) {
      assert.equal(stub.saveStub.getCalls().length, 1, `save() method was called once for model:  + ${stub.recordType}`);
    });
  });
});
