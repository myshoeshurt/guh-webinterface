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
    .directive('guhMorphModal', guhMorphModal);

    guhMorphModal.$inject = ['libs', '$log', '$rootScope', '$compile', '$controller', '$timeout', '$animate'];

    function guhMorphModal(libs, $log, $rootScope, $compile, $controller, $timeout, $animate) {

      var directive = {
        bindToController: {},
        controller: morphModalCtrl,
        controllerAs: 'morphModal',
        link: morphModalLink,
        restrict: 'E',
        scope: {}
      };

      return directive;


      function morphModalCtrl($scope, $element, $attrs) {
        /* jshint validthis: true */
        var vm = this;

        vm.modals = null;

        function enter(modalElement, modalDialogElement) {
          $animate
            .enter(modalDialogElement, modalElement)
            .then(function() {
              $log.log('MODALDIALOG ENTERED');
            });
        }

        function leave(modalElement, modalDialogElement, modal) {
          $animate
            .leave(modalDialogElement)
            .then(function() {
              modal.scope.$destroy();
              delete vm.modals[modal.id];

              $log.log('vm.modals', vm.modals);

              // If last modal was closed
              if(libs._.isEmpty(vm.modals)) {
                vm.modals = null;
              }

              $log.log('vm.modals', vm.modals);

              $animate.leave(modalElement);
            });
        }

        function moveBackground(modalElement, modalDialogElement) {
          return $animate.addClass(modalDialogElement, 'modal__dialog_inactive');
        }

        function moveForeground(modalElement, modalDialogElement) {
          return $animate.removeClass(modalDialogElement, 'modal__dialog_inactive');
        }


        /*
         * Events
         */

        $rootScope.$on('modals.open', function(event, modal) {
          // Currently only 2 Modals allowed to be open at the same time (because modal move animations have to be made dynamically)
          if(vm.modals && Object.keys(vm.modals).length === 2) {
            $log.error('guh.ui.directive:guhMorphModal', 'Maximum open modals reached. Only 2 modals are allowed to be open at the same time.');
            return;
          }

          if(!vm.modals) {
            vm.modals = {};
          }

          vm.modals[modal.id] = modal;

          var children = $element.children();
          var modalCtrl = $controller(modal.controller, { modalInstance: modal, $scope: modal.scope });
          var modalElement = (children.length === 0) ? angular.element('<div class="modal modal_background"></div>') : angular.element('<div class="modal"></div>');
          var modalDialogContent = modal.template === '' ? '<div>The passed template is empty.</div>' : modal.template;
          var modalDialogElement = angular.element('<div class="modal__dialog modal__dialog_' + modal.id + '">' +
                                                      modalDialogContent + 
                                                    '</div>');
          
          $compile(modalDialogElement)(modal.scope);

          if(children.length > 0) {
            $animate
              .enter(modalElement, $element, children[children.length - 1])
              .then(function() {
                for(var i = 0; i < children.length; i++) {
                  var childModalElement = children[i];
                  var childModalDialogElement = childModalElement.querySelector('.modal__dialog');

                  moveBackground(childModalElement, childModalDialogElement, children);
                }
                enter(modalElement, modalDialogElement);
              });
          } else {
            $animate
              .enter(modalElement, $element)
              .then(function() {
                enter(modalElement, modalDialogElement);
              });
          }

          if(modal.controllerAs){
            modal.scope[modal.controllerAs] = modalCtrl;
          }
        });

        $rootScope.$on('modals.close', function(event, modal) {
          var children = $element.children();
          var modalDialogElement = $element[0].querySelector('.modal__dialog_' + modal.id);
          var modalElement = angular.element(modalDialogElement).parent();


          if(children.length > 0) {
            $animate
              .leave(modalDialogElement)
              .then(function() {
                leave(modalElement, modalDialogElement, modal);
              });

            for(var i = 0; i < children.length; i++) {
              var childModalElement = children[i];
              var childModalDialogElement = childModalElement.querySelector('.modal__dialog');
            
              moveForeground(childModalElement, childModalDialogElement);
            }
          } else {
            $animate
              .leave(modalDialogElement)
              .then(function() {
                leave(modalElement, modalDialogElement, modal);
              });
          }
        });
      }
      

      function morphModalLink(scope, element, attrs, morphModalCtrl) {
        $log.log('morphModalLink');
      }

    }

}());