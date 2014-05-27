
# Put local npm installed scripts to path
export PATH := node_modules/.bin:$(PATH)

all:
	browserify -t hamlify index.js > index-bundle.js
