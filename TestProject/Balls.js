
var ballCount = 1;
var numballs = new Array();
numballs[0] = new ball(50 , 60);

function ball(X , Y){
    this.ballX = X;
    this.ballY = Y;
}

function createBall(){
    var x=event.clientX;
    var y=event.clientY;
    numballs[1] = new ball(x, y);
}

