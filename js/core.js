//========================================
// Core
//
// base classes
//========================================

// create root scope if not exists
var VECNIK = VECNIK || {};

(function(VECNIK) {

    //========================================
    // Events
    //
    // event management
    //========================================

    function Event() {}
    Event.prototype.on = function(evt, callback) {
        var cb = this.callbacks = this.callbacks || {};
        var l = cb[evt] || (cb[evt] = []);
        l.push(callback);
    };

    Event.prototype.emit = function(evt) {
        var c = this.callbacks && this.callbacks[evt];
        for(var i = 0; c && i < c.length; ++i) {
            c[i].apply(this, Array.prototype.slice.call(arguments, 1));
        }
    };


    // http get
    // should be improved
    function get(url, callback) {
      var mygetrequest= new XMLHttpRequest();
      mygetrequest.onreadystatechange=function() {
        if (mygetrequest.readyState == 4){
          if (mygetrequest.status == 200){
            callback(JSON.parse(mygetrequest.responseText));
          }
          else {
            //error
          }
        }
      };
      mygetrequest.open("GET", url, true)
      mygetrequest.send(null)
    }

    //========================================
    // model
    //
    // pretty basic model funcionallity
    //========================================

    function Model() {
      //this.data = {}; // serializable data
    }

    Model.prototype = new Event();

    Model.prototype.set = function(data, silent) {
      this.data = this.data || {};
      for(var v in data) {
        if(data.hasOwnProperty(v)) {
          this.data[v] = data[v];
        }
      }
      if(!silent) {
        this.emit('change', this.data);
      }
    };

    Model.prototype.get = function(attr, def) {
      if(this.data) {
        if(attr in this.data) {
          return this.data[attr];
        }
        return def;
      }
      return def;
    };

    /**
     * delete the attribute
     */
    Model.prototype.unset = function(attr, silent) {
      delete this.data[attr];
      if(!silent) {
        this.emit('change', this.data);
      }
    };

    Model.prototype.destroy = function() {
      this.emit('destroy');
      delete this.data;
    };

    function RGB2Int(r,g,b){
      return r+(256*g)+(256*256*b);
    };

    function Int2RGB(input) {
      var r = input % 256;
      var g = parseInt(input / 256) % 256;
      var b = parseInt(input / 256 / 256) % 256;
      return [r,g,b];
    };

    VECNIK.Event = Event;
    VECNIK.Model = Model;
    VECNIK.get = get;
    VECNIK.RGB2Int = RGB2Int;
    VECNIK.Int2RGB = Int2RGB;

})(VECNIK);

if (typeof module !== 'undefined' && module.exports) {
  module.exports.Event = VECNIK.Event;
  module.exports.Model = VECNIK.Model;
}
