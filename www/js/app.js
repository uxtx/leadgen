"use strict"
// Leveler leadgen App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'leadgen' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'leadgen.controllers' is found in controllers.js
angular.module('leadgen', [
  'ionic',
  'ngIOS9UIWebViewPatch',
  'ngMessages',
  'ngCordova',
  'LocalStorageModule',
  'leadgen.controllers',
  'leadgen.services'
  ])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


.constant('ApiEndpoint', {
  'url': 'https://launch.leveler.com'
})

.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}])

.config(function(localStorageServiceProvider) {
    localStorageServiceProvider
     .setNotify(true, true)
  })

.config(function($compileProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|data|file|tel):/)
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(http?|https?|ftp|tel|mailto|geo|maps|blob|file|chrome-extension):/);
})
.config(function($ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(0);
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.list', {
    url: '/list',
    views: {
      'menuContent': {
        templateUrl: 'templates/list.html',
        controller: 'ListCtrl'
      }
    }
  })

  .state('app.form', {
      url: '/form:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/form.html',
          controller: 'FormCtrl'
        }
      }
    })
    .state('app.upload', {
      url: '/upload',
      views: {
        'menuContent': {
          templateUrl: 'templates/upload.html',
          controller: 'UploadCtrl'
        }
      }
    })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/form');
});
