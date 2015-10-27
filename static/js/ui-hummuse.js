/*
 * hummuse-ui-bootstrap
 * http://hummuse.com

 * Custom made Directives for the Hummuse Application
 * Date: 19-Oct-2015
 * License: MIT
 */
angular.module("ui.hummuse", ["hum.side.collapse"]);


// Redefine ui.bootstrap.collapse to sideways collapse
angular.module('hum.side.collapse', [])
.directive('uihCollapse', ['$animate', '$injector', function($animate, $injector) {
    var $animateCss = $injector.has('$animateCss') ? $injector.get('$animateCss') : null;
    return {
      link: function(scope, element, attrs) {
        function expand() {
          console.log('expand called');
          element.removeClass('collapse')
            .addClass('hsliding')
            .attr('aria-expanded', true)
            .attr('aria-hidden', false);

          if ($animateCss) {
            console.log('$animateCss exists');
            console.log(element[0].scrollWidth);
            $animateCss(element, {
              addClass: 'in',
              easing: 'ease',
              to: { width: 200 + 'px' },
              duration: 1
            }).start().finally(expandDone);
          } else {
            $animate.addClass(element, 'in', {
              to: { width: element[0].scrollWidth + 'px' }
            }).then(expandDone);
          }
        }

        function expandDone() {
          console.log('expandDone');
          element.removeClass('hsliding')
            .addClass('collapse')
            .css({width: 'auto'});          
        }

        function collapse() {
          console.log('collapse called');
          if (!element.hasClass('collapse') && !element.hasClass('in')) {
            return collapseDone();
          }

          element
            // IMPORTANT: The width must be set before adding "hsliding" class.
            // Otherwise, the browser attempts to animate from width 0 (in
            // collapsing class) to the given width here.
            .css({width: element[0].scrollWidth + 'px'})
            // initially all panel collapse have the collapse class, this removal
            // prevents the animation from jumping to collapsed state
            .removeClass('collapse')
            .addClass('hsliding')
            .attr('aria-expanded', false)
            .attr('aria-hidden', true);

          if ($animateCss) {
            $animateCss(element, {
              removeClass: 'in',
              to: {width: '0'},
              duration: 2,
              delay: 2
            }).start().finally(collapseDone);
          } else {
            $animate.removeClass(element, 'in', {
              to: {width: '0'}
            }).then(collapseDone);
          }
        }

        function collapseDone() {
          element.css({width: '0'}); // Required so that collapse works when animation is disabled
          element.removeClass('hsliding')
            .addClass('collapse');
          console.log('collapseDone');  
        }
        console.log('Linking is OK');
        scope.$watch(attrs.uihCollapse, function(shouldCollapse) {
          if (shouldCollapse) {
            collapse();
          } else {
            expand();
          }
        });
      }
    };
  }]);
