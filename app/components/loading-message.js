import Ember from 'ember';
export default Ember.Component.extend({
  tagName: 'span',
  showLoadingMessages: false,
  loadingMessages: [
    'The top butterfly flight speed is 12 miles per hour. Some moths can fly 25 miles per hour!',
    'Owls are the only birds that can see the color blue.',
    'Cats have over 100 vocal sounds; dogs only have 10.',
    'Humans use a total of 72 different muscles in speech.',
    'More than 1,000 different languages are spoken on the continent of Africa.',
    'An erythrophobe is someone who blushes easily.',
    'The most common phobia in the world is odynophobia which is the fear of pain.',
    'Your body uses 300 muscles to balance itself when you are standing still.',
    'Certain frogs can be frozen solid then thawed, and continue living.',
    'Our eyes are always the same size from birth, but our nose and ears never stop growing.',
    'Your tongue is the only muscle in your body that is attached at only one end.',
    'Camels have three eyelids to protect themselves from blowing sand.'
  ],

  _setRandomMessage: function() {
    var loadingMessages = this.get('loadingMessages'),
      idx = Math.floor(Math.random() * loadingMessages.length);
    this.set('message', loadingMessages[idx]);
    this.set('timer', Ember.run.later(this, this._setRandomMessage, 1000));
  },

  didInsertElement: function() {
    this._setRandomMessage();
  },

  willDestroyElement: function() {
    var timer = this.get('timer');
    if (!Ember.isEmpty(timer)) {
      Ember.run.cancel(timer);
    }
  }
});
