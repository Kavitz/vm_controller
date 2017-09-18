(function() {
  var app = angular.module('myApp', ['ui.router']);  
  app.run(function($rootScope, $location, $state, LoginService) {
    $rootScope.$on('$stateChangeStart', 
      function(event, toState, toParams, fromState, fromParams){ 
          console.log('Changed state to: ' + toState);
      });    
      if(!LoginService.isAuthenticated()) {
        $state.transitionTo('login');
      }
  });
  
  app.config(['$stateProvider', '$locationProvider','$urlRouterProvider', '$urlMatcherFactoryProvider', function($stateProvider, $locationProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
    //console.log("url -- "+url);
    console.log("inside");
    $urlRouterProvider.otherwise('/login');
    $urlMatcherFactoryProvider.caseInsensitive(true);
    $stateProvider
      .state('login', {
        url : '/login',
        cache: false,
        views: {
          'main-view': {
            templateUrl : '/templates/login.html',
            controller : 'LoginController'
          }
        }
      })
      .state('home', {
        url : '/home',
        cache: false,
        views: {
          'main-view': {
            templateUrl : '/templates/home.html',
            controller : 'HomeController'
          },
          'banner-view@home': {
            templateUrl : '/templates/banner.html'
          },
          'menu-view@home':{
            templateUrl : '/templates/menu.html' 
          },
          'content-view@home':{
            templateUrl : '/templates/welcome.html'
          }
        }
      })
      .state('home.simplevmdeploy', {
        url: "/simplevmdeploy",  
        cache: false,
        views: {
           'content-view': {
            templateUrl:"/templates/simplevmdeploy.html",
            controller : 'DeployVMController'
        }
        },
      })
      .state('home.manageovf', {
        url: "/manageovf",  
        cache: false,
        views: {
           'content-view': {
            templateUrl:"/templates/manageovftemplate.html"
        }
        },
      })
      .state('logout', {
        url : '/login',
        cache: false,
        views: {
          'main-view': {
            templateUrl : '/templates/login.html',
            controller : 'LoginController'  
          }
        },
      }); 
      $locationProvider.html5Mode(true).hashPrefix('!');  
  }]);

  app.controller('LoginController', function($scope, $rootScope, $stateParams, $state, LoginService) {
   // $rootScope.title = "AngularJS Login Sample";
    $scope.formSubmit = function() {
      if(LoginService.login($scope.username, $scope.password)) {
        $scope.error = '';
        $scope.username = '';
        $scope.password = '';
        $state.transitionTo('home');
      } else {
        $scope.error = "Incorrect username/password !";
      }   
    };
  });
  
  app.controller('HomeController', function($scope, $rootScope, $stateParams, $state, LoginService) {
    $rootScope.title = "AngularJS Login Sample";
    console.log(LoginService.isAuthenticated());
  });

  app.controller('DeployVMController', function($scope, $http, $rootScope, $stateParams, $state, LoginService){
    console.log("\ninside depplyvm\n");
    $scope.deployVMpython = function(){
      $http.get('/runPythonScript').then(function(response){
        console.log("lets see..");
        console.log("got the data");
        console.log("response ---- ", response);
      });
    }
    $scope.deployVMshell = function(){
      $http.get('/runShellScript').then(function(response){
        console.log("lets see..");
        console.log("got the data");
        console.log("response ---- ", response);
      });
    }
  });
  
  app.factory('LoginService', function() {
    var admin = 'admin';
    var pass = 'admin';
    var isAuthenticated = false;
    return {
      login : function(username, password) {
        isAuthenticated = username === admin && password === pass;
        return isAuthenticated;
      },
      isAuthenticated : function() {
        return isAuthenticated;
      }
    };
    
  });

})();