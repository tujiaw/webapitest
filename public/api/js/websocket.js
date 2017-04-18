'use strict';

var WebSocket = (function() {
  var inst;
  var i = 0;
  var createObject = function() {
    var obj = new Object();
    obj.connect = function() {
      console.log('hello connect ' + i++);
    }
    return obj;
  };

  return {
    getInst: function() {
      if (!inst) {
        inst = createObject();
      }
      return inst;
    }
  }
})();
