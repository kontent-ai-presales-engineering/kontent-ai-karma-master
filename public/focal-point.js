/**
  Small plugin to set the focal point of a background image
**/
var Focal = {
  /**
    Set variables
  **/
  init: function (value) {
    Focal.picker = $('#focal-img'); // image to click
    Focal.point = $('#point'); // cyan focal dot
    Focal.background = $('#background-container'); // where background element is applied
    Focal.controls = $(".control"); // control to toggle between desktop, mobile and tablet
    Focal.viewport = $('.viewport'); // viewport to switch between screen sizes
    Focal.results = $('.results');
    try {
      const obj = JSON.parse(value);
      Focal.x = obj.fpX * 100 + '%'; // x background position
      Focal.y = obj.fpY * 100 + '%'; // y background position;
      this.setCustomFocalPoint(obj);
    } catch (error) {
      console.error(error);
      Focal.x = '0%'; // x background position
      Focal.y = '0%'; // y background position
    }
    Focal.setEventListeners();
  },

  /**
    Event Listeners
  **/
  setEventListeners: function () {
    Focal.picker.on('click', this.setFocalPoint);
    Focal.point.draggable({
      cursor: "move",
      drag: this.dragging,
      containment: "#picker"
    });
    Focal.controls.on('click', this.changeViewport);
  },

  setCustomFocalPoint: function (obj) {
    Focal.point.css({
      top: obj.pointYOffset,
      left: obj.pointXOffset,
    });

    Focal.x = obj.fpX * 100;
    Focal.y = obj.fpY * 100;

    Focal.background.css('background-position', Focal.x + "% " + Focal.y + "%");
    Focal.updateResults();
  },
  /**
    Move the focal point 
  **/
  setFocalPoint: function (e) {
    var pointYOffset = e.offsetY - Focal.point.height() / 2,
      pointXOffset = e.offsetX - Focal.point.width() / 2;
    Focal.point.css({
      top: pointYOffset,
      left: pointXOffset,
    });
    Focal.x = Math.round((e.pageY - $(this).offset().top) / Focal.picker.height() * 100);
    Focal.y = Math.round((e.pageX - $(this).offset().left) / Focal.picker.width() * 100);


    Focal.background.css('background-position', Focal.x + "% " + Focal.y + "%");
    Focal.updateResults();
    CustomElement.setValue(JSON.stringify({ fpX: Focal.x / 100, fpY: Focal.y / 100, pointYOffset: pointYOffset, pointXOffset: pointXOffset }));

  },

  /**
    Move focal point and background position when dragging point
  **/
  dragging: function (e) {
    Focal.x = Math.round(e.target.offsetLeft / Focal.picker.width() * 100);
    Focal.y = Math.round(e.target.offsetTop / Focal.picker.height() * 100);

    Focal.background.css('background-position', Focal.x + "% " + Focal.y + "%");
    Focal.updateResults();
    CustomElement.setValue(JSON.stringify({ fpX: Focal.x / 100, fpY: Focal.y / 100 }));
  },

  /**
    Toggle viewport size
  **/
  changeViewport: function (e) {
    var type = $(this).attr('id');
    Focal.viewport
      .removeClass('desktop')
      .removeClass('mobile')
      .removeClass('tablet')
      .addClass(type);
    Focal.controls.removeClass('active');
    $(this).addClass('active');
  },

  /**
    Update Results tag
  **/
  updateResults: function () {
    Focal.results.text('Position: ' + Focal.x + '% ' + Focal.y + "%");
  },
};