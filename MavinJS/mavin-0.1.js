/*******************************************************************************
 * File: mavin-0.1.js 
 * Authors: Eran Israeli, Dori Waldman 
 * License: GPLv3
 ******************************************************************************/
// var dependenciesList = [];
var dict = {};

// var dependency = [] ;

// var urlsToLoadInOrder = [dataTables,backbonejs,jqueryui];
// var urlsToLoadInOrder = [jqueryui];

$.holdReady(true);

// http://docs.jquery.com/Plugins/Authoring
(function($) {
	var methods = {
		init : function(options) {

			loadDependency("pom.xml");

			// need time out as i need to know when all ajax will end - TODO !!!
			window.setTimeout(loadScriptFromMap, 5000);

			jQuery.ajaxSetup({
				beforeSend : function() {
					// alert('Fetching dependencies...');
				},
				complete : function() {
					$('body').append('Done.');
				},
				success : function() {
				}
			});

			// Array of fileName to include in loader
			// ProcessDependency(0);
		}
	};

	$.fn.repo = function(method) {
		// Method calling logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(
					arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.tooltip');
		}
	};
})(jQuery);


function loadScriptFromMap() {
	// Get the size of an object
	for ( var key in dict) {
		if (dict.hasOwnProperty(key)) {
			alert("loading ..." + dict[key].url);
			loadJsFile(dict[key].url);
		}
	}
}


function loadDependency(pomFile) {

	// Load Page Model Object
	$.ajax({
		type : "GET",
		url : pomFile,
		contentType: 'text/plain',
		xhrFields: {
			withCredentials: false 
		},
		headers: {
			
		},
		
		cache : "false",
		
		//dataType : "xml",
		success : function(xml) {
			var url;
			var group;
			var artifact;
			var version;
			var minimized;
			var key;
			var value;
			$(xml).find("dependency").each(
					function() {
						group = $(this).find("groupId").text();
						artifact = $(this).find("artifactId").text();
						version = $(this).find("version").text();
						
						// The ECMAScript 6 .contains() method makes this check simpler (and more readable), 
						// but so far it's only implemented in Firefox ATM.
						if (version.contains("${")) {
						//if (version.indexOf("${") != -1 ) {						
							version = version.replace('${', '');
							version = version.replace('}', '');
							version = $(xml).find(version).text();
						}

						// key= group+"-"+artifact;

						// value = { version:version,
						// url:"https://mavinjs.appspot.com/repo/"+group+"/prod/"+artifact+"-"+version+".min.js"};
						// value =
						// version+","+"https://mavinjs.appspot.com/repo/"+group+"/prod/"+artifact+"-"+version+".min.js";
						// addToMap(key,value);
						/*
						 * minimized = $(this).find("minimized").text(); if
						 * (minimized=="true"){ url =
						 * "https://mavinjs.appspot.com/repo/"+group+"/prod/"+artifact+"-"+version+".min.js";
						 * }else{ url =
						 * "https://mavinjs.appspot.com/repo/"+group+"/dev/"+artifact+"-"+version+".js"; }
						 */

						loadDependency("https://mavinjs.appspot.com/repo/"
								+ group + "/prod/" + artifact + "-" + version
								+ ".pom.xml");

						// dependency.push(url);
					});
			group = $(xml).find("groupId:first").text();
			artifact = $(xml).find("artifactId:first").text();
			version = $(xml).find("version:first").text();
			url = "https://mavinjs.appspot.com/repo/" + group + "/prod/"
					+ artifact + "-" + version + ".min.js";

			key = group + "-" + artifact;
			value = {
				version : version,
				url : "https://mavinjs.appspot.com/repo/" + group + "/prod/"
						+ artifact + "-" + version + ".min.js"
			};
			addToMap(key, value);

			// dependency.push(url);
			// alert(url+" loading now ....");
			// loadJsFile(url);
			// clientID = $(xml).find("artifactId").text();
			// alert(clientID);
			// alert(dependency);
		}

	});
}


function addToMap(key, value) {
	var mapValue = dict[key];

	if (mapValue == null) {
		dict[key] = value;
	} else {
		// compare 1.8.2 with 2.0
		var ver = value.version; // 2.0
		var mapVer = mapValue.version; // 1.8.2
		var mapVerArrayLength = mapVer.toString().replace(/\./g, '').length;
		var versionArrayLength = ver.toString().replace(/\./g, '').length;
		var myLength;
		if (mapVerArrayLength < versionArrayLength) {
			myLength = mapVerArrayLength;
		} else {
			myLength = versionArrayLength;
		}
		for ( var i = 0; i < myLength; i++) {
			if (mapVer[i] < ver[i]) {
				// map version is old , need to replace
				dict[key] = value;
				break;
			}
		}
	}
}


function loadJsFile(url) {
	$.ajax({
		async : true,
		dataType : "script",
		url : url,
		// Enable caching for performance, disable with 'cache: false'
		cache : false
	});
}



function ProcessDependency(urlArrayPointer) {

	if (urlArrayPointer >= urlsToLoadInOrder.length) {
		$.holdReady(false);
		return;
	}

	var attemptedFile = urlsToLoadInOrder[urlArrayPointer];

	/* api.jquery.com/jQuery.ajax */
	$.ajax({
		async : false,
		dataType : "script",
		url : attemptedFile,
		// Enable caching for performance, disable with 'cache: false'
		cache : false,

		/*
		 * Can be used for HTTP access authentication username: admin, password:
		 * password,
		 */

		complete : function(jqXHR, textStatus) {
			switch (jqXHR.status) {
			case 200:
				$('body').append(
						'<font color="green"> Successfuly loaded <b>'
								+ attemptedFile + '</b></font><br>');
				urlArrayPointer++;
				ProcessDependency(urlArrayPointer);
				break;
			case 404:
				$('body').append(
						'<font color="red"> Failed to load <b>' + attemptedFile
								+ '</b></font><br>');
				break;
			default:
				alert("?");
			}
		},
	});
}