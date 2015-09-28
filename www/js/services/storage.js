"use strict"
angular.module('leadgen.services.storage', [])
.factory('lvlrStorage', function($window, $rootScope, $state, $cordovaSQLite) {

  var factory = {}

  factory.init = function() {
    factory.db = $cordovaSQLite.openDB({ name: "lead.db" });
    factory.initializeDatabase()
    console.log('did this work?', factory)
  }

  factory.initializeDatabase = function() {
    var query = "create table if not exists people (id integer primary key , data text, uploaded integer)";
    $cordovaSQLite.execute(factory.db, query)
  }

  factory.saveContact = function(contact, cb, eb) {
    var query = "INSERT INTO people (data, uploaded) VALUES (?, ?)";
    $cordovaSQLite.execute(factory.db, query, [JSON.stringify(contact), 0]).then(function(res) {
      cb(res)
    }, function (err) {
      eb(err)
    })
  }

  factory.updateContact = function(contact, id, cb, eb) {
    console.log('CONTACT IS', contact)
    var query = "UPDATE people SET data = ?, uploaded = 0 WHERE id = ? ";
    $cordovaSQLite.execute(factory.db, query, [JSON.stringify(contact), id]).then(function(res) {
      cb(res)
    }, function (err) {
      eb(err)
    })
  }

  factory.markAsUploaded = function(id, cb, eb) {
    var query = "UPDATE people SET uploaded = 1 WHERE id = ? ";
    $cordovaSQLite.execute(factory.db, query, [id]).then(function(res) {
      cb(res)
    }, function (err) {
      eb(err)
    })
  }

  factory.getListToUpload = function(cb, eb) {
    var query = "SELECT * FROM people WHERE uploaded = 0";
    $cordovaSQLite.execute(factory.db, query).then(function(res) {
      var tmpitems = []
      console.log('row length', res.rows.length)
      for(var i=0; i < res.rows.length; i++) {
        var item = res.rows.item(i)
        var idata = JSON.parse(item.data)
        item.data = idata
        tmpitems.push(item)
      }
      cb(tmpitems)
    }, function (err) {
      eb(err)
    });
  }

  factory.getList = function(cb, eb) {
    var query = "SELECT id, data FROM people";
    $cordovaSQLite.execute(factory.db, query).then(function(res) {
      var tmpitems = []
      console.log('row length', res.rows.length)
      for(var i=0; i < res.rows.length; i++) {
        var item = res.rows.item(i)
        var idata = JSON.parse(item.data)
        item.data = idata
        tmpitems.push(item)
      }
      cb(tmpitems)
    }, function (err) {
      eb(err)
    });
  }

  return factory
})
