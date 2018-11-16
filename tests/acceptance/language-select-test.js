import { click, visit, settled as wait } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import runWithPouchDump from 'hospitalrun/tests/helpers/run-with-pouch-dump';
import addOfflineUsersForElectron from 'hospitalrun/tests/helpers/add-offline-users-for-electron';
import { waitToAppear } from 'hospitalrun/tests/helpers/wait-to-appear';
import { authenticateUser, invalidateSession } from 'hospitalrun/tests/helpers/authenticate-user';

function selectFromLanguageSelect(locale) {
  let select = document.querySelector('.language-select');
  let option = document.querySelector(`.language-select [value=${locale}]`);
  option.selected = true;
  select.dispatchEvent(new Event('change'));

  return wait();
}

let lookup;
module('Acceptance | language dropdown', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    let intl = this.owner.lookup('service:intl');
    lookup = intl.lookup.bind(intl);
  });

  hooks.afterEach(function() {
    lookup = undefined;
  });

  test('setting a language preference persists after logout', (assert) => {
    return runWithPouchDump('default', async function() {
      await addOfflineUsersForElectron();

      await authenticateUser();
      await visit('/');
      assert.dom('.view-current-title').hasText(lookup('dashboard.title', 'en'), 'Title is in English after first log in');

      await click('a.settings-trigger');
      await waitToAppear('.settings-nav');

      await selectFromLanguageSelect('fr');

      assert.dom('.view-current-title').hasText(lookup('dashboard.title', 'fr'), 'Title is in French after language change');

      await invalidateSession();
      await visit('/login');

      await authenticateUser();
      await visit('/');
      assert.dom('.view-current-title').hasText(lookup('dashboard.title', 'fr'), 'Title is in French after 2nd login');
    });
  });

  test('different users can have different language preferences on the same browser', (assert) => {
    return runWithPouchDump('default', async function() {
      await addOfflineUsersForElectron();

      await authenticateUser();
      await visit('/');
      assert.dom('.view-current-title').hasText(lookup('dashboard.title', 'en'), 'Title is in English after first log in');

      await click('a.settings-trigger');
      await waitToAppear('.settings-nav');
      await selectFromLanguageSelect('fr');
      assert.dom('.view-current-title').hasText(lookup('dashboard.title', 'fr'), 'Title is in French after language change');

      await invalidateSession();
      await visit('/login');

      await authenticateUser({
        name: 'doctor@hospitalrun.io'
      });
      await visit('/');
      assert.dom('.view-current-title').hasText(lookup('dashboard.title', 'en'), 'Title is in English for another user');

      await click('a.settings-trigger');
      await waitToAppear('.settings-nav');
      await selectFromLanguageSelect('de');
      assert.dom('.view-current-title').hasText(lookup('dashboard.title', 'de'), 'Title is in German after language change');

      await invalidateSession();
      await visit('/login');

      await authenticateUser();
      await visit('/');
      assert.dom('.view-current-title').hasText(lookup('dashboard.title', 'fr'), 'Title is in French after 2nd login');

      await invalidateSession();
      await visit('/login');

      await authenticateUser({
        name: 'doctor@hospitalrun.io'
      });
      await visit('/');
      assert.dom('.view-current-title').hasText(lookup('dashboard.title', 'de'), 'Title is in German after 2nd login');
    });
  });
});

