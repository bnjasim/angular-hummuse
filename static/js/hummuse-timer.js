// Stand-alone module for timer
angular.module('hummuse.TimerModule', [])

.directive('hummuseTimer', function() {
	return {
		restrict: 'E',
		scope: {},

		controller: ['$scope', '$interval', '$window', function($scope, $interval, $window) {
			$scope.time = '--:--';
			$scope.isTimerActive = false; // stop-button red
			$scope.isTimerRunning = false; 
			var hours = 0;
			var minutes = 0;
			var timerId = undefined;

			var formatTime = function() {
				var h=0, m=0;
	    		(minutes<10) ? m = '0'+minutes: m = ''+minutes;
				(hours<10) ? h = '0'+hours : h = ''+hours;
				return (h+':'+m);	
			}

			var incrementTime = function() {
				minutes += 1;
				if (minutes >= 60){
					hours += 1;
					minutes = 0;
				}
				$scope.time = formatTime();
			}		

			$scope.$watch('isTimerRunning', function(running) {
				if(running) {
					//console.log('Timer Started!');
					$window.localStorage.setItem('startTime', new Date().getTime());
					$window.localStorage.setItem('isTimerRunning', true);

					hours = parseInt($window.localStorage.getItem('totalHours'), 10) || 0;
					minutes = parseInt($window.localStorage.getItem('totalMinutes'), 10) || 0;
					
					$scope.time = formatTime();
					timerId = $interval(incrementTime, 1000);
				}
				else {
					//console.log('Timer Stopped!');
					$interval.cancel(timerId);
					$window.localStorage.setItem('totalHours', hours);
					$window.localStorage.setItem('totalMinutes', minutes);
					$window.localStorage.setItem('isTimerRunning', false);
				}
			});

			$scope.$watch('isTimerActive', function(active) {
				if (!active) {
					$scope.time = '--:--';
					hours = minutes = 0;
					$window.localStorage.setItem('isTimerActive', false);
				}
				else
					$window.localStorage.setItem('isTimerActive', true);
			});

			// Browser refresh or window closed and opened (session expired!)
			if ($window.localStorage.getItem('isTimerActive') !== 'true') {
				// either timer was stopped when browser crashed or localstorage is empty
				$window.localStorage.setItem('totalHours', 0);
				$window.localStorage.setItem('totalMinutes', 0);
			}
			else {
				$scope.isTimerActive = true;
				if ($window.localStorage.getItem('isTimerRunning') !== 'true') {
					// Timer was paused when browser crashed
					hours = parseInt($window.localStorage.getItem('totalHours'), 10) || 0;
					minutes = parseInt($window.localStorage.getItem('totalMinutes'), 10) || 0;
					$scope.time = formatTime();
				}
				else {
					// Timer was running when browser crashed or closed
					var elapsed_time = (new Date().getTime() - parseInt($window.localStorage.getItem('startTime'), 10))/1000;
					var elapsed_h = Math.floor(elapsed_time/60);
					var elapsed_m = Math.round((elapsed_time - elapsed_h*60)/1);
					var temp_h = elapsed_h + parseInt($window.localStorage.getItem('totalHours'), 10);
					var temp_m = elapsed_m + parseInt($window.localStorage.getItem('totalMinutes'), 10);
					$window.localStorage.setItem('totalHours', temp_h);
					$window.localStorage.setItem('totalMinutes', temp_m);

					$scope.isTimerRunning = true; // the formatTime() will be taken care by the $watch
				}
			}

		}],

		templateUrl: '/static/partials/timer.html'

	}
})	

.directive('hummuseTimerPlayButton', function() {
	return {
		restrict: 'E',
		replace: true,
		require: '^hummuseTimer',
		scope: false,

		link: function(scope, element, attr, ctrl) {
			element.on('click', function(evt) {
				scope.$apply(scope.isTimerActive = true); // stop button activates
				scope.$apply(scope.isTimerRunning = !scope.isTimerRunning);
			})
		},

		template: '<div id="play-pause-timer" class="theme-color">'
        		  +	'<div class="glyphicon" ng-class="{\'glyphicon-pause\': isTimerRunning, \'glyphicon-play\': !isTimerRunning}""></div> </div>'
	}
})

.directive('hummuseTimerStopButton', function() {
	return {
		restrict: 'E',
		replace: true,
		require: '^hummuseTimer',
		scope: false,

		link: function(scope, element, attr, ctrl) {
			//ctrl.isTimerActive is undefined coz link comes before controller
			element.on('click', function() {
				scope.$apply(scope.isTimerActive = false);
				scope.$apply(scope.isTimerRunning = false);
			})			
		},

		template: '<div id="stop-timer" ng-class="{\'stop-timer-active\': isTimerActive}">'
				  +	'<div class="glyphicon glyphicon-stop"> </div></div>'
        		  
	}
})
