#!/usr/bin/env node
'use strict';
const path = require('path');
const latestVersion = require('latest-version');

const argvs = process.argv;
const parsedParams = allElementsAfter("versioncheck", argvs); // ex. ['versioncheck', '-v']
const keyword = parsedParams[1]; // ex. '-v'

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
			console.log(dependencyKey + " - v" + version);
		}
	});
});



function allElementsAfter(keyword, array) {
	let pastValue = false;
	let newArray = [];
	array.forEach(function (element) {
		if (element.includes(keyword)) {
			pastValue = true;
		}
		if (pastValue) {
			newArray.push(element);
		}
	});
	return newArray;
}