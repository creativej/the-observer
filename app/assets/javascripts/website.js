// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
//= require modules/dashboard
(function($, window, TheObserver) {
	'use strict';

	TheObserver.onPageReady('dashboard.website', function() {
		TheObserver.modules.dashboard($('.dashboard.gridster'));
	});
}(jQuery, window, TheObserver));
