import { test } from 'qunit';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';

import english from 'hospitalrun/locales/en/translations';
import french from 'hospitalrun/locales/fr/translations';
import german from 'hospitalrun/locales/de/translations';

moduleForAcceptance('Acceptance | language dropdown');

test('setting a language preference persists after logout', (assert) => {
  runWithPouchDump('default', () => {
    addOfflineUsersForElectron();

    andThen(() => {
      authenticateUser();
      visit('/');
    });

    andThen(() => {
      assert.equal(find('.view-current-title').text(), english.dashboard.title, 'Title is NOT in English after first log in');
    });

    andThen(() => {
      click('a.settings-trigger');
      waitToAppear('.settings-nav');
      select('.language-select', 'Français');
    });

    andThen(() => {
      assert.equal(find('.view-current-title').text(), french.dashboard.title, 'Title is NOT in French after language change');
    });

    andThen(() => {
      invalidateSession();
      visit('/login');
    });

    andThen(() => {
      authenticateUser();
      visit('/');
    });

    andThen(() => {
      assert.equal(find('.view-current-title').text(), french.dashboard.title, 'Title is NOT in French after 2nd login');
    });
  });
});

test('different users can have different language preferences on the same browser', (assert) => {
  runWithPouchDump('default', () => {
    addOfflineUsersForElectron();

    andThen(() => {
      authenticateUser();
      visit('/');
    });

    andThen(() => {
      assert.equal(find('.view-current-title').text(), english.dashboard.title, 'Title is NOT in English after first log in');
    });

    andThen(() => {
      click('a.settings-trigger');
      waitToAppear('.settings-nav');
      select('.language-select', 'Français');
    });

    andThen(() => {
      assert.equal(find('.view-current-title').text(), french.dashboard.title, 'Title is NOT in French after language change');
    });

    andThen(() => {
      invalidateSession();
      visit('/login');
    });

    andThen(() => {
      authenticateUser({
        name: 'doctor@hospitalrun.io'
      });
      visit('/');
    });

    andThen(() => {
      assert.equal(find('.view-current-title').text(), english.dashboard.title, 'Title is NOT in English for another user');
    });

    andThen(() => {
      click('a.settings-trigger');
      waitToAppear('.settings-nav');
      select('.language-select', 'Deutsch');
    });

    andThen(() => {
      assert.equal(find('.view-current-title').text(), german.dashboard.title, 'Title is NOT in German after language change');
    });

    andThen(() => {
      invalidateSession();
      visit('/login');
    });

    andThen(() => {
      authenticateUser();
      visit('/');
    });

    andThen(() => {
      assert.equal(find('.view-current-title').text(), french.dashboard.title, 'Title is NOT in French after 2nd login');
    });

    andThen(() => {
      invalidateSession();
      visit('/login');
    });

    andThen(() => {
      authenticateUser({
        name: 'doctor@hospitalrun.io'
      });
      visit('/');
    });

    andThen(() => {
      assert.equal(find('.view-current-title').text(), german.dashboard.title, 'Title is NOT in German after 2nd login');
    });
  });
});

