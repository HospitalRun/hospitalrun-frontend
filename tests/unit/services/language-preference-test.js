import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import { DEFAULT_LANGUAGE } from 'hospitalrun/services/language-preference';
import sinon from 'sinon';

const preferences = {
  _id: 'preferences',
  hradmin: {
    i18n: 'es'
  },
  'testuser@test.ts': {
    i18n: 'fr'
  }
};

const configDb = {};

const currentUser = sinon.stub();

const config = Ember.Service.extend({
  getCurrentUser() {
    return currentUser();
  },
  getConfigDB() {
    return configDb;
  }
});

moduleFor('service:language-preference', 'Unit | Service | Language preference', {
  needs: ['service:config', 'service:i18n'],
  beforeEach() {
    configDb.get = sinon.stub().withArgs('preferences').resolves(preferences);
    configDb.put = sinon.stub();

    this.register('service:config', config);
    this.inject.service('config');
    this.register('service:i18n', Ember.Service.extend({}));
    this.inject.service('i18n');
  },
  afterEach() {
    configDb.get.reset();
    configDb.put.reset();
    currentUser.reset();
  }
});

test('loadUserLanguagePreference should return user language preference', function(assert) {
  currentUser.returns({ name: 'testuser@test.ts' });

  let subject = this.subject();
  return subject.loadUserLanguagePreference().then(function(lang) {
    assert.equal(lang, 'fr');
    assert.equal(subject.get('i18n.locale'), lang, 'i18n service was not updated');
  });
});

test("loadUserLanguagePreference should return default language if user's preference is not found", function(assert) {
  currentUser.returns({ name: 'no-such-user@test.ts' });

  let subject = this.subject();
  return subject.loadUserLanguagePreference().then(function(lang) {
    assert.equal(lang, DEFAULT_LANGUAGE);
    assert.equal(subject.get('i18n.locale'), lang, 'i18n service was not updated');
  });
});

test('loadUserLanguagePreference should return default language if there are no user', function(assert) {
  currentUser.returns(undefined);

  let subject = this.subject();
  return subject.loadUserLanguagePreference().then(function(lang) {
    assert.equal(lang, DEFAULT_LANGUAGE);
    assert.equal(subject.get('i18n.locale'), lang, 'i18n service was not updated');
  });
});

test('loadUserLanguagePreference sinon test should return default language if there are no preferences', function(assert) {
  configDb.get.withArgs('preferences').returns(Ember.RSVP.reject('no preferences'));

  currentUser.returns({ name: 'testuser.ts' });

  let subject = this.subject();
  return subject.loadUserLanguagePreference().then(function(lang) {
    assert.equal(lang, DEFAULT_LANGUAGE);
    assert.equal(subject.get('i18n.locale'), lang, 'i18n service was not updated');
  });
});

test('saveUserLanguagePreference should update existing user setting', function(assert) {
  currentUser.returns({ name: 'hradmin' });

  let expectedPreferences = JSON.parse(JSON.stringify(preferences));
  expectedPreferences.hradmin.i18n = 'ru';

  let subject = this.subject();
  return subject.saveUserLanguagePreference('ru').then(function() {
    sinon.assert.calledOnce(configDb.put);
    sinon.assert.calledWith(configDb.put, expectedPreferences);
    assert.equal(subject.get('i18n.locale'), 'ru', 'i18n service was not updated');
  });
});

test("saveUserLanguagePreference should update preferences when user doesn't exist", function(assert) {
  currentUser.returns({ name: 'no-such-user@test.ts' });

  let expectedPreferences = Object.assign({}, preferences, {
    'no-such-user@test.ts': {
      i18n: 'ru'
    }
  });

  let subject = this.subject();
  return subject.saveUserLanguagePreference('ru').then(function() {
    sinon.assert.calledOnce(configDb.put);
    sinon.assert.calledWith(configDb.put, expectedPreferences);
    assert.equal(subject.get('i18n.locale'), 'ru', 'i18n service was not updated');
  });
});

test("saveUserLanguagePreference should create preferences when they doesn't exist", function(assert) {
  currentUser.returns({ name: 'no-such-user@test.ts' });
  configDb.get.withArgs('preferences').returns(Ember.RSVP.reject('no preferences'));

  let expectedPreferences = {
    _id: 'preferences',
    'no-such-user@test.ts': {
      i18n: 'ru'
    }
  };

  let subject = this.subject();
  return subject.saveUserLanguagePreference('ru').then(function() {
    sinon.assert.calledOnce(configDb.put);
    sinon.assert.calledWith(configDb.put, expectedPreferences);
    assert.equal(subject.get('i18n.locale'), 'ru', 'i18n service was not updated');
  });
});

test('setApplicationLanguage should update i18n', function(assert) {
  let subject = this.subject();
  subject.setApplicationLanguage('ru');
  assert.equal(subject.get('i18n.locale'), 'ru', 'i18n service was not updated');
});