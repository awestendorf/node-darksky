SHELL = bash

test:
	jasmine-node --verbose spec/

check:
	jshint lib/*.js

docs:
	docco lib/*.js

.PHONY: test check docs
