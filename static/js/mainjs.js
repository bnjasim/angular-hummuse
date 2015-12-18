angular.module('hummuse-app', ['ui.bootstrap', 'hummuse.CollapseServiceModule',
                               'hummuse.LeftPanelModule', 'hummuse.RightPanelModule', 
                               'hummuse.MainPanelModule', 'hummuse.TimerModule',
                               'hummuse.DataContainerModule',
                               'ngAnimate', 'ngTouch', 'chart.js'])

// The buttons to collapse panels in th navigation top-fixed-nav-panel
.controller('NavigationCtrl', function (leftCollapseService, rightCollapseService) {
	
	this.isCollapsedLeft = true;
	this.isCollapsedRight = true;

	Object.defineProperty(this, 'isCollapsedLeft', {
		enumerable: true,
        configurable: false,
        get: function () {
            return leftCollapseService.getStatus();
        },
        set: function (val) {
			leftCollapseService.setStatus(val);
		}
	});

	Object.defineProperty(this, 'isCollapsedRight', {
		enumerable: true,
        configurable: false,
        get: function () {
            return rightCollapseService.getStatus();
        },
        set: function (val) {
			rightCollapseService.setStatus(val);
		}
	});

})

// common for both left panel and right panel
.controller('OverlayCtrl', function (leftCollapseService, rightCollapseService) {
	
	Object.defineProperty(this, 'isCollapsedLeft', {
		enumerable: true,
        configurable: false,
        get: function () {
            return leftCollapseService.getStatus();
        },
        set: function (val) {
			leftCollapseService.setStatus(val);
		}
	});	

	Object.defineProperty(this, 'isCollapsedRight', {
		enumerable: true,
        configurable: false,
        get: function () {
            return rightCollapseService.getStatus();
        },
        set: function (val) {
			rightCollapseService.setStatus(val);
		}
	});		
})


// This module has shared services which holds the state of collapsed panels
angular.module('hummuse.CollapseServiceModule', [])

.factory('leftCollapseService', function() {
	var isCollapsed = true;
	
	var getStatus =  function() {
		return isCollapsed;
	}

	var setStatus = function(val) {
		isCollapsed = val;	
	}
	
	return { getStatus:getStatus, setStatus:setStatus};
})

.factory('rightCollapseService', function() {
	var isCollapsed = true;
	
	var getStatus =  function() {
		return isCollapsed;
	}

	var setStatus = function(val) {
		isCollapsed = val;
	}
	
	return { getStatus:getStatus, setStatus:setStatus};
})



// All operations in the leftpanel
angular.module('hummuse.LeftPanelModule', [])
// dataContainerService is defined in hummuse-data.js file
.controller('LeftPanelCtrl', function (leftCollapseService, dataContainerService) {
	
	this.isCollapsed = true;

	Object.defineProperty(this, 'isCollapsed', {
		enumerable: true,
        configurable: false,
        get: function () {
            return leftCollapseService.getStatus();
        },
        set: function (val) {
			leftCollapseService.setStatus(val);
		}
	});			

	this.projects = {"Projects": []};
	var vm = this;
	// Init - ajax request for projects
	dataContainerService.makeProjectsRequest().then(function(response) {
			vm.projects = response;
			console.log(response);
		}, function(error) {
			console.log(error);
		});
	
	
	

})


// Right Panel Operations
angular.module('hummuse.RightPanelModule', [])

.controller('RightPanelCtrl', function ($scope, rightCollapseService) {
	
	Object.defineProperty(this, 'isCollapsed', {
		enumerable: true,
        configurable: false,
        get: function () {
            return rightCollapseService.getStatus();
        },
        set: function (val) {
			rightCollapseService.setStatus(val);
		}
	});		
})


// The Main (Centre) Panel Module
angular.module('hummuse.MainPanelModule', [])

.controller('MainPanelCtrl', function (leftCollapseService, rightCollapseService, dataContainerService) {

	this.touchMode = false;
	this.name = 'Binu Jasim';

	Object.defineProperty(this, 'touchMode', {
		enumerable: true,
        configurable: false,
        get: function () { // touchmode if one of the panels is not collapsed
            return (!rightCollapseService.getStatus() || !leftCollapseService.getStatus())
        },
        set: function (val) { // we have to set isTouchMode to false so that all panels collapse
			rightCollapseService.setStatus(true); //isCollapsed = true
			leftCollapseService.setStatus(true);  //isCollapsed = true
		}
	});		

	  this.labels = ["23", "24", "25", "26", "27", "28", "29"];
	  //this.series = ['Series A', 'Series B'];
	  this.hours = [
	    [4.5, 9, 8, 8, 5, 5, 4]
	    
	  ];
	  this.onClick = function (points, evt) {
	    console.log(points, evt);
	  };

	var vm = this;
	// Init - request for data
	dataContainerService.makeDataRequest().then(function(response) {
		vm.data = response;
		window.data = response;
		//console.log(response)
	}, function(error) {
		console.log(error);
	})	  

})
// A controller to tap into the scope of ng-repeat over projects
.controller('projectController', function($scope) {
	// manage the hours of work
	$scope.mytime = new Date();
	var h = $scope.p.hours;
	var hrs = Math.floor(h);
	var mins = Math.round((h-hrs)*60);
	// set the initial time from the json data
	$scope.mytime.setHours(hrs);
	$scope.mytime.setMinutes(mins);

	$scope.$watch('mytime', function() {
		$scope.p.hours = $scope.mytime.getHours() + $scope.mytime.getMinutes()/60;
	})

	// manage edit/focus
	$scope.edit_this_project = false;
	$scope.editThisProject = function(val) {
		$scope.edit_this_project = val;
	}

})

// ng-repeat day in data
.directive('oneDay', function() {
	return {
		restrict: 'E',
		replace: true,
		//require: '^ngController',
		scope: true,
    	templateUrl: "static/partials/oneday.html",
    	controller: ['$scope', function($scope) {
    		
    		console.log('a new scope created!');
    			
    		// Routines
    		$scope.edit_routines = false;
    		$scope.editRoutines = function(val) {
    			$scope.edit_routines = val;
    		}

    		// Notes
    		$scope.edit_notes = false;
    		$scope.editNotes = function(val) {
    			$scope.edit_notes = val;
    		}
    		//console.log($scope.day.routines.length);
    		// watching just 'day' doesn't work!
    		$scope.$watch('day.routines', function() {
    			//console.log('changed');
    			$scope.anyRoutinePresent = !!($scope.day.routines.length);	
    		})
    		$scope.$watch('day.projects', function() {
    			//console.log('changed');
    			$scope.anyProjectPresent = !!($scope.day.projects.length);	
    		})
    		$scope.$watch('day.general', function() {
    			//console.log('changed');
    			$scope.generalNotePresent = !!($scope.day.general);	// empty string in note area
    			//$scope.text_area_model = $scope.day.general; // not required, but maybe
    		})

    		$scope.saveData = function() {
    			//$scope.day.general = $scope.text_area_model;
    			$scope.isFocused = false;
    			$scope.focus_general = false;
    		}
    		/*$scope.cancelGeneral = function() {
    			//$scope.day.general = $scope.text_area_model;
    			$scope.isFocused = false;
    			$scope.focus_general = false;
    		}*/
    	}]
    }
})
// focus textarea - so automatically scroll down appropriately
.directive('hummuseFocus', function($timeout) {
	return {
		restrict: 'A',
    	link: function(scope, element, attrs) {
    		scope.$watch(attrs.hummuseFocus, function(focus) {

    			if (focus) {
    				$timeout(function(){element[0].focus()},0);
    			}
    		})
    	}
    }
})

.directive('hummuseTouch', function() {
	return {
		restrict: 'A',
		require: 'ngController',
    	link: function(scope, element, attrs, ctrl) {
    		
    		function handleStart(evt) {
  				evt.preventDefault();
  				//console.log("touchstart");
  				scope.$apply(function() {
  					ctrl.touchMode = false; // collapse all open panels, true/false doesn't matter
  				});	
  			}

    		scope.$watch(attrs.hummuseTouch, function(touchMode) {
    			//console.log('scope.touchMode: ' + ctrl.touchMode);
          		if (touchMode)
					// if touchMode is true, listen for touch events
					element[0].addEventListener("touchstart", handleStart, false);
				else // remove the event listener
					element[0].removeEventListener("touchstart", handleStart);	

          	});
    	}
    }
})
// converts 3.5 to 3h 30m
.filter('hoursminutes', function() {
  return function(input) {
    var h = Math.floor(input);
    var m = Math.round((input - h)*60);
    return h+'h '+m+'m';
  };
});
