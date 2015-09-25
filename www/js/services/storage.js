"use strict"
angular.module('leadgen.services.storage', [])
.factory('lvlrStorage', function($window, $rootScope, $state, $cordovaSQLite) {

  var factory = {}

  factory.init = function() {
    factory.db = $cordovaSQLite.openDB({ name: "lead.db" });
    factory.initializeDatabase()
  }

  factory.initializeDatabase = function() {
    var query = "create table if not exists people (id integer primary key , data text, uploaded int)";
    $cordovaSQLite.execute(factory.db, query)
  }

  factory.saveContact = function(contact, cb, eb) {
    var query = "INSERT INTO people (data) VALUES (?)";
    $cordovaSQLite.execute(factory.db, query, [JSON.stringify(contact)]).then(function(res) {
      cb(res)
    }, function (err) {
      eb(err)
    })
  }

  factory.updateContact = function(contact, id, cb, eb) {
    console.log('CONTACT IS', contact)
    var query = "UPDATE people SET data = ?, uploaded = 0 where id = ? ";
    $cordovaSQLite.execute(factory.db, query, [JSON.stringify(contact), id]).then(function(res) {
      cb(res)
    }, function (err) {
      eb(err)
    })
  }

  factory.markAsUploaded = function(id, cb, eb) {
    var query = "UPDATE people SET uploaded = 1 where id = ? ";
    $cordovaSQLite.execute(factory.db, query, [id]).then(function(res) {
      cb(res)
    }, function (err) {
      eb(err)
    })
  }

  factory.getList = function(cb, eb) {
    var query = "SELECT id, data from people";
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
