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

let packagesPromises = [];

dependencyKeys.forEach((dependencyKey, index) => {
	packagesPromises.push(new Promise(function(resolve, reject) {
		let myIndex = index;
		latestVersion(dependencyKey).then(version => {
			if (version != dependencyValues[myIndex] && !dependencyValues[myIndex].includes("github:") && !dependencyValues[myIndex].includes("/")) {
				resolve({package: dependencyKey, version: version});
			}
			resolve(null);
		});
	}));
});

async function handleVersions() {
	let updates = await Promise.all(packagesPromises);
	dependencyKeys.forEach((key, index) => {
		let thePackage = updates.find((mypackage) => (mypackage || {package: ""}).package == key);
		if (thePackage) {
			console.log(thePackage.package + " - v" + thePackage.version);
		}
	});
}
handleVersions();

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