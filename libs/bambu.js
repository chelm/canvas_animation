/** 
  Bambu generates thematic carto.js strings

  Currently under active development and is being used to style 
  vector tile json data in modestmaps via Carto.js & VECNIK.js.

  MIT License - Copryright 2012 
*/
function Bambu() {

  // defaults 
  var colors = 'Reds',
    type = 'quantile',
    classes = 5,
    style = '',
    data = [],
    id = '#',
    field = 'null',
    opacity = 1,
    default_fill,
    breaks = []; 
    
  // returnable class
  var bambu = function(){};

  // regenerates the classification 
  bambu.classify = function(){

    var vals = data.sort(function(a, b) {
      return a - b;
    });

    // reset breaks array
    breaks = [];

    switch (type){
      case 'quantile':
          breaks = [];

          for (var i = 0; i < classes; i++) {
            breaks.push( vals[Math.ceil(i * (vals.length - 1) / classes)])
          }

          break;
      case 'equal_interval':
          breaks = [],
          range = vals[vals.length - 1] - vals[0];

          for (var i=0; i < classes; i++) {
            breaks.push(Math.floor(vals[0] + i * range / classes))
          }

          break;
    }
    breaks[classes] = vals[vals.length - 1];

    var bins = [];
    style = '#'+ id +' { ' + ((default_fill) 
      ? ' polygon-fill: ' + default_fill + '; polygon-opacity: ' + opacity + '; ' 
      : ' polygon-opacity: '+ opacity + '; ');

    for (var b = 0; b < breaks.length-1; b++){
      var break_val = breaks[b];
      bins.push('['+field+' > '+break_val+'] { polygon-fill: ' + rgb2hex(colorbrewer[colors][classes][b]) + '; }');
    }

    style = style + bins.join(' ') + '}';
    return style;

  }

  bambu.breaks = function(){
    var breaks_low,
      breaks_high,
      ranges = [];
    for (var i=0;i<breaks.length-1;i++) {
      breaks_low = breaks[i];
      breaks_high = breaks[i + 1];
      ranges.push(breaks_low +' ~ '+ breaks_high);
    }
    return ranges;
  }

  bambu.id = function(x, gen){
    if (!arguments.length) return id;
    id = x;
    if (gen) bambu.classify();
    return bambu;
  };

  bambu.data = function(x, gen){
    if (!arguments.length) return data;
    data = x;
    if (gen) bambu.classify();
    return bambu; 
  };

  bambu.field = function(x, gen){
    if (!arguments.length) return field;
    field = x;
    if (gen) bambu.classify();
    return bambu;
  };

  bambu.colors = function(x, gen){
    if (!arguments.length) return colors;
    colors = x;
    if (gen) bambu.classify();
    return bambu;
  };

   bambu.classes = function(x, gen){
    if (!arguments.length) return classes;
    classes = Math.min(x,9);
    classes = Math.max(classes,3);
    if (gen) bambu.classify();
    return bambu;
  };

  bambu.type = function(x, gen){
    if (!arguments.length) return type;
    type = x;
    if (gen) bambu.classify();
    return bambu;
  };

  bambu.opacity = function(x, gen){
    if (!arguments.length) return opacity;
    opacity = x;
    if (gen) bambu.classify();
    return bambu;
  };  

  bambu.default_fill = function(x, gen){
    if (!arguments.length) return default_fill;
    default_fill = x;
    if (gen) bambu.classify();
    return bambu;
  }; 

  bambu.style = function(){
    return style;
  };


  function rgb2hex(rgb){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
      ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
  }


  return bambu;
}


if (typeof module !== 'undefined' && module.exports) {
  //_ = require('underscore');
  colorbrewer = require('./colorbrewer.js');
  module.exports.Bambu = Bambu;
}
