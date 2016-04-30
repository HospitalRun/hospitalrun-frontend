import Ember from 'ember';
import textExpansion from '../utils/text-expansion';

export default Ember.Component.extend({

  store: Ember.inject.service(),

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

      this.get('store')
        .findAll('text-expansion')
        .then((expansions) => {
          return expansions.reduce((prev, curr) => {
            console.log('curr ' + JSON.stringify(prev));
            prev[curr.get('from')] = curr.get('to');
            return prev;
          }, {});
        })
        .then((expansions) => {
          this.set('expansions', expansions);
        });

    } catch (e) {
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
    if (!textarea) {
      return null;
    }
    const cursorLoc = textarea.selectionStart;
    const subjects = textExpansion.findExpansionSubjects(userText);
    const sites = textExpansion.findExpansionSites(userText, subjects);

    return sites.find((s) => {
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
        .filter((ex) => {
          return ex.startsWith(activeSite.term);
        })
        .sort()
        .map((from) => {
          return {
            from: from,
            to: expansions[from]
          };
        });
    }
  }),

  expansionText: Ember.computed('possibleSwaps', 'activeExpansionSite', 'userText', function() {
    var result = '';

    const possibleSwaps = this.get('possibleSwaps');
    if (possibleSwaps) {
      const activeSite = this.get('activeExpansionSite');

      if (possibleSwaps.length === 1) {
        const swapTo = possibleSwaps[0].to;
        result = `Press Enter to replace '${activeSite.term}' with '${swapTo}'`;
      } else if (possibleSwaps.length > 1) {
        result =
          'Possible expansions: ' +
          possibleSwaps
          .map((swap) => {
            return swap.from;
          }).join(', ');
      } else {
        result = `No expansion terms match '${activeSite.term}'`;
      }
    }

    return result;
  }),

  expansionDivStyle: Ember.computed('expansionText', function() {
    const expansionText = this.get('expansionText');
    const visiblility = expansionText ? 'visible' : 'hidden';
    const textArea = this.get('textarea');

    var styleString = `visibility: ${visiblility};`;

    if (textArea) {
      const textPos = textArea.getBoundingClientRect();
      styleString += ` top: ${textPos.bottom}px; left: ${textPos.left}px; width: ${textArea.offsetWidth}px;`;
    }
    return new Ember.Handlebars.SafeString(styleString);
  })
});
