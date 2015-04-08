// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.factories'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  // .state('tab', {
  //   url: "/tab",
  //   abstract: true,
  //   templateUrl: "templates/tabs.html"
  // })

  // Each tab has its own nav history stack:

  // .state('tab.dash', {
  //   url: '/dash',
  //   views: {
  //     'tab-dash': {
  //       templateUrl: 'templates/tab-dash.html',
  //       // controller: 'DashCtrl'
  //     }
  //   }
  // })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'AuthCtrl'
  })

  .state('localLogin', {
    url: '/locallogin',
    templateUrl: 'templates/localLogin.html'
  })

  .state('localSigup', {
    url: '/localsignup',
    templateUrl: 'templates/localSignup.html'
  })

  .state('purgatory', {
    url: '/purgatory',
    templateUrl: 'templates/purgatory.html',
    controller: 'PurgController'
  })

  .state('goaltype', {
    url: '/goaltype',
    templateUrl: 'templates/goaltype.html',
    controller: 'GoalCtrl',
  })

    .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html'
  })

  .state('goaldetails', {
    url: '/goaldetails',
    templateUrl: 'templates/goaldetails.html',
    controller: 'GoalDetailCtrl'
  })

  .state('goalsuccess', {
    url: '/goalsuccess',
    templateUrl: 'templates/goalsuccess.html',
    controller: 'GoalSuccessCtrl'
  })

  .state('goalfailure', {
    url: '/goalfailure',
    templateUrl: 'templates/goalfailure.html',
    controller: 'GoalFailureCtrl'
  })

  .state('payment', {
    url: '/payment',
    templateUrl: 'templates/payment.html',
    controller: ''
  })

  .state('progress', {
    url: '/progress',
    templateUrl: 'templates/progress.html',
    controller: 'ProgressCtrl'
  })

  .state('successreport', {
    url: '/successreport',
    templateUrl: 'templates/successreport.html',
    controller: 'SuccessReportCtrl'
  })

  .state('failurereport', {
    url: '/failurereport',
    templateUrl: 'templates/failurereport.html',
    controller: 'FailureReportCtrl'
  })

  .state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html',
    controller: 'SettingsCtrl'
  });



  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});