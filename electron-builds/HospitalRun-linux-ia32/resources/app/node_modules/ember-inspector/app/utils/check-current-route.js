export default function(currentRouteName, routeName) {
  let regName, match;

  if (routeName === 'application') {
    return true;
  }

  regName = routeName.replace('.', '\\.');
  match = currentRouteName.match(new RegExp(`(^|\\.)${regName}(\\.|$)`));
  if (match && match[0].match(/^\.[^.]+$/)) {
    match = false;
  }
  return !!match;
}
