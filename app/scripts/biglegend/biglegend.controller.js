(function() {
  'use strict';

  function BigLegendController($scope, DecimalAdjust, Messagebus, UserAgent, PointcloudService) {
    this.settings = PointcloudService.settings;

    this.mobile = UserAgent.mobile;

    this.logarithmic = false;
    Messagebus.subscribe('logarithmicChange', function(event, value) {
      this.logarithmic = value;
      this.setLegendText();
    }.bind(this));

    this.legendText = [40, 30, 20, 10];

    //Define the legend max initial value
    this.legendMin = this.settings.heightMin;

    // Set watcher for change on the legend min setting, use it to publish changes.
    $scope.$watch('blc.legendMin', function(newValue, oldValue) {
      if (newValue === oldValue) {
        //Initialization, so we ignore this event.
      } else {
        this.setLegendText();
        this.settings.heightMin = newValue;
      }
    }.bind(this));

    //Define the legend max initial value
    this.legendMax = this.settings.heightMax;

    // Set watcher for change on the legend max setting, use it to publish changes.
    $scope.$watch('blc.legendMax', function(newValue, oldValue) {
      if (newValue === oldValue) {
        //Initialization, so we ignore this event.
      } else {
        this.setLegendText();
        this.settings.heightMax = newValue;
      }
    }.bind(this));

    Messagebus.subscribe('ncwmsPaletteSelected', function(event, value) {
      this.setOnload(value.graphic);
    }.bind(this));


    this.selectedUnits = 'meters above sea level';
    Messagebus.subscribe('ncwmsUnitsChange', function(event, value) {
      this.selectedUnits = value;
    }.bind(this));

    this.setLegendText = function() {
      var diff = this.legendMax - this.legendMin;
      var interval = 0.2 * diff;

      if (!this.logarithmic) {
        this.legendText[3] = Math.round10((this.legendMin + interval), -2);
        this.legendText[2] = Math.round10((this.legendMin + 2 * interval), -2);
        this.legendText[1] = Math.round10((this.legendMin + 3 * interval), -2);
        this.legendText[0] = Math.round10((this.legendMin + 4 * interval), -2);
      } else {
        var logmin = Math.log10(this.legendMin);
        var logmax = Math.log10(this.legendMax);

        this.legendText[3] = Math.round10((Math.pow(10, 0.8 * logmin + 0.2 * logmax)), -2);
        this.legendText[2] = Math.round10((Math.pow(10, 0.6 * logmin + 0.4 * logmax)), -2);
        this.legendText[1] = Math.round10((Math.pow(10, 0.4 * logmin + 0.6 * logmax)), -2);
        this.legendText[0] = Math.round10((Math.pow(10, 0.2 * logmin + 0.8 * logmax)), -2);
      }
    }.bind(this);

    this.setOnload = function(imgURL) {
      var context = document.getElementById('bigLegendCanvas').getContext('2d');
      var img = new Image();
      img.src = imgURL;

      img.onload = function() {
        context.canvas.width = 5;
        context.canvas.height = 255;

        context.drawImage(img, 0, 0);
      };
    };

    this.setOnload('images/rainbow_colormap.png');
  }

  angular.module('pattyApp.biglegend').controller('BigLegendController', BigLegendController);
})();
