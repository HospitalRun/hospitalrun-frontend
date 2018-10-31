import { isEmpty } from '@ember/utils';
import { later, cancel } from '@ember/runloop';
import Component from '@ember/component';
import { translationMacro as t } from 'ember-intl';
export default Component.extend({
  tagName: 'span',
  showLoadingMessages: false,
  loadingMessages: [
    t('loading.messages.0'),
    t('loading.messages.1'),
    t('loading.messages.2'),
    t('loading.messages.3'),
    t('loading.messages.4'),
    t('loading.messages.5'),
    t('loading.messages.6'),
    t('loading.messages.7'),
    t('loading.messages.8'),
    t('loading.messages.9'),
    t('loading.messages.10'),
    t('loading.messages.11')
  ],

  _setRandomMessage() {
    let loadingMessages = this.get('loadingMessages');
    let idx = Math.floor(Math.random() * loadingMessages.length);
    this.set('message', loadingMessages[idx]);
    this.set('timer', later(this, this._setRandomMessage, 1000));
  },

  didInsertElement() {
    this._setRandomMessage();
  },

  willDestroyElement() {
    let timer = this.get('timer');
    if (!isEmpty(timer)) {
      cancel(timer);
    }
  }
});
