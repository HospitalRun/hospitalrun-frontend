import Ember from 'ember';
import EmText from 'ember-rapid-forms/components/em-text';
import textExpansion from '../utils/text-expansion';

export default Ember.Component.extend({
  expansions: {
    foo: 'bar',
    fox: 'bar',
    abc: 'aaabbbccc',
    q: 'uuu',
    long: 'ggggggggggggggggggsssssssssss wwwwwwwwwwwwwh          ddddddd #abc dsdddeghsfiuoh3yvq83y489vq3n4yv8 8943rvyq3 vyq3yrvq'
  },

  userText: '',

  didInsertElement: function() {
    try {
      const feedbackDiv = document.createElement('div');
      feedbackDiv.style.position = 'absolute';
      const textarea = this.$()[0].getElementsByTagName('textarea')[0];
      this.set('textarea', textarea);
      const textPos = textarea.getBoundingClientRect();
      const fbStyle = feedbackDiv.style;
      fbStyle.top = textPos.bottom + 'px';
      fbStyle.left = textPos.left + 'px';
      fbStyle.width = textarea.offsetWidth + 'px';
      fbStyle.backgroundColor = 'lightyellow';
      fbStyle.borderStyle = 'solid';
      fbStyle.borderWidth = '1px';
      fbStyle.borderRadius = '3px';
      fbStyle.paddingLeft = '5px';
      fbStyle.visibility = 'hidden';

      this.set('feedbackDiv', feedbackDiv);
      this.get('feedbackText');
      this.get('activeExpansionSite');

    }
    catch (e) {
      console.log('didInsert ' + e);
    }
  },

  keyUp: function(k) {
    const textArea = k.target;
    const text = textArea.value;
    Ember.run.once(this, 'set', 'userText', text);

    if (k.keyCode === 13) {
      console.log('pressed enter');
    }
  },

  activeExpansionSite: Ember.computed('userText', function() {

    const userText = this.get('userText');
    const textarea = this.get('textarea');
    if (!textarea) { return null; }
    const cursorLoc = textarea.selectionStart;
    const subjects = textExpansion.findExpansionSubjects(userText);
    const sites = textExpansion.findExpansionSites(userText, subjects);

    return sites.find(s => {
      const endIndex = s.index + s.match.length;

      return cursorLoc >= s.index && cursorLoc <= endIndex;
    });
  }),

  possibleSwaps: Ember.computed('activeExpansionSite', 'expansions', function() {
    const activeSite = this.get('activeExpansionSite');

    if (activeSite) {
      const expansions = this.get('expansions');
      return Object.keys(expansions)
        .filter(ex => {
          return ex.startsWith(activeSite.term);
        })
        .sort();
    }
  }),

  feedbackText: Ember.computed('possibleSwaps', 'activeExpansionSite', 'userText', function() {
      const div = this.get('feedbackDiv');
      var result = '';
      if (!div) { return null; }
      const possibleSwaps = this.get('possibleSwaps');
      const expansions = this.get('expansions');
      if (possibleSwaps) {
        const activeSite = this.get('activeExpansionSite');

          div.style.visibility = 'visible';
          if (possibleSwaps.length === 1) {
            const swapFrom = possibleSwaps[0];
            const swapTo = expansions[swapFrom];
            result = `Press Enter to replace '${activeSite.term}' with '${swapTo}'`;
          } else if (possibleSwaps.length > 1) {
            result = 'Possible expansions: ' + possibleSwaps.join(', ');
          }
          else {
            result = 'No expansion terms match ' + activeSite.term;
          }
      }
      else {
        div.style.visibility = 'hidden';
      }

      return result;
    }),

    feedbackDivStyle: Ember.computed('feedbackText', function() {
      const feedbackText = this.get('feedbackText');
      const visiblility = feedbackText ? 'visible' : 'hidden';
      const textArea = this.get('textarea');

      if (textArea) {
        const textPos = textArea.getBoundingClientRect();
        var styleString = `top: ${textPos.bottom}px; left: ${textPos.left}px; width: ${textArea.offsetWidth}px;
        background-color: lightyellow; border-style: solid; border-width: 1px; border-radius: 3px;
        position: absolute; padding-left: 5px; visibility: ${visiblility}`;

        return styleString;
      }
    })
});
