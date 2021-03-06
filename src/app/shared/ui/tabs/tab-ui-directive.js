/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                     *
 * Copyright (C) 2015 Lukas Mayerhofer <lukas.mayerhofer@guh.guru>                     *
 *                                                                                     *
 * Permission is hereby granted, free of charge, to any person obtaining a copy        *
 * of this software and associated documentation files (the "Software"), to deal       *
 * in the Software without restriction, including without limitation the rights        *
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell           *
 * copies of the Software, and to permit persons to whom the Software is               *
 * furnished to do so, subject to the following conditions:                            *
 *                                                                                     *
 * The above copyright notice and this permission notice shall be included in all      *
 * copies or substantial portions of the Software.                                     *
 *                                                                                     *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR          *
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,            *
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE         *
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER              *
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,       *
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE       *
 * SOFTWARE.                                                                           *
 *                                                                                     *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
 
(function() {
  'use strict';

  angular
    .module('guh.ui')
    .directive('guhTab', guhTab);

    guhTab.$inject = [];

    function guhTab() {
      var directive = {
        link: tabLink,
        require: '^guhTabset',
        restrict: 'E',
        scope: {
          heading: '@'
        },
        // templateUrl: 'app/shared/ui/tabs/tab.html',
        // Template has to be used here because of the following "Bug": https://github.com/angular/angular.js/issues/8877
        // tl;dr: Because of async nature of templateUrl it can happen that tabsetLink is called before all tabs are added to the tabsetCtrl
        template: '<div ng-transclude class="tab" ng-show="active"></div>',
        // templateUrl: 'app/shared/ui/tabs/tab.html',
        transclude: true
      };

      return directive;


      function tabLink(scope, element, attrs, tabsetCtrl) {
        scope.active = false;
        tabsetCtrl.addTab(scope);
      }
    }

}());