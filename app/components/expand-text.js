import EmText from 'ember-rapid-forms/components/em-text';
import textExpansion from '../utils/text-expansion';

export default EmText.extend({
  expansions: {
    foo: 'bar',
    fox: 'bar',
    abc: 'aaabbbccc',
    q: 'uuu',
    long: 'ggggggggggggggggggsssssssssss wwwwwwwwwwwwwh          ddddddd #abc dsdddeghsfiuoh3yvq83y489vq3n4yv8 8943rvyq3 vyq3yrvq'
  },

  didInsertElement: function() {
    try {
      const feedbackDiv = document.createElement('div');
      feedbackDiv.style.position = 'absolute';
      const textarea = this.$()[0];
      this.set('textarea', this.$()[0]);
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

      document.body.appendChild(feedbackDiv);

      this.set('feedbackDiv', feedbackDiv);
    }
    catch (e) {
      console.log('didInsert ' + e);
    }
  },

  keyUp: function(k) {
    const textArea = k.target;
    const text = textArea.value;
    this.set('text', text);
  },

  activeExpansionSite: Ember.computed('text', function() {

    const textarea = this.get('textarea');
    const cursorLoc = textarea.selectionStart;
    const subjects = textExpansion.findExpansionSubjects(text);
    const sites = textExpansion.findExpansionSites(text, subjects);

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

  feedbackText: Ember.computed('possibleSwaps', function() {
      const div = this.get('feedbackDiv');
      const possibleSwaps = this.get('possibleSwaps');

      if (possibleSwaps) {
          div.style.visibility = 'visible';
          if (possibleSwaps.length === 1) {
            const swapFrom = possibleSwaps[0];
            const swapTo = expansions[swapFrom];
            div.innerHTML = `Press Enter to replace '${activeSite.term}' with '${swapTo}'`;
          } else if (possibleSwaps.length > 1) {
            div.innerHTML = 'Possible expansions: ' + possibleSwaps.join(', ');
          }
          else {
            div.innerHTML = 'No expansion terms match ' + activeSite.term;
          }
          div.innerHTML += '   ' + JSON.stringify(activeSite);
      }
      else {
        div.style.visibility = 'hidden';
      }
    })
})
