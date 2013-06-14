//= require actions/remove_widget_from_dashboard
(function($, window, Observer, undefined) {
	'use strict';

	var $removeWidgetBtn = $('<div />');
	$removeWidgetBtn
		.addClass('dashboard-widget-remove')
		.append('<i class="icon-cross"></i>')
		;

	Observer.modules.dashboardWidget = function($el) {
		var
			instance = window.eventable({
				isLoaded: false
			}),
			$iframe = $el.find('iframe')
			;

		$el.on('mouseover', function() {
			instance.removeBtn();
			$el.append($removeWidgetBtn);

			$removeWidgetBtn.on('click', function() {
				var $widget = $removeWidgetBtn.closest('.gs_w');
				console.log($widget.data('remove-url'));
				Observer.actions.removeWidgetFromDashboard(
					$widget.data('remove-url'),
					$widget.data('id')
				).done(function() {
					instance.trigger('removed', $widget[0]);
				});
			});
		});

		$el.on('mouseout', function(e) {
			if (!$(e.relatedTarget).closest('.gs_w').length) {
				instance.removeBtn();
			}
		});

		instance.removeBtn = function() {
			$removeWidgetBtn.remove();
			$removeWidgetBtn.off();
		};

		instance.load = function() {
			$iframe.prop('src', $el.data('url'));
			$iframe.on('load', function() {
				instance.isLoaded = true;
				instance.trigger('loaded');
			});
		}

		return instance;
	};

}(jQuery, window, Observer));
