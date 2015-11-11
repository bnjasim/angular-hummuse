angular.module('hummuse.DataContainerModule', [])

.factory('dataContainerService', function($http, $q) {
	var isProjectsAvailabe = false;
	var projects = [];

	// Ajax request processing or completed
	var getProjectsStatus =  function() {
		return isProjectsAvailabe;
	}

	// Ajax request finished or not
	var setProjectsStatus = function(val) {
		isProjectsAvailabe = val;	
	}

	// Make ajax reqeust for list of routines and projects
    function makeProjectsRequest() {
    	var request = $http({
        	method: "get",
        	url: "static/projects.json",
            params: {
                action: "get"
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }

    // Make ajax reqeust for data from date to to date (later!)
    function makeDataRequest() {
    	var request = $http({
        	method: "get",
        	url: "static/data.json",
            params: {
                action: "get"
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }


    // I transform the error response, unwrapping the application data from
	// the API response payload.
	function handleError( response ) {
		// The API response from the server should be returned in a
		// nomralized format. However, if the request was not handled by the
		// server (or what not handles properly - ex. server error), then we
		// may have to normalize it on our end, as best we can.
		if (! angular.isObject( response.data ) || ! response.data.message) {
	        return( $q.reject( "An unknown error occurred." ) );
	    }
        // Otherwise, use expected error message.
        return( $q.reject( response.data.message ) );
    }
                

	// I transform the successful response, unwrapping the application data
	// from the API response payload.
	function handleSuccess( response ) {
        return( response.data );
    }
	
	return { getProjectsStatus:getProjectsStatus, setProjectsStatus:setProjectsStatus,
			makeProjectsRequest:makeProjectsRequest, makeDataRequest:makeDataRequest};
})



