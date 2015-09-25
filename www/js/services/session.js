"use strict"
angular.module('leadgen.services.session', [])
.factory('lvlrSession', function($window, $rootScope, $state, localStorageService) {
  // helper to replace urls with absolute link.


  var factory = {}

  factory.getLead = function() { 
    var lead = localStorageService.get('lead')
    return lead
  }
  factory.setLead = function(lead) { 
    localStorageService.set('lead', lead)
  }

  factory.setCreator = function(creator) {
    localStorageService.set('creator', creator)
  }
  factory.getCreator = function() {
    var creator = localStorageService.get('creator')
    return creator
  }

  return factory
})
