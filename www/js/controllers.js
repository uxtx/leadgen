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
.controller('ListCtrl', function($scope, lvlrStorage, lvlrSession, $state, $ionicPopup,$ionicLoading) {
  $scope.leads = [
  ];
  $scope.updateLead = function(lead) {
    lvlrSession.setLead(lead)
    $state.go('app.form', {'id': lead.id})
  }
  $scope.init = function() {
    $ionicLoading.show({templateUrl: "templates/spinner.html"})
    lvlrStorage.getList(function(data) {
      $ionicLoading.hide()
      $scope.leads = data
    }, function(error) {
      $ionicLoading.hide()
      $ionicPopup.alert({
        'title': 'Problems Getting List',
        'template': ''
      })
    })
  }
  $scope.init()
})
.controller('FormCtrl', function($scope, $state, $stateParams, lvlrSession, $ionicPopup, lvlrStorage, $ionicLoading) {
  // id will equal an index in the list or nothing at all.
  $scope.id = parseInt($stateParams.id)
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
              if (!$scope.data.creator) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.data.creator
              }
            }
          }
        ]
      })
      myPopup.then(function(res) {
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
    $ionicLoading.show({templateUrl: "templates/spinner.html"})
    $scope.lead.creator = $scope.creator.name
    lvlrStorage.saveContact($scope.lead, function(res) {
      $ionicLoading.hide()
      $ionicPopup.alert({
        'title': 'Thanks for Signing Up!',
        'template': ''
      })
      $scope.lead = {}
    }, function(err) {
      $ionicLoading.hide()
      $ionicPopup.alert({
        'title': 'Problem Signing Up',
        'template': ''
      })
    }
    )


  }
  $scope.updateInList = function(index) {
    $ionicLoading.show({templateUrl: "templates/spinner.html"})
    $scope.lead.creator = $scope.creator.name
    lvlrStorage.updateContact($scope.lead, index, function(res) {
      $ionicLoading.hide()
      $state.go('app.list')

    }, function(err) {
      $ionicLoading.hide()
      $ionicPopup.alert({
        'title': 'Problem Updating Record',
        'template': ''
      })
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
        if (!$scope.lead.name || !$scope.lead.company || !$scope.lead.phone || !$scope.lead.email || !$scope.lead.grade) {
          $ionicPopup.alert({
            'title': 'Please Fill Out Form',
            'template': ''
          })
        }
        $scope.updateInList($scope.id)
      }
      // console.log('valid')
    }
  }

})
.controller('UploadCtrl', function($scope, $stateParams, lvlrSession, lvlrApi, $ionicPopup, lvlrStorage, $q, $ionicLoading) {
  $scope.formObj = {}
  $scope.leads = []
  $scope.creator = {}
  $scope.uploadToDatalake = function(lead) {
    console.log(lead.creator)
    lvlrApi.setLake('testing2015', lead.data, function(data) {
      console.log('successful request', data)
      lvlrStorage.markAsUploaded(lead.id, function(uplddata) {
        console.log('successful request', uplddata)

      }, function(err) {
        console.log('bzz err', err)
      })
    }, function(error) {
      console.log('failed to post to datalake', error)
    })
  }
  $scope.saveLeads = function() {
    $ionicLoading.show({templateUrl: "templates/spinner.html"})
    lvlrStorage.getListToUpload(function(data) {
      var promises = []
      $scope.filesToUpload = data
      angular.forEach($scope.filesToUpload,function(val, key) {
        promises.push($scope.uploadToDatalake(val))
      })
      $q.all(promises).then(function success(data) {
        $ionicLoading.hide()
        console.log('yay it worked', data)
        $ionicPopup.alert({
          'title': 'Records Successfully Saved.',
          'template': ''
        })
      }, function failure(err) {
        $ionicLoading.hide()
        $ionicPopup.alert({
          'title': 'Problem uploading records',
          'template': ''
        })
        console.log('yay it worked', data)
        console.log('boo it failed', err)
      })
    }, function(error) {
      $ionicLoading.hide()
      console.log('bzzz', error)
    })
  }
  $scope.getUnUploadedCount = function(list) {
    var keys = [];
    _.each( list, function( val, key ) {
      console.log('doot',val, key)
      if (!val.uploaded || val.uploaded === 0 ) {
        keys.push(val);
      }
    });
    console.log('what is this?', keys)
    return keys.length
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
