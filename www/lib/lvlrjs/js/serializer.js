"use strict";
(function() {
  var lvlrSerial = (function() {
    if (typeof(angular === 'undefined')) {
      angular = window.angular
    }
    var angular = window.angular
    var lvlrSerial = function(tasks) {
      var prevPromise;
      angular.forEach(tasks, function(task) {
        if (!prevPromise) {
          prevPromise = task()
        } else {
          // XXX notice, in case of error, exec stops
          prevPromise = prevPromise.then(task)
        }
      })
      return prevPromise
    }


  return lvlrSerial
  })();
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = lvlrSerial;
  else
    window.lvlrSerial = lvlrSerial;
})()
