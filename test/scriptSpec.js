describe('MainPanelModule', function() {
  beforeEach(module('hummuse.MainPanelModule'));

  var $controller;

  
  describe('MainPanelCtrl', function() {
    var lcs, rcs;
    beforeEach(module(function($provide){
        
        $provide.service('leftCollapseService', function(){
          this.getStatus= function(){return true};
          this.setStatus = angular.noob;
        });

        $provide.service('rightCollapseService', function(){
          this.getStatus= function(){return false};
          this.setStatus = angular.noob;
        });
      }));

    beforeEach(inject(function(leftCollapseService, rightCollapseService){
      lcs = leftCollapseService;
      rcs = rightCollapseService;
    }));

    beforeEach(inject(function(_$controller_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
    }));

    it('Initial Touch mode is false', function() {
      var $scope = {};
      var controller = $controller('MainPanelCtrl', { $scope: $scope, leftCollapseService:lcs, rightCollapseService:rcs });
      
      expect(controller.touchMode).toBe(false);
    });
    
  });

});
