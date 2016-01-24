/**
 * Slide and swipe menu (https://github.com/JoanClaret/slide-and-swipe-menu)
 *
 * @copyright Copyright 2013-2015 Joan claret
 * @license   MIT
 * @author    Joan Claret Teruel <dpam23 at gmail dot com>
 *
 * Licensed under The MIT License (MIT).
 * Copyright (c) Joan Claret Teruel <dpam23 at gmail dot com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


;(function($, document, window, undefined) {

    'use strict';

    var slideAndSwipe = 

        $.fn.slideAndSwipe = function(options) {

            var nav = $(this); // get the element to swipe
            var navWidth = -nav.outerWidth();
            var transInitial = navWidth;

            // get settings
            var settings = $.extend({
                triggerOnTouchEnd   : true,
                swipeStatus         : swipeStatus,
                allowPageScroll     : 'vertical',
                threshold           : 100,
                excludedElements    : 'label, button, input, select, textarea, .noSwipe',
                speed               : 250,
                visibilityBehaviour : {
                    ariaHidden: true,
                    className:  null
                }

            }, options );

            nav.swipe(settings);

            /**
             * Catch each phase of the swipe.
             * move : we drag the navigation
             * cancel : open navigation 
             * end : close navigation
             */
            function swipeStatus(event, phase, direction, distance) {
                var target = nav;

                if(phase == 'start') {
                    if(nav.hasClass('ssm-nav-visible')) {
                        transInitial = 0;
                    } else {
                        transInitial = navWidth;
                    }
                }
                var mDistance;
                
                if (phase == 'move' && (direction == 'left')) {
                    if(transInitial < 0) {
                        
                        mDistance = transInitial - distance;
                    } else {
                        mDistance = -distance;
                    }

                    scrollNav(target, mDistance, 0);

                } else if (phase == 'move' && direction == 'right') {
                    if(transInitial < 0) {
                        mDistance = transInitial + distance;
                    } else {
                        mDistance = distance;
                    }
                    scrollNav(target, mDistance, 0);
                } else if (phase == 'cancel' && (direction == 'left') && transInitial === 0) {
                    scrollNav(target, 0, settings.speed);
                } else if (phase == 'end' && (direction == 'left')) {
                        
                       hideNavigation(target);
                } else if ((phase == 'end' || phase == 'cancel') && (direction == 'right')) {
                    console.log('end');
                }
            }

            /**
             * Browser detect
             */
            function isSafari() {
                return /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
            }

            function isChrome() {
                return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
            }

            /**
             * Manually update the position of the nav on drag
             */
            function scrollNav(target, distance, duration) {
                target.css('transition-duration', (duration / 1000).toFixed(1) + 's');

                if(distance >= 0) {
                    distance = 0;
                }
                if(distance <= navWidth) {
                    distance = navWidth;
                }
                if(isSafari() || isChrome()) {
                   target.css('-webkit-transform', 'translate(' + distance + 'px,0)');
                }
                else{
                   target.css('transform', 'translate(' + distance + 'px,0)');
                }
                if(distance == '0') {
                    target.addClass('ssm-nav-visible');
                    if (settings.visibilityBehaviour.ariaHidden) {
                        target.attr('aria-hidden', 'false');
                    }
                    $('html').css('overflow','hidden');
                    $('.ssm-overlay').fadeIn();
                }
            }

            /**
             * Open / close by click on burger icon
             */
            var hideNavigation = (function(target) {
                target.removeClass('ssm-nav-visible');
                if (settings.visibilityBehaviour.ariaHidden) {
                    target.attr('aria-hidden', 'true');
                }
                scrollNav(target, navWidth, settings.speed);
                $('html').css('overflow','visible');
                $('.ssm-overlay').fadeOut();
            });

            var showNavigation = (function(target) {
                target.addClass('ssm-nav-visible');
                if (settings.visibilityBehaviour.ariaHidden) {
                    target.prop('aria-hidden', 'false');
                }
                scrollNav(target, 0, settings.speed);       
            });

            $('[data-ssm-open-nav]').each(function(){
                // Acquire target
                var target = $($(this).attr('data-ssm-open-nav'));

                $(this).click(function(e){
                    var visibility = null;
                    if (settings.visibilityBehaviour.ariaHidden) {
                        visibility = target.attr('aria-hidden') != 'true';
                    }
                    else {
                        visibility = target.hasClass('ssm-nav-visible');
                    }
                    if (visibility) {
                        hideNavigation(target);
                    }
                    else{
                        showNavigation(target);
                    }
                });

                hideNavigation(target);
            });
        }
    ;
})(window.jQuery || window.$, document, window);



/*
 * Export as a CommonJS module
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = slideAndSwipe;
}