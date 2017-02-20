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
    .module('guh.components')
    .controller('ParamTypeCtrl', ParamTypeCtrl);

  ParamTypeCtrl.$inject = ['app', '$log', '$scope', '$element', 'DSState'];

  /**
   * @ngdoc controller
   * @name guh.components.controller:ParamTypeCtrl
   * @description Presentational component for a single param.
   *
   */
  function ParamTypeCtrl(app, $log,$scope,  $element, DSState) {
    
    var vm = this;

    vm.$onInit = $onInit;
    vm.$onChanges = $onChanges;

    vm.setParam = setParam;


    function $onInit() {
      $element.addClass('ParamType');

      var check = _checkProps();

      if(check) {
        vm.component = _getParamComponent(
          // Parent controllers
          {
            paramTypeListCtrl: vm.paramTypeListCtrl,
            actionCtrl: vm.actionCtrl
          },
          // ParamType
          vm.paramType
        );
      }
    }

    function $onChanges(changesObj) {
      if(angular.isDefined(changesObj.paramType) && angular.isDefined(changesObj.paramType.currentValue)) {
        vm.component = _getParamComponent(
          // Parent controllers
          {
            paramTypeListCtrl: vm.paramTypeListCtrl,
            actionCtrl: vm.actionCtrl
          },
          // ParenType
          changesObj.paramType.currentValue
        );
      }
    }


    function _checkProps() {
      if(angular.isUndefined(vm.paramType)) {
        $log.error('guh.components.controller:ParamTypeCtrl', 'Missing property: paramType');
        return false;
      }

      return true;
    }

    function _getParamComponent(parentControllers, paramType) {
      var component;

      // Check parent controllers to know how the param should be displayed (which component to use)
      if(parentControllers.paramTypeListCtrl) {
        component = _getDefaultParamComponent(paramType);  
      } else if(parentControllers.actionCtrl) {
        component = _getActionParamComponent(parentControllers.actionCtrl, paramType);
      }

      return component;
    }

    function _getDefaultParamComponent(paramType) {
      var component = {
        selector: '',
        bindings: {
          name: paramType.name ? paramType.name : undefined,
          required: angular.isDefined(paramType.defaultValue) ? false : true,
          value: angular.isDefined(paramType.defaultValue) ? paramType.defaultValue : undefined
        }
      };

      // See following link for more info: http://dev.guh.guru/paramtypes-ui-elements.html
      if(angular.isDefined(paramType.type)) {
        switch(paramType.type) {
          case app.basicTypes.bool:
            component.selector = 'guh-checkbox';
            component.bindings.label = paramType.name;
            component.bindings.required = false;
            break;
          case app.basicTypes.string:
            if(angular.isDefined(paramType.inputType)) {
              if(paramType.inputType === app.inputTypes.textArea) {
                component.selector = 'guh-text-area';
                component.bindings.label = paramType.name;
              } else {
                component.selector = 'guh-text-input';
                component.bindings.label = paramType.name;
                component.bindings.type = paramType.inputType;
                component.bindings.unit = paramType.unit;
              }
            } else if(angular.isDefined(paramType.allowedValues)) {
              component.selector = 'guh-select';
              component.bindings.label = paramType.name;
              component.bindings.options = paramType.allowedValues;
            } else if(angular.isDefined(paramType.possibleValues)) {
              component.selector = 'guh-select';
              component.bindings.label = paramType.name;
              component.bindings.options = paramType.possibleValues;
            } else {
              component.selector = 'guh-text-input';
              component.bindings.label = paramType.name;
              component.bindings.unit = paramType.unit;
            }
            break;
          case app.basicTypes.time:
            component = 'guh-time';
            component.bindings.required = false;
            break;
          case app.basicTypes.int:
          case app.basicTypes.unsignedInt:
          case app.basicTypes.double:
            if(angular.isDefined(paramType.unit) && paramType.unit === 'UnitUnixTime') {
              component.selector = 'guh-date-time';
              component.bindings.required = false;
            } else {
              if(angular.isDefined(paramType.minValue) && angular.isDefined(paramType.maxValue)) {
                component.selector = 'guh-slider';
                component.bindings.minValue = paramType.minValue;
                component.bindings.maxValue = paramType.maxValue;
                component.bindings.label = paramType.name;
                component.bindings.required = false;
              } else {
                component.selector = 'guh-text-input';
                component.bindings.label = paramType.name;
                component.bindings.type = paramType.type;
                component.bindings.unit = paramType.unit;
              }
            }
            break;
          case app.basicTypes.color:
            component.selector = 'guh-color';
            component.bindings.required = false;
            break;
        }
      } else {
        $log.error('guh.components.controller:ParamTypeCtrl', 'Missing property: type');
      }

      // Mark param component as required (useful for paramTypeList)
      if(component.bindings.required) {
        vm.onRequired({
          paramComponent: component
        });
      }

      return component;
    }

    function _getActionParamComponent(actionCtrl, paramType) {
      var component = {
        selector: '',
        bindings: {
          name: paramType.name,
          value: (angular.isDefined(actionCtrl.correspondingState) && angular.isDefined(actionCtrl.correspondingState.value)) ? actionCtrl.correspondingState.value : (angular.isDefined(paramType.defaultValue) ? paramType.defaultValue : undefined)
        }
      };

      // See for more info: http://dev.guh.guru/paramtypes-ui-elements.html
      if(angular.isDefined(paramType.type)) {
        switch(paramType.type) {
          case app.basicTypes.bool:
            if(angular.isDefined(actionCtrl.correspondingState)) {
              component.selector = 'guh-toggle-button';
              component.bindings.buttonLabel = paramType.name;
              component.bindings.label = actionCtrl.actionType.name;
            } else {
              component.selector = 'guh-button-group';
              component.label = actionCtrl.actionType.name;
              component.buttons = [{
                label: 'on',
                name: paramType.name,
                value: true
              }, {
                label: 'off',
                name: paramType.name,
                value: false
              }];
            }
            break;
          case app.basicTypes.int:
          case app.basicTypes.unsignedInt:
          case app.basicTypes.double:
            if(angular.isDefined(paramType.minValue) ||
              angular.isDefined(paramType.maxValue)) {
              component.selector = 'guh-slider';
              component.bindings.minValue = paramType.minValue;
              component.bindings.maxValue = paramType.maxValue;
              component.bindings.label = paramType.name;
            } else if(angular.isDefined(paramType.allowedValues)) {
              component.selector = 'guh-select';
              component.bindings.label = paramType.name;
              component.bindings.options = paramType.allowedValues;
            } else {
              component.selector = 'guh-text-input';
              component.bindings.label = paramType.name;
              component.bindings.type = paramType.type;
              component.bindings.unit = paramType.unit;
            }
            break;
          case app.basicTypes.string:
            if(angular.isDefined(paramType.allowedValues)) {
              if(paramType.allowedValues.length > 2) {
                component.selector = 'guh-select';
                component.bindings.label = actionCtrl.actionType.name;
                component.bindings.options = paramType.allowedValues;
              } else {
                component.selector = 'guh-button-group';
                component.label = actionCtrl.actionType.name;
                component.buttons = [{
                  label: paramType.allowedValues[0],
                  name: paramType.name,
                  value: paramType.allowedValues[0]
                }, {
                  label: paramType.allowedValues[1],
                  name: paramType.name,
                  value: paramType.allowedValues[1]
                }];
              }
            } else {
              component.selector = 'guh-text-input';
              component.bindings.label = paramType.name;
              component.bindings.type = paramType.inputType;
              component.bindings.unit = paramType.unit;
            }
            break;
          case app.basicTypes.color:
            component.selector = 'guh-color'
            break;
        }
      } else {
        $log.error('guh.components.controller:ParamTypeCtrl', 'Missing property: type');
      }

      // Mark param component as required (useful for paramTypeList)
      if(component.bindings.required) {
        vm.onRequired({
          paramComponent: component
        });
      }

      return component;
    }


    function setParam(name, value, initial) {
      // To set correct initial values some paramType components call setParam() on first load. When this happens, the initial property is set to true.
      // This behaviour is not necessary when the parent of the paramType is an action. So setParam() on first load should NOT call executeAction(). An action should only be executed if a user interacts with the paramType components.
      if(vm.actionCtrl && !vm.paramTypeListCtrl && initial) {
        return;
      } else {
        vm.onChange({
          id: vm.paramType.id,
          value: value
        });
      }
    }


    DSState.on('DS.change', function(DSState, newState) {
      if((angular.isDefined(vm.actionCtrl) && vm.actionCtrl !== null) &&
         (angular.isDefined(vm.actionCtrl.correspondingState) && vm.actionCtrl.correspondingState !== null) &&
         vm.actionCtrl.correspondingState.stateTypeId === newState.stateTypeId &&
         vm.actionCtrl.device.id === newState.deviceId) {
        vm.actionCtrl.correspondingState.value = newState.value;
        if (!$scope.$$phase) {
          $scope.$apply(function() {
            vm.component.bindings.value = newState.value;
          });
        }
      }
    });

  }

}());
