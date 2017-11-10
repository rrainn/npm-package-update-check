#!/usr/bin/env node
'use strict';
const path = require('path');
const latestVersion = require('latest-version');

if (keyword == "-v" || keyword == "--version" || keyword == "version") {
	const mypackagejson = require('./package.json');
	console.log("v" + mypackagejson.version);
	process.exit();
}

try {
	require(path.join(process.cwd(), 'package.json'));
} catch (e) {
	console.error("Can't find package.json file.");
	process.exit(1);
}
const pjson = require(path.join(process.cwd(), 'package.json'));

let dependencyKeys = Object.keys(pjson.dependencies).concat(Object.keys(pjson.devDependencies));
let dependencyValues = Object.values(pjson.dependencies).concat(Object.values(pjson.devDependencies));
dependencyKeys.forEach((dependencyKey, index) => {
	latestVersion(dependencyKey).then(version => {
		if (version != dependencyValues[index]) {
			console.log(dependencyKey + " - " + version);
		}
	});
});

process.exit();
