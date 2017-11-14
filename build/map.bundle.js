/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 464);
/******/ })
/************************************************************************/
/******/ ({

/***/ 464:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(465);

// Initialize the map
var map = L.map('map', {
    scrollWheelZoom: false
});

// Set the position and zoom level of the map
// import * as d3 from 'd3'
// import * as L from 'leaflet'
map.setView([46.505, 6.63], 13);

// Adding all the possible layers

var osmOrg = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var marker = L.marker([46.5, 6.63]).addTo(map);

marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

circle.bindPopup("Circle");

var popup = L.popup();

var mapClick = function mapClick(e) {
    popup.setLatLng(e.latlng).setContent("You clicked here").openOn(map);
};

var halfMarathon = omnivore.gpx('gps_data/Demi-marathonLausanne.gpx');
// halfMarathon.addTo(map)

var el = L.control.elevation();
el.addTo(map);

var gpx = 'gps_data/Demi-marathonLausanne.gpx'; // URL to your GPX file or the GPX itself
var track = new L.GPX(gpx, {
    async: true,
    marker_options: {
        startIconUrl: 'images/pin-icon-start.png',
        endIconUrl: 'images/pin-icon-end.png',
        shadowUrl: 'images/pin-shadow.png'
    } });

track.on('loaded', function (e) {
    map.fitBounds(e.target.getBounds());
    console.log(e.target.get_name());
    console.log(e.target.get_distance());
    console.log(e.target.get_total_time());
}).addTo(map);

var line = 0;

track.on('addline', function (e) {
    line = e.line;
    console.log(line._latlngs);
});

// track.on('addline', e => {
//     el.addData(e.line)
// })

// var g=new L.GPX("gps_data/Demi-marathonLausanne.gpx", {async: true});
// g.on("addline",function(e){
//     el.addData(e.line);
// });
// g.on("addline",function(e){
//     el.addData(e.line);
// });
// g.addTo(map);
//

d3.select('body').append('p').text(track.get_total_time());

map.scrollWheelZoom.enable();
map.on('click', mapClick);

/***/ }),

/***/ 465:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*! Leaflet.Elevation 18-02-2015 */
L.Control.Elevation = L.Control.extend({ options: { position: "topright", theme: "lime-theme", width: 600, height: 175, margins: { top: 10, right: 20, bottom: 30, left: 60 }, useHeightIndicator: !0, interpolation: "linear", hoverNumber: { decimalsX: 3, decimalsY: 0, formatter: void 0 }, xTicks: void 0, yTicks: void 0, collapsed: !1, yAxisMin: void 0, yAxisMax: void 0, forceAxisBounds: !1 }, onRemove: function onRemove() {
    this._container = null;
  }, onAdd: function onAdd(a) {
    this._map = a;var b = this.options,
        c = b.margins;b.xTicks = b.xTicks || Math.round(this._width() / 75), b.yTicks = b.yTicks || Math.round(this._height() / 30), b.hoverNumber.formatter = b.hoverNumber.formatter || this._formatter, d3.select("body").classed(b.theme, !0);var d = this._x = d3.scale.linear().range([0, this._width()]),
        e = this._y = d3.scale.linear().range([this._height(), 0]),
        f = (this._area = d3.svg.area().interpolate(b.interpolation).x(function (a) {
      var b = d(a.dist);return a.xDiagCoord = b, b;
    }).y0(this._height()).y1(function (a) {
      return e(a.altitude);
    }), this._container = L.DomUtil.create("div", "elevation"));this._initToggle();var g = d3.select(f);g.attr("width", b.width);var h = g.append("svg");h.attr("width", b.width).attr("class", "background").attr("height", b.height).append("g").attr("transform", "translate(" + c.left + "," + c.top + ")");var i = d3.svg.line();i = i.x(function () {
      return d3.mouse(h.select("g"))[0];
    }).y(function () {
      return this._height();
    });var j = d3.select(this._container).select("svg").select("g");this._areapath = j.append("path").attr("class", "area");var k = this._background = j.append("rect").attr("width", this._width()).attr("height", this._height()).style("fill", "none").style("stroke", "none").style("pointer-events", "all");L.Browser.touch ? (k.on("touchmove.drag", this._dragHandler.bind(this)).on("touchstart.drag", this._dragStartHandler.bind(this)).on("touchstart.focus", this._mousemoveHandler.bind(this)), L.DomEvent.on(this._container, "touchend", this._dragEndHandler, this)) : (k.on("mousemove.focus", this._mousemoveHandler.bind(this)).on("mouseout.focus", this._mouseoutHandler.bind(this)).on("mousedown.drag", this._dragStartHandler.bind(this)).on("mousemove.drag", this._dragHandler.bind(this)), L.DomEvent.on(this._container, "mouseup", this._dragEndHandler, this)), this._xaxisgraphicnode = j.append("g"), this._yaxisgraphicnode = j.append("g"), this._appendXaxis(this._xaxisgraphicnode), this._appendYaxis(this._yaxisgraphicnode);var l = this._focusG = j.append("g");return this._mousefocus = l.append("svg:line").attr("class", "mouse-focus-line").attr("x2", "0").attr("y2", "0").attr("x1", "0").attr("y1", "0"), this._focuslabelX = l.append("svg:text").style("pointer-events", "none").attr("class", "mouse-focus-label-x"), this._focuslabelY = l.append("svg:text").style("pointer-events", "none").attr("class", "mouse-focus-label-y"), this._data && this._applyData(), f;
  }, _dragHandler: function _dragHandler() {
    d3.event.preventDefault(), d3.event.stopPropagation(), this._gotDragged = !0, this._drawDragRectangle();
  }, _drawDragRectangle: function _drawDragRectangle() {
    if (this._dragStartCoords) {
      var a = this._dragCurrentCoords = d3.mouse(this._background.node()),
          b = Math.min(this._dragStartCoords[0], a[0]),
          c = Math.max(this._dragStartCoords[0], a[0]);if (this._dragRectangle || this._dragRectangleG) this._dragRectangle.attr("width", c - b).attr("x", b);else {
        var d = d3.select(this._container).select("svg").select("g");this._dragRectangleG = d.append("g"), this._dragRectangle = this._dragRectangleG.append("rect").attr("width", c - b).attr("height", this._height()).attr("x", b).attr("class", "mouse-drag").style("pointer-events", "none");
      }
    }
  }, _resetDrag: function _resetDrag() {
    this._dragRectangleG && (this._dragRectangleG.remove(), this._dragRectangleG = null, this._dragRectangle = null, this._hidePositionMarker(), this._map.fitBounds(this._fullExtent));
  }, _dragEndHandler: function _dragEndHandler() {
    if (!this._dragStartCoords || !this._gotDragged) return this._dragStartCoords = null, this._gotDragged = !1, void this._resetDrag();this._hidePositionMarker();var a = this._findItemForX(this._dragStartCoords[0]),
        b = this._findItemForX(this._dragCurrentCoords[0]);this._fitSection(a, b), this._dragStartCoords = null, this._gotDragged = !1;
  }, _dragStartHandler: function _dragStartHandler() {
    d3.event.preventDefault(), d3.event.stopPropagation(), this._gotDragged = !1, this._dragStartCoords = d3.mouse(this._background.node());
  }, _findItemForX: function _findItemForX(a) {
    var b = d3.bisector(function (a) {
      return a.dist;
    }).left,
        c = this._x.invert(a);return b(this._data, c);
  }, _findItemForLatLng: function _findItemForLatLng(a) {
    var b = null,
        c = 1 / 0;return this._data.forEach(function (d) {
      var e = a.distanceTo(d.latlng);c > e && (c = e, b = d);
    }), b;
  }, _fitSection: function _fitSection(a, b) {
    var c = Math.min(a, b),
        d = Math.max(a, b),
        e = this._calculateFullExtent(this._data.slice(c, d));this._map.fitBounds(e);
  }, _initToggle: function _initToggle() {
    var a = this._container;if (a.setAttribute("aria-haspopup", !0), L.Browser.touch ? L.DomEvent.on(a, "click", L.DomEvent.stopPropagation) : L.DomEvent.disableClickPropagation(a), this.options.collapsed) {
      this._collapse(), L.Browser.android || L.DomEvent.on(a, "mouseover", this._expand, this).on(a, "mouseout", this._collapse, this);var b = this._button = L.DomUtil.create("a", "elevation-toggle", a);b.href = "#", b.title = "Elevation", L.Browser.touch ? L.DomEvent.on(b, "click", L.DomEvent.stop).on(b, "click", this._expand, this) : L.DomEvent.on(b, "focus", this._expand, this), this._map.on("click", this._collapse, this);
    }
  }, _expand: function _expand() {
    this._container.className = this._container.className.replace(" elevation-collapsed", "");
  }, _collapse: function _collapse() {
    L.DomUtil.addClass(this._container, "elevation-collapsed");
  }, _width: function _width() {
    var a = this.options;return a.width - a.margins.left - a.margins.right;
  }, _height: function _height() {
    var a = this.options;return a.height - a.margins.top - a.margins.bottom;
  }, _formatter: function _formatter(a, b, c) {
    var d;d = 0 === b ? Math.round(a) + "" : L.Util.formatNum(a, b) + "";var e = d.split(".");if (e[1]) {
      for (var f = b - e[1].length; f > 0; f--) {
        e[1] += "0";
      }d = e.join(c || ".");
    }return d;
  }, _appendYaxis: function _appendYaxis(a) {
    a.attr("class", "y axis").call(d3.svg.axis().scale(this._y).ticks(this.options.yTicks).orient("left")).append("text").attr("x", -45).attr("y", 3).style("text-anchor", "end").text("m");
  }, _appendXaxis: function _appendXaxis(a) {
    a.attr("class", "x axis").attr("transform", "translate(0," + this._height() + ")").call(d3.svg.axis().scale(this._x).ticks(this.options.xTicks).orient("bottom")).append("text").attr("x", this._width() + 20).attr("y", 15).style("text-anchor", "end").text("km");
  }, _updateAxis: function _updateAxis() {
    this._xaxisgraphicnode.selectAll("g").remove(), this._xaxisgraphicnode.selectAll("path").remove(), this._xaxisgraphicnode.selectAll("text").remove(), this._yaxisgraphicnode.selectAll("g").remove(), this._yaxisgraphicnode.selectAll("path").remove(), this._yaxisgraphicnode.selectAll("text").remove(), this._appendXaxis(this._xaxisgraphicnode), this._appendYaxis(this._yaxisgraphicnode);
  }, _mouseoutHandler: function _mouseoutHandler() {
    this._hidePositionMarker();
  }, _hidePositionMarker: function _hidePositionMarker() {
    this._marker && (this._map.removeLayer(this._marker), this._marker = null), this._mouseHeightFocus && (this._mouseHeightFocus.style("visibility", "hidden"), this._mouseHeightFocusLabel.style("visibility", "hidden")), this._pointG && this._pointG.style("visibility", "hidden"), this._focusG.style("visibility", "hidden");
  }, _mousemoveHandler: function _mousemoveHandler() {
    if (this._data && 0 !== this._data.length) {
      {
        var a = d3.mouse(this._background.node()),
            b = this.options,
            c = this._data[this._findItemForX(a[0])],
            d = c.altitude,
            e = c.dist,
            f = c.latlng,
            g = b.hoverNumber.formatter(d, b.hoverNumber.decimalsY);b.hoverNumber.formatter(e, b.hoverNumber.decimalsX);
      }this._showDiagramIndicator(c, a[0]);var h = this._map.latLngToLayerPoint(f);if (b.useHeightIndicator) {
        if (!this._mouseHeightFocus) {
          var i = d3.select(".leaflet-overlay-pane svg").append("g");this._mouseHeightFocus = i.append("svg:line").attr("class", "height-focus line").attr("x2", "0").attr("y2", "0").attr("x1", "0").attr("y1", "0");var j = this._pointG = i.append("g");j.append("svg:circle").attr("r", 6).attr("cx", 0).attr("cy", 0).attr("class", "height-focus circle-lower"), this._mouseHeightFocusLabel = i.append("svg:text").attr("class", "height-focus-label").style("pointer-events", "none");
        }var k = this._height() / this._maxElevation * d,
            l = h.y - k;this._mouseHeightFocus.attr("x1", h.x).attr("x2", h.x).attr("y1", h.y).attr("y2", l).style("visibility", "visible"), this._pointG.attr("transform", "translate(" + h.x + "," + h.y + ")").style("visibility", "visible"), this._mouseHeightFocusLabel.attr("x", h.x).attr("y", l).text(g + " m").style("visibility", "visible");
      } else this._marker ? this._marker.setLatLng(f) : this._marker = new L.Marker(f).addTo(this._map);
    }
  }, _addGeoJSONData: function _addGeoJSONData(a) {
    if (a) {
      for (var b = this._data || [], c = this._dist || 0, d = this._maxElevation || 0, e = 0; e < a.length; e++) {
        var f = new L.LatLng(a[e][1], a[e][0]),
            g = new L.LatLng(a[e ? e - 1 : 0][1], a[e ? e - 1 : 0][0]),
            h = f.distanceTo(g);c += Math.round(h / 1e3 * 1e5) / 1e5, d = d < a[e][2] ? a[e][2] : d, b.push({ dist: c, altitude: a[e][2], x: a[e][0], y: a[e][1], latlng: f });
      }this._dist = c, this._data = b, this._maxElevation = d;
    }
  }, _addGPXdata: function _addGPXdata(a) {
    if (a) {
      for (var b = this._data || [], c = this._dist || 0, d = this._maxElevation || 0, e = 0; e < a.length; e++) {
        var f = a[e],
            g = a[e ? e - 1 : 0],
            h = f.distanceTo(g);c += Math.round(h / 1e3 * 1e5) / 1e5, d = d < f.meta.ele ? f.meta.ele : d, b.push({ dist: c, altitude: f.meta.ele, x: f.lng, y: f.lat, latlng: f });
      }this._dist = c, this._data = b, this._maxElevation = d;
    }
  }, _addData: function _addData(a) {
    var b,
        c = a && a.geometry && a.geometry;if (c) switch (c.type) {case "LineString":
        this._addGeoJSONData(c.coordinates);break;case "MultiLineString":
        for (b = 0; b < c.coordinates.length; b++) {
          this._addGeoJSONData(c.coordinates[b]);
        }break;default:
        throw new Error("Invalid GeoJSON object.");}var d = a && "FeatureCollection" === a.type;if (d) for (b = 0; b < a.features.length; b++) {
      this._addData(a.features[b]);
    }a && a._latlngs && this._addGPXdata(a._latlngs);
  }, _calculateFullExtent: function _calculateFullExtent(a) {
    if (!a || a.length < 1) throw new Error("no data in parameters");var b = new L.latLngBounds(a[0].latlng, a[0].latlng);return a.forEach(function (a) {
      b.extend(a.latlng);
    }), b;
  }, addData: function addData(a, b) {
    this._addData(a), this._container && this._applyData(), b.on("mousemove", this._handleLayerMouseOver.bind(this));
  }, _handleLayerMouseOver: function _handleLayerMouseOver(a) {
    if (this._data && 0 !== this._data.length) {
      var b = a.latlng,
          c = this._findItemForLatLng(b);if (c) {
        var d = c.xDiagCoord;this._showDiagramIndicator(c, d);
      }
    }
  }, _showDiagramIndicator: function _showDiagramIndicator(a, b) {
    var c = this.options;this._focusG.style("visibility", "visible"), this._mousefocus.attr("x1", b).attr("y1", 0).attr("x2", b).attr("y2", this._height()).classed("hidden", !1);var d = a.altitude,
        e = a.dist,
        f = (a.latlng, c.hoverNumber.formatter(d, c.hoverNumber.decimalsY)),
        g = c.hoverNumber.formatter(e, c.hoverNumber.decimalsX);this._focuslabelX.attr("x", b).text(f + " m"), this._focuslabelY.attr("y", this._height() - 5).attr("x", b).text(g + " km");
  }, _applyData: function _applyData() {
    var a = d3.extent(this._data, function (a) {
      return a.dist;
    }),
        b = d3.extent(this._data, function (a) {
      return a.altitude;
    }),
        c = this.options;void 0 !== c.yAxisMin && (c.yAxisMin < b[0] || c.forceAxisBounds) && (b[0] = c.yAxisMin), void 0 !== c.yAxisMax && (c.yAxisMax > b[1] || c.forceAxisBounds) && (b[1] = c.yAxisMax), this._x.domain(a), this._y.domain(b), this._areapath.datum(this._data).attr("d", this._area), this._updateAxis(), this._fullExtent = this._calculateFullExtent(this._data);
  }, _clearData: function _clearData() {
    this._data = null, this._dist = null, this._maxElevation = null;
  }, clear: function clear() {
    this._clearData(), this._areapath && (this._areapath.attr("d", "M0 0"), this._x.domain([0, 1]), this._y.domain([0, 1]), this._updateAxis());
  } }), L.control.elevation = function (a) {
  return new L.Control.Elevation(a);
};

/***/ })

/******/ });
//# sourceMappingURL=map.bundle.js.map