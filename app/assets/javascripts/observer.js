(function($, window) {
	"use strict";

	window.Observer = function Application($) {
		var
			instance = {
				modules: {},
				helpers: {
					arrayRemove: function(arr, removeItem) {
						arr = $.grep(arr, function(value) {
							return value != removeItem;
						});
					},
					integer: function(value, octal) {
						return parseInt(value, octal || 10);
					},
					isCallable: function(value) {
						return typeof value === 'function';
					},
					isString: function(value) {
						return typeof value === 'string';
					},
					isNumber: function(value) {
						return typeof value === 'number';
					}
				},
				actions: {},
				mixins: {}
			}
			;

		instance = window.eventable(instance);

		function pageNamespace(name) {
			return name + '.' + instance.body().data('triggerjs');
		}

		if (window.ZeroClipboard) {
			window.ZeroClipboard.setDefaults({
				moviePath: '/assets/ZeroClipboard.swf'
			});
		}

		instance.body = function() {
			return $('#app_body');
		};

		instance.$spinner = function() {
			return $('.global-spinner .spinner-container');
		};

		instance.onPageReady = function(page, callback) {
			if (Array.isArray(page)) {
				page.forEach(function(p) {
					instance.on('ready.' + p ,callback);
				});
			} else {
				instance.on('ready.' + page ,callback);
			}
		};

		instance.onPageLoaded = function(page, callback) {
			if (Array.isArray(page)) {
				page.forEach(function(p) {
					instance.on('loaded.' + p ,callback);
				});
			} else {
				instance.on('loaded.' + page ,callback);
			}
		};

		instance.triggerPageReady = function(data) {
			return instance.trigger(pageNamespace('ready'), data);
		};

		instance.triggerPageLoaded = function(data) {
			return instance.trigger(pageNamespace('loaded'), data);
		};

		return instance;
	}($);
}(jQuery, window));
