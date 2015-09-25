"use strict"
angular.module('leadgen.controllers', ['ionic'])
.controller('AppCtrl', function($scope, $ionicModal, $timeout, lvlrStorage) {
  ionic.Platform.ready(function() {
    $scope.init = function() {

      // set up the db
      lvlrStorage.init()
      console.log('what is', lvlrStorage)
    }
    $scope.init()
  })

})
.controller('ListCtrl', function($scope, lvlrStorage, lvlrSession, $state, $ionicPopup) {
  $scope.leads = [
  ];
  $scope.updateLead = function(lead) {
    lvlrSession.setLead(lead)
    $state.go('app.form', {'id': lead.id})
  }
  $scope.init = function() {
    console.log('triggered')
    lvlrStorage.getList(function(data) {
      $scope.leads = data
      console.log($scope.leads)
    }, function(error) {
      console.log('bzzt', error)
      $ionicPopup.alert({
        'title': 'Problems Getting List',
        'template': ''
      })
    })
  }
  $scope.init()
})
.controller('FormCtrl', function($scope, $state, $stateParams, lvlrSession, $ionicPopup, lvlrStorage) {
  // id will equal an index in the list or nothing at all.
  $scope.id = parseInt($stateParams.id)
  $scope.processForm = function() {
  }
  $scope.lead = {}
  $scope.getLead = function(id) {
    $scope.mode = 'editing'
    var obj = lvlrSession.getLead()
    if (obj.data) $scope.lead = obj.data
    else {
      console.log('problem with this object')
    }
    console.log("getting lead", $scope.lead)
  }
  $scope.showPopup = function() {
    $scope.data = {
      'creator': {}
    }
    var myPopup = $ionicPopup.show({
        template: '<input type="creator" ng-model="data.creator.name">',
        title: 'Enter Your Name',
        subTitle: 'Used for setting creator on form',
        scope: $scope,
        buttons: [
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              console.log($scope.data.creator)
              if (!$scope.data.creator) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                console.log('weve got it.')
                return $scope.data.creator
              }
            }
          }
        ]
      })
      myPopup.then(function(res) {
        console.log('triggered', res)
        lvlrSession.setCreator(res)
      })
  }
  $scope.init = function() {
    $scope.creator = lvlrSession.getCreator()
    if (!$scope.creator) {
      $scope.showPopup()
    }
    if (!isNaN($scope.id)) {
      $scope.getLead($scope.id)
    } else {
      $scope.mode = 'creating'
    }
  }
  $scope.init()
  $scope.addToList = function() {
    $scope.lead.creator = ($scope.creator && $scope.creator.name) ? $scope.creator.name : 'Unknown'
    lvlrStorage.saveContact($scope.lead, function(res) {
      console.log(res)
      $ionicPopup.alert({
        'title': 'Thanks for Signing Up!',
        'template': ''
      })
      $scope.lead = {}
    }, function(err) {
      console.log('bzzzt', err)
    }
    )


  }
  $scope.updateInList = function(index) {
    console.log('updating in list',index)
    $scope.lead.creator = ($scope.creator && $scope.creator.name) ? $scope.creator.name : 'Unknown'
    lvlrStorage.updateContact($scope.lead, index, function(res) {
      console.log(res)
      $ionicPopup.alert({
        'title': 'Record Updated',
        'template': ''
      })
    }, function(err) {
      console.log('bzzzt', err)
    })


  }
  $scope.processForm = function() {
    if (!$scope.lead.name || !$scope.lead.company || !$scope.lead.phone || !$scope.lead.email) {
      $ionicPopup.alert({
        'title': 'Please Fill Out Form',
        'template': ''
      })
    } else {
      if ($scope.mode === 'creating') $scope.addToList()
      else if ($scope.mode === 'editing') {
        $scope.updateInList($scope.id)
      }
      // console.log('valid')
    }
  }

})
.controller('UploadCtrl', function($scope, $stateParams, lvlrSession, lvlrApi, $ionicPopup) {
  $scope.formObj = {}
  $scope.leads = []
  $scope.creator = {}
  $scope.saveLeads = function() {
    console.log('asdf', $scope.leads.length)

  }
  $scope.processForm = function() {
    if (!$scope.creator.name) {
      $ionicPopup.alert({
        'title': 'Creator Name Required',
        'template': ''
      })
    } else {
      console.log($scope.creator.name)
      lvlrSession.setCreator($scope.creator)
    }
  }
  $scope.init = function() {
    lvlrStorage.getList(function(data) {
      $scope.leads = data
      console.log($scope.leads)
    }, function(error) {
      console.log('bzzt', error)
      $ionicPopup.alert({
        'title': 'Problems Getting List',
        'template': ''
      })
    })
    $scope.creator = lvlrSession.getCreator() || {}
    console.log($scope.creator)
  }

  $scope.init()
  console.log('upload ctrl')
})
