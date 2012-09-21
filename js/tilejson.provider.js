
//========================================
// Tile JSON data provider 
//========================================

(function(VECNIK) {

  function TileJSONAPI(opts) {
      this.opts = opts;
      this.join = opts.join;
      this.key  = opts.key;
      this.style  = opts.style;
  }

  TileJSONAPI.prototype._url = function(layer, path) {
      return this.opts.base_url + layer + '/' + path;
  }

  TileJSONAPI.prototype.url = function(coordinates) {
      var url = this._url( this.opts.layer, [coordinates.zoom, coordinates.column, coordinates.row].join('/') + ((this.opts.mime) ? this.opts.mime : '.geojson') );
      return url;
  }
  
  VECNIK.TileJSON = VECNIK.TileJSON || {};
  VECNIK.TileJSON.API = TileJSONAPI;

  /*function TileJoiner(){}
  TileJoiner.prototype = new VECNIK.Model();

  VECNIK.Joiner = TileJoiner;
  VECNIK.TileJoiner = new TileJoiner();*/

})(VECNIK);
