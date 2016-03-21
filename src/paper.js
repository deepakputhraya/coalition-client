/* global paper:false*/

'use strict';

window.onload = function() {
    var canvas = document.getElementById('myCanvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);

    var path;
    var newpath;
    var pathSegments = [];
    var tool = new paper.Tool();

    var settings = {
        color: 'red',
        width: 5
    };

    tool.onMouseDrag = function(event) {
        console.log(event);
        event.point.x = event.point.x + 20;
        event.point.y = event.point.y + 20;
        path.add(event.point);
        pathSegments.push([event.point.x, event.point.y]);
    };

    tool.onMouseDown = function(event) {
        path = new paper.Path();
        path.strokeColor = settings.color? settings.color : 'black';
        path.strokeWidth = 1;
        path.add(event.point);
        console.log(event.point);
    };

    tool.onMouseUp = function() {
        // pathSegments = path.segments;
        console.log(path.segments);
        console.log(path);
        paper.project.clear();
        console.log(pathSegments);
    };

    tool.onKeyUp = function() {
        newpath = new paper.Path({
            segments: pathSegments,
            strokeWidth: 1,
            strokeColor: 'black'
        });
        // path.addSegments(pathSegments);
        path.strokeColor = 'black';

        path.smooth();
        paper.view.draw();
        console.log(newpath);
    };
};
