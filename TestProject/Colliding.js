var rectX = 20;  //initial x position of rectangle
var rectY = 30;  //initial y position of rectangle
var rectWd = 600;  // width of rectangle
var rectHt = 400; //height of rectangle


//var ballX = 50;  //initial x coordinate for the center of the ball
//var ballY = 60;  //initial y coordinate for the center of the ball
var ballRad = 10; //radius of the ball
var ballDisX = 5; //horizontal velocity of the ball
var ballDisY = 5; //vertical velocity of the ball

var rightBoundary = rectWd + rectX - ballRad;
var leftBoundary = rectX + ballRad;
var bottomBoundary = rectHt + rectY - ballRad;
var topBoundary = rectY + ballRad;

var canvas;
var context;

function init() {

    canvas = document.getElementById('my_canvas'); //find the canvas element with id my_canvas in the DOM
    context = canvas.getContext('2d'); //get the 2d drawing context of the canvas
    context.lineWidth = ballRad; //set the line width equal to the radius of the ball
    canvas.addEventListener('click', createBall, false);
    moveBall();
    setInterval(moveBall, 20);

}




function moveBall() {
    for(var i = 0; i<numballs.length; i++){
        var Xcoor = numballs[i].ballX;
        var Ycoor = numballs[i].ballY;
        context.clearRect(rectX, rectY, rectWd, rectHt);  // erase the rectangle
        //setPosition(Xcoor, Ycoor, i); //calculates the x and y position of the ball
        context.beginPath();
        context.fillStyle = "rgb(250, 50, 50)"; //set the color of the ball
        context.arc(Xcoor, Ycoor, ballRad, 0, Math.PI*2, true);// setup the coordinates for drawing the ball
        context.fill(); // draw the ball
        context.strokeRect(rectX, rectY, rectWd, rectHt); //draws the outline of rectangle
    }
}

function setPosition(X, Y, i) {

    var ballNewX = X + ballDisX; //temporary new x coordinate of the ball
    var ballNewY = Y + ballDisY; // temporary new y coordinate of the ball

    if (ballNewX > rightBoundary) { //check if the x position goes past the right boundary.

        ballNewX = rightBoundary; // set the new x position of ball to the right boundary of rectangle
        ballDisX = -ballDisX; // reverse the horizontal the velocity of the ball
    }

    if (ballNewX < leftBoundary) { // check for when the x position exceeds the left boundary.

        ballNewX = leftBoundary; // set the new x position to the left boundary of rectangle
        ballDisX = -ballDisX;  // reverse the horizontal velocity
    }

    if (ballNewY > bottomBoundary) { //check for when the y position exceeds the bottom boundary.

        ballNewY = bottomBoundary; // set the new y position to the bottom boundary
        ballDisY = -ballDisY; // reduce the vertical velocity
    }

    if (ballNewY < topBoundary) { //check for when the y position exceeds the top boundary

        ballNewY = topBoundary; //set the new y position to the top boundary
        ballDisY = -ballDisY; // reduce the vertical velocity
    }

    numballs[i].ballX = ballNewX; // set the x position of the ball to the new calculated x position
    numballs[i].ballY = ballNewY; // set the y postion of the ball to the new calculated y position
}

function change() { // changes the horizontal and vertical velocity as per user input on the form

    ballDisX = Number(f.hv.value);
    ballDisY = Number(f.hv.value);
    return false;
}
