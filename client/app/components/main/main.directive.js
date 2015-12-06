(function() {
  'use strict';

  angular
    .module('app')
    .directive('main', function() {
      return {
        restrict: 'E',
        templateUrl: 'app/components/main/main.html',
        controller: MainCtrl,
        controllerAs: 'mainVm',
        bindToController: true
      };
    });

  MainCtrl.$inject = ['$http'];

  function MainCtrl($http) {
    var vm = this;

    vm.thing = {};
    vm.status = '';

    vm.getThings = function() {
      $http.get('/api/things')
        .then(function(response) {
          vm.thingsList = response.data;
        });
    };

    vm.postThing = function() {
      $http.post('/api/things', vm.thing)
        .then(function() {
          vm.status = 'OK';
        });
    };
  }
})();
