export default function jquerySelect(selector) {
  let selected = $(selector);
  switch (selected.length) {
    case 0:
      console.error("Nothing selected for " + selector);
      return null;
    case 1:
      return selected.get(0);
    default:
      return selected.toArray();
  }
}

export let jqueryLength = selector => $(selector).length