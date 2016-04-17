import EmText from 'ember-rapid-forms/components/em-text';
import textExpansion from '../utils/text-expansion';

export default EmText.extend({
  expansions: {
    foo: 'bar',
    abc: 'aaabbbccc',
    q: 'uuu'
  },
  keyUp: function(k) {
    const textArea = k.target;
    const text = textArea.value;
    const cursorLoc = textArea.selectionStart;
    const subjects = textExpansion.findExpansionSubjects(text);
    const sites = textExpansion.findExpansionSites(text, subjects);

    const activeSite = sites.find(s => {
      const endIndex = s.index + s.subject.length;

      return cursorLoc >= s.index && cursorLoc <= endIndex;
    });

    console.log('activesite ' + JSON.stringify(activeSite));
  }
});
