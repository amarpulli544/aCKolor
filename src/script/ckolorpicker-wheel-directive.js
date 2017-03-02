(function(aCKolor) {
    /* MARKUP
     * <a-ckolor-wheel></a-ckolor-wheel>
     */
    aCKolor.directive('aCkolorWheel', function($timeout, $document, CKolorFactory, $window){
        return {
            restrict: 'E',
            templateUrl: '../html/ackolor-wheel.html',
            link: function(scope,elm){
                scope.CKolorFactory = CKolorFactory;

                /* DOM Definitions */
                var body = $document[0].body;
                var wheel = elm[0].querySelector('.c-ckolor__wheel-value');
                var scoop = elm[0].querySelector('.c-ckolor__wheel-scoop');
                var closeBtn = elm[0].querySelector('.c-ckolor__close-btn');
                var saveBtn = elm[0].querySelector('.c-ckolor__save-btn');
                var saturation = elm[0].querySelector('.c-ckolor__saturation');
                var saturationHandle = elm[0].querySelector('.c-ckolor__saturation-handle');
                var alpha = elm[0].querySelector('.c-ckolor__alpha');
                var alphaHandle = elm[0].querySelector('.c-ckolor__alpha-handle');
				var overlayInner = elm[0].querySelector('.c-ckolor__overlay-inner');
                var rect = null;
                var srect = null;
                var arect = null;
                /* End DOM Definitions */


                /* DOM Manipulations */
                /* Mouse movement on color wheel, update hue and lightness */

                var wheelMove = function(e){
					if(!wheel){
						wheel = elm[0].querySelector('.c-ckolor__wheel-value');
					}

					if(wheel){
						$timeout(function(){CKolorFactory.hueLightFromRadial(e, wheel);});
					}
                };

				scope.updateHueLightFromRadial = function(e){
					wheelMove(e);
				};

                /* Mouse movement on saturation slider, update saturation */
                var saturationMove = function(e){
                    var x = ((e.changedTouches) ? e.changedTouches[0].clientX : e.pageX) - (srect.left);
					var saturationValue = Math.round((x / srect.width) * 100);

					if(saturationValue < 0){
						saturationValue = 0;
					}else if(saturationValue > 100){
						saturationValue = 100;
					}
                    CKolorFactory.hsl.s = saturationValue;
                    $timeout(function(){
                        CKolorFactory.updateHSL();
                    });
                };

                /* On body-> mouseup, clear out mousemove/touchmove event listeners */
                var mouseUpped = function(e){
                    body.removeEventListener('mousemove', wheelMove, true);
                    body.removeEventListener('touchmove', wheelMove, true);
                    body.removeEventListener('mousemove', saturationMove, true);
                    body.removeEventListener('touchmove', saturationMove, true);
                };

                /* On mouse down, add mouse move and up listeners to detect dragging start/end */
                var wheelDown = function(e){
                    /* Color wheel dimensions */
                    rect = wheel.getBoundingClientRect();
                    /* Called to update colors if only a click */
                    wheelMove(e);
                    /* Add mouse move event listeners */
                    body.addEventListener('mousemove', wheelMove, true);
                    wheel.addEventListener('touchmove', wheelMove, false);
                };

                /* On mouse down, add mouse move and up listeners to detect dragging start/end */
                var saturationDown = function(e){
                    /* Saturation slider dimensions */
                    srect = saturation.getBoundingClientRect();
                    /* Called to update colors if only a click */
                    saturationMove(e);
                    /* Add mouse move event listeners */
                    body.addEventListener('mousemove', saturationMove, true);
                    saturation.addEventListener('touchmove', saturationMove, false);
                };

                wheel.addEventListener('mousedown', wheelDown, true);
                wheel.addEventListener('touchstart', wheelDown, true);

                saturation.addEventListener('mousedown', saturationDown, true);
                saturation.addEventListener('touchstart', saturationDown, false);

				body.addEventListener('mouseup', mouseUpped, true);
                body.addEventListener('touchend', mouseUpped, false);
                /* End DOM Manipulations */

                /* If HSL is updated and valid, trigeer the other color formats to be updated */
                scope.$watchCollection(function(){return CKolorFactory.hls;}, function(newVal, oldVal){
                    if(
                        newVal !== oldVal &&
                        !isNaN(newVal.h) && !isNaN(newVal.l) && !isNaN(newVal.s) &&
                        newVal.h >= 0 && newVal.h <= 360 &&
                        newVal.l >= 0 && newVal.l <= 255 &&
                        newVal.s >= 0 && newVal.s <= 255
                    ){
                        CKolorFactory.updateHSL();
                    }
                });
            }
        };
    });
})(angular.module('aCKolor'));
