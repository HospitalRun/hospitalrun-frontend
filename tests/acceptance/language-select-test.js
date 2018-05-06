import { test } from 'qunit';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';

import english from 'hospitalrun/locales/en/translations';
import french from 'hospitalrun/locales/fr/translations';
import german from 'hospitalrun/locales/de/translations';

moduleForAcceptance('Acceptance | language dropdown');

test('setting a language preference persists after logout', (assert) => {
  runWithPouchDump('default', async function() {
    await addOfflineUsersForElectron();

    await authenticateUser();
    await visit('/');
    assert.dom('.view-current-title').hasText(english.dashboard.title, 'Title is in English after first log in');

    await click('a.settings-trigger');
    await waitToAppear('.settings-nav');
    await select('.language-select', 'Français');
    assert.dom('.view-current-title').hasText(french.dashboard.title, 'Title is in French after language change');

    await invalidateSession();
    await visit('/login');

    await authenticateUser();
    await visit('/');
    assert.dom('.view-current-title').hasText(french.dashboard.title, 'Title is in French after 2nd login');
  });
});

test('different users can have different language preferences on the same browser', (assert) => {
  runWithPouchDump('default', async function() {
    await addOfflineUsersForElectron();

    await authenticateUser();
    await visit('/');
    assert.dom('.view-current-title').hasText(english.dashboard.title, 'Title is in English after first log in');

    await click('a.settings-trigger');
    await waitToAppear('.settings-nav');
    await select('.language-select', 'Français');
    assert.dom('.view-current-title').hasText(french.dashboard.title, 'Title is in French after language change');

    await invalidateSession();
    await visit('/login');

    await authenticateUser({
      name: 'doctor@hospitalrun.io'
    });
    await visit('/');
    assert.dom('.view-current-title').hasText(english.dashboard.title, 'Title is in English for another user');

    await click('a.settings-trigger');
    await waitToAppear('.settings-nav');
    await select('.language-select', 'Deutsch');
    assert.dom('.view-current-title').hasText(german.dashboard.title, 'Title is in German after language change');

    await invalidateSession();
    await visit('/login');

    await authenticateUser();
    await visit('/');
    assert.dom('.view-current-title').hasText(french.dashboard.title, 'Title is in French after 2nd login');

    await invalidateSession();
    await visit('/login');

    await authenticateUser({
      name: 'doctor@hospitalrun.io'
    });
    await visit('/');
    assert.dom('.view-current-title').hasText(german.dashboard.title, 'Title is in German after 2nd login');
  });
});

