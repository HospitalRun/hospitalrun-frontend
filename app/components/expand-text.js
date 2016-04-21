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
    this.set('userText', text);
    this.set('cursorLocation', textArea.selectionStart);
  },

  keyDown: function(k) {
    if (k.keyCode === 13) {
      const possibleSwaps = this.get('possibleSwaps');
      if (possibleSwaps && possibleSwaps.length === 1) {
        const swapTo = possibleSwaps[0].to;
        const activeSite = this.get('activeExpansionSite');
        const sliceLength = activeSite.match.length;
        const currentText = k.target.value;
        const modifiedText = currentText.slice(0, activeSite.index) + swapTo + currentText.slice(activeSite.index + sliceLength);
        k.target.value = modifiedText;

        k.preventDefault();
        k.returnValue = false;
        k.cancelBubble = true;
        return false;
      }
    }
  },

  // Find an expandable word that has the cursor within it
  activeExpansionSite: Ember.computed('userText', 'cursorLocation', function() {

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

  // If an expansion site is active, which possible swaps could occur there?
  possibleSwaps: Ember.computed('activeExpansionSite', 'expansions', function() {
    const activeSite = this.get('activeExpansionSite');

    if (activeSite) {
      const expansions = this.get('expansions');
      return Object.keys(expansions)
        .filter(ex => {
          return ex.startsWith(activeSite.term);
        })
        .sort()
        .map(from => {
          return {
            from: from,
            to: expansions[from]
          };
        });
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
            const swapTo = possibleSwaps[0].to;
            result = `Press Enter to replace '${activeSite.term}' with '${swapTo}'`;
          } else if (possibleSwaps.length > 1) {
            result =
              'Possible expansions: ' +
                possibleSwaps
                .map(swap => {
                  return swap.from;
                }).join(', ');
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
