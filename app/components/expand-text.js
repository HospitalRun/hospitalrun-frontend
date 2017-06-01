import Ember from 'ember';
import textExpansion from '../utils/text-expansion';

const {
  Component,
  String: {
    htmlSafe
  },
  computed,
  inject
} = Ember;

export default Component.extend({
  i18n: inject.service(),
  store: inject.service(),

  userText: '',

  didInsertElement() {

    let feedbackDiv = document.createElement('div');
    feedbackDiv.style.position = 'absolute';
    let [textarea] = this.$('textarea');
    this.set('textarea', textarea);
    let textPos = textarea.getBoundingClientRect();
    let fbStyle = feedbackDiv.style;
    fbStyle.top = `${textPos.bottom}px`;
    fbStyle.left = `${textPos.left}px`;
    fbStyle.width = `${textarea.offsetWidth}px`;
    // THIS CODE NEEDS TO BE CHANGED -- INLINE STYLES ARE EVIL!
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
          prev[curr.get('from')] = curr.get('to');
          return prev;
        }, {});
      })
      .then((expansions) => {
        this.set('expansions', expansions);
      });

  },

  keyUp(k) {
    let textArea = k.target;
    let text = textArea.value;
    this.set('userText', text);
    this.set('cursorLocation', textArea.selectionStart);
  },

  keyDown(k) {
    if (k.keyCode === 13) {
      let possibleSwaps = this.get('possibleSwaps');
      if (possibleSwaps && possibleSwaps.length === 1) {
        let swapTo = possibleSwaps[0].to;
        let activeSite = this.get('activeExpansionSite');
        let sliceLength = activeSite.match.length;
        let currentText = k.target.value;
        let modifiedText = currentText.slice(0, activeSite.index) + swapTo + currentText.slice(activeSite.index + sliceLength);
        k.target.value = modifiedText;

        k.preventDefault();
        k.returnValue = false;
        k.cancelBubble = true;
        return false;
      }
    }
  },

  // Find an expandable word that has the cursor within it
  activeExpansionSite: computed('userText', 'cursorLocation', function() {

    let userText = this.get('userText');
    let textarea = this.get('textarea');
    if (!textarea) {
      return null;
    }
    let cursorLoc = textarea.selectionStart;
    let subjects = textExpansion.findExpansionSubjects(userText);
    let sites = textExpansion.findExpansionSites(userText, subjects);

    return sites.find((s) => {
      let endIndex = s.index + s.match.length;

      return cursorLoc >= s.index && cursorLoc <= endIndex;
    });
  }),

  // If an expansion site is active, which possible swaps could occur there?
  possibleSwaps: computed('activeExpansionSite', 'expansions', function() {
    let activeSite = this.get('activeExpansionSite');

    if (activeSite) {
      let expansions = this.get('expansions');
      return Object.keys(expansions)
        .filter((ex) => {
          return ex.startsWith(activeSite.term);
        })
        .sort()
        .map((from) => {
          return {
            from,
            to: expansions[from]
          };
        });
    }
  }),

  expansionText: computed('possibleSwaps', 'activeExpansionSite', 'userText', function() {
    let result = '';

    let i18n = this.get('i18n');
    let possibleSwaps = this.get('possibleSwaps');
    if (possibleSwaps) {
      let activeSite = this.get('activeExpansionSite');

      if (possibleSwaps.length === 1) {
        let swapTo = possibleSwaps[0].to;
        result = i18n.t('admin.textReplacements.performExpand', { from: activeSite.term, to: swapTo });
      } else if (possibleSwaps.length > 1) {
        let possible = possibleSwaps
          .map((swap) => {
            return swap.from;
          }).join(', ');
        result = i18n.t('admin.textReplacements.possibleExpansions', { possible });
      } else {
        result = i18n.t('admin.textReplacements.noMatches', { term: activeSite.term });
      }
    }

    return result;
  }),

  expansionDivStyle: computed('expansionText', function() {
    let expansionText = this.get('expansionText');
    let visiblility = expansionText ? 'visible' : 'hidden';
    let textArea = this.get('textarea');

    let styleString = `visibility: ${visiblility};`;

    if (textArea) {
      let textPos = textArea.getBoundingClientRect();
      styleString += ` top: ${textPos.bottom}px; left: ${textPos.left}px; width: ${textArea.offsetWidth}px;`;
    }
    return htmlSafe(styleString);
  })
});
