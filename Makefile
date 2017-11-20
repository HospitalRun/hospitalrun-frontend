PATH       := node_modules/.bin:$(PATH)
SHELL      := /usr/bin/env bash
# ------------------------------------------------------------------------------

.PHONY: all
all: test build

.PHONY: clean
clean:
	@echo 'Nothing to do yet!'

.PHONY: test
test: install node_modules/phantomjs
	@./script/test

.PHONY: build
build: install
	@./script/build

.PHONY: server
server: install node_modules/ember-cli server/config.js
	@./script/server

server/config.js:
	@cp server/config-example.js $@

.PHONY: couchdb
couchdb:
	@./script/couchdb

# Starts couchdb and server in the same terminal in parallel
.PHONY: serve
serve:
	@$(MAKE) -j2 couchdb server

.PHONY: install
install: node_modules

node_modules: package.json
	@yarn install
	@touch $@

node_modules/%:
	@yarm install $*
