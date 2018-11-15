export default function jquerySelect(selector) {
  let selected = $(selector);
  switch (selected.length) {
    case 0:
      console.error(`Unable to find selection for ${  selector}`);
      return null;
    case 1:
      return selected.get(0);
    default:
      return selected.toArray();
  }
}
