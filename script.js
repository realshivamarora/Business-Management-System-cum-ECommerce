angular.module('loginApp', [])
  .controller('loginCtrl', function($scope) {
    $scope.submitForm = function() {
      // Here you can perform validation or send login request to the server
      console.log('Username: ' + $scope.username);
      console.log('Password: ' + $scope.password);
      // Reset form after submission
      $scope.username = '';
      $scope.password = '';
    };
  });
