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
		console.log(response)
	}, function(error) {
		console.log(error);
	})	  

})

.directive('oneDay', function() {
	return {
		restrict: 'E',
		replace: true,
		require: '^ngController',
		scope: {day: '='},
    	templateUrl: "static/partials/oneday.html"
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
