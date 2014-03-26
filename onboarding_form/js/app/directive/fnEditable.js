
angular.module('smmApp').directive('fnEditable', ['$timeout', '$document', 'api', function($timeout, $document, api){
    return {
        restrict: 'AC',
        scope: {
            model: '=ngModel', //model
            value: '=ngValue', //value to edit
            target: '=', //target to edit
            permission: '&', //method to call to check for permissions,
            save: '=', //method to call on enter
            buttons: '=', //Custom buttons to add to the template
            containerClass: '@' //optional class to add to the parent container when the input is visible - defaults to shown
        },
        template:
                //'<span>{{value}}</span>' +
                '<button type="button" ng-click="toggleInput()" class="btn btn-sm btn-custom glyphicon glyphicon-pencil"></button>' +
                '<div class="input-wrapper" ng-show="showInput"><textarea ng-model="draft"></textarea>' +
                //'<input type="text" value="" ng-model="draft" />'+
                '<div class="btn-group"><button class="btn btn-custom" ng-click="saveEdit()">Save</button>'+
                '<button class="btn btn-custom" ng-click="cancelEdit()">Cancel</button>' +
                '<button ng-repeat="button in buttons" class="btn btn-custom" ng-click="button.action()" class="{{button.cssClass}}">{{button.text}}</button>'+
                '</div></div>',
        replace: false,
        link: function(scope, element, attrs) {
            element.addClass('fn-editable-wrap');

            scope.draft = scope.value;
            scope.showInput = false;

            var hasPermission = true, //track if the user has perssion
                containerClass = angular.isString(scope.containerClass) ? scope.containerClass : 'shown',
                /**
                * If we are clicking anywhere outside of the in-place editing box, we want to
                * hide the input
                */
                docListener = $document.bind('click', hideInput);

            /**
             * Hide the input and show the span
             * @return {[type]} [description]
             */
            function hideInput(){
                if(scope.showInput){
                    scope.$apply(function(){
                        scope.showInput = false;
                    });
                }
            }
            /**
             * Write the draft value to the parent scope (value)
             * @return {void}
             */
            scope.saveEdit = function(){
                if(hasPermission){
                    scope.value = scope.draft;
                    if(angular.isFunction(scope.save)){
                        scope.save(scope.model.orderId, scope.target, scope.draft);
                    }
                    scope.showInput = false;
                }
            };

            /**
             * Reset the draft to the parent scope value
             * @return {void}
             */
            scope.cancelEdit = function(){
                scope.draft = scope.value;
                //hide the input
                scope.showInput = false;
            };

            /**
             * Toggle the visibility of the input
             * Check for permission and then focus the input
             * @return {void}
             */
            scope.toggleInput = function(){
                if(hasPermission){
                    scope.showInput = true;
                    //wrap in timeout to make sure it is displayed before focusing
                    $timeout(function(){
                        var inp = element.find('input')[0] || element.find('textarea')[0];
                        inp.focus();
                        //inp.select();
                    }, 0);
                }
            };

            /**
             * On enter call the internal save method
             * @return {void}
             */
            element.bind('keypress', function(e){
                if(hasPermission){
                   e.stopPropagation();
                    if(e.keyCode === 13 || e.which === 13){
                        e.preventDefault();
                        scope.$apply(scope.saveEdit);
                   }
                }
            }).bind('click', function(e){
                //e.preventDefault();
                e.stopPropagation();
            });

            /**
             * Remove the event listener when the page changes
             */
            scope.$on('$routeChangeStart', function($scope, next, current){
               $document.unbind('click', hideInput);
            });

            /**
             * watch for a permissions function and if one is set
             * test if content should be editable
             */
            scope.$watch('permission', function(){
                if(angular.isDefined(scope.permission())){
                    hasPermission = scope.permission();
                }
            });

            /**
             * Add/remove the css class from the parent container
             * @return {[type]} [description]
             */
            scope.$watch('showInput', function(){
                if(scope.showInput){
                    element.addClass(containerClass);
                } else {
                    element.removeClass(containerClass);
                }
            });
        }
    }
}]);