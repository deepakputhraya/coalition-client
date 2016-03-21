'use strict';

export function CanvasDirective() {
  'ngInject';

  let directive = {
    restrict: 'AE',
    templateUrl: 'app/components/canvas/canvas.html',
    controller: CanvasController,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;
}

class CanvasController {
  constructor (paper, $scope, channel) {
    'ngInject';
    var _this = this;
    this.paper = paper;
    this.data = channel.data;

    var canvas = document.getElementById('myCanvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);
    var path;
    var pathSegments = [];
    var tool = new paper.Tool();
    this.settings = {
        color: 'red',
        width: 5
    };

    tool.onMouseDrag = function(event) {
        path.add(event.point);
        pathSegments.push([event.point.x, event.point.y]);
    };

    tool.onMouseDown = function(event) {
        path = new paper.Path();
        path.strokeColor = _this.settings.color? _this.settings.color : 'black';
        path.strokeWidth = _this.settings.width? _this.settings.width: 1;
        path.add(event.point);
        pathSegments.push([event.point.x, event.point.y]);
    };

    tool.onMouseUp = function() {
        // pathSegments = path.segments;
        channel.publishCanvas({
            username: _this.data.username,
            segments: pathSegments,
            width: _this.settings.width,
            color: _this.settings.color
        });
        pathSegments = [];
    };

    this.onCanvasActivity = function(canvas) {
        let newpath = new _this.paper.Path({
            segments: canvas.segments,
            strokeWidth: canvas.width,
            strokeColor: canvas.color
        });
    };

    channel.setCanvasEventHandler(_this.onCanvasActivity);


  }

  clearCanvas() {
      this.paper.project.clear();
  }

}
