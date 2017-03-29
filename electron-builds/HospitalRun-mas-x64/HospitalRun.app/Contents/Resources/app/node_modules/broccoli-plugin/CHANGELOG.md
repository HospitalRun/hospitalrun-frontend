# master

# 1.3.0

* Add `pluginInterface.needsCache` and expose as `options.needsCache`. This adds the ability
  to opt-out of cache directory creation.

# 1.2.3

* Avoid extra work in `.read`-compatibility mode when input nodes have stable output paths

# 1.2.2

* Whitelist JS files in package.json
* re-release without tmp/

# 1.2.1

* Throw error immediately when inputNodes contains something other than input nodes

# 1.2.0

* Add `sourceDirectories` feature flag, which introduces `pluginInterface.nodeType`
* Allow for calling `__broccoliGetInfo__()` without argument

# 1.1.0

* Add `persistentOutput` flag

# 1.0.0

* Initial release
