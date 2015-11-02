'use strict';

angular.module('app')
  .controller('MainCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.thingsList;

    $scope.getThings = function() {
      $http.get('/api/things')
        .then(function(response) {
          $scope.thingsList = response.data;
        });
    };

    $scope.postThing = function() {
      $http.post('/api/things', $scope.thing)
        .then(function() {
          $scope.status = 'OK';
        });
    };
  }]);
