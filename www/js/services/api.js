"use strict"
angular.module('leadgen.services.api', [])
.factory('lvlrApi', function($http, $location, ApiEndpoint, lvlrSession) {
  // grab api from our common api factory
  var lvlrApi = window.lvlrApi
  return new lvlrApi($http, $location, lvlrSession, ApiEndpoint)
})
