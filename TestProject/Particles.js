$(document).ready(function() {
    particleCollision();

    function particleCollision(){
        var Canvas = document.getElementById('canvasOne');
        var button = document.getElementById('reset');
        var checkboxColor = document.getElementById('color');
        var checkboxTrial = document.getElementById('trail');
        Canvas.addEventListener("mousedown", getPosition, false);
        button.addEventListener("click", reset);
        var context = Canvas.getContext("2d");
        var maxNumberBalls = 200 ;
        var initialNumberOfBalls = 5;
        var maxSize=7;
        var minSize=3;
        var minSpeed=1;
        var maxSpeed=8;
        var balls=[];
        var tempBall;
        var trailTimer = 0;


        for(var i = 0; i < initialNumberOfBalls; i++){
            var tempRadius = getRandomNumber(minSize, maxSize);
            var location = false;
            while (!location){
                var tempX = tempRadius * 3 + (Math.floor(Math.random() * Canvas.width) - tempRadius * 3);
                var tempY = tempRadius * 3 + (Math.floor(Math.random() * Canvas.height) - tempRadius * 3);
                var tempSpeed = getRandomNumber(minSpeed, maxSpeed);
                var tempAngle = Math.floor(Math.random() * 360);
                var tempRadians = tempAngle * Math.PI/180;
                var tempVelocityX = Math.cos(tempRadians) * tempSpeed;
                var tempVelocityY = Math.sin(tempRadians) * tempSpeed;
                var tempColour=get_random_colour();

                tempBall = {
                    x: tempX,
                    y: tempY,
                    nextX: tempX,
                    nextY: tempY,
                    radius: tempRadius,
                    speed: tempSpeed,
                    angle: tempAngle,
                    velocityX: tempVelocityX,
                    velocityY: tempVelocityY,
                    mass: tempRadius,
                    colour: tempColour
                };
                location = canStartHere(tempBall);
            }
            balls.push(tempBall);
        }

        setInterval(drawScreen, 33);

        function canStartHere(ball) {
            var retVal = true;
            for (var i = 0; i < balls.length; i += 1) {
                if (hitTestCircle(ball, balls[i])) {
                    retVal = false;
                }
            }
            return retVal;
        }

        // Circle collision test to see if two balls are touching
        // Uses nextX and nextY to test for collision before it occurs
        function hitTestCircle(ball1, ball2) {
            var retVal = false;
            var dx = ball1.nextX - ball2.nextX;
            var dy = ball1.nextY - ball2.nextY;
            var distance = (dx * dx + dy * dy);
            if (distance <= (ball1.radius + ball2.radius) * (ball1.radius + ball2.radius) ) {
                retVal = true;
            }
            return retVal;
        }

        function update() {
            for (var i = 0; i < balls.length; i += 1) {
                ball = balls[i];
                ball.nextX = (ball.x += ball.velocityX);
                ball.nextY = (ball.y += ball.velocityY);
            }
        }

        function testWalls() {
            var ball;
            var testBall;

            for (var i = 0; i < balls.length; i += 1) {
                ball = balls[i];

                if (ball.nextX + ball.radius > Canvas.width) { // right wall
                    ball.velocityX = ball.velocityX * (-1);
                    ball.nextX = Canvas.width - ball.radius;

                } else if (ball.nextX - ball.radius < 0) { // top wall
                    ball.velocityX = ball.velocityX * (-1);
                    ball.nextX = ball.radius;

                } else if (ball.nextY + ball.radius > Canvas.height) { // bottom wall
                    ball.velocityY = ball.velocityY * (-1);
                    ball.nextY = Canvas.height - ball.radius;

                } else if (ball.nextY - ball.radius < 0) { // left wall
                    ball.velocityY = ball.velocityY * (-1);
                    ball.nextY = ball.radius;
                }
            }
        }

        function collide() {
            var ball;
            var testBall;
            for (var i = 0; i < balls.length; i += 1) {
                ball = balls[i];
                for (var j = i + 1; j < balls.length; j += 1) {
                    testBall = balls[j];
                    if (hitTestCircle(ball, testBall)) {
                        collideBalls(ball, testBall);
                    }
                }
            }
        }

        function collideBalls(ball1, ball2) {
            var dx = ball1.nextX - ball2.nextX;
            var dy = ball1.nextY - ball2.nextY;
            var collisionAngle = Math.atan2(dy, dx);

            // Get velocities of each ball before collision
            var speed1 = Math.sqrt(ball1.velocityX * ball1.velocityX + ball1.velocityY * ball1.velocityY);
            var speed2 = Math.sqrt(ball2.velocityX * ball2.velocityX + ball2.velocityY * ball2.velocityY);

            // Get angles (in radians) for each ball, given current velocities
            var direction1 = Math.atan2(ball1.velocityY, ball1.velocityX);
            var direction2 = Math.atan2(ball2.velocityY, ball2.velocityX);

            // Rotate velocity vectors so we can plug into equation for conservation of momentum
            var rotatedVelocityX1 = speed1 * Math.cos(direction1 - collisionAngle);
            var rotatedVelocityY1 = speed1 * Math.sin(direction1 - collisionAngle);
            var rotatedVelocityX2 = speed2 * Math.cos(direction2 - collisionAngle);
            var rotatedVelocityY2 = speed2 * Math.sin(direction2 - collisionAngle);

            // Update actual velocities using conservation of momentum
            /* Uses the following formulas:
             velocity1 = ((mass1 - mass2) * velocity1 + 2*mass2 * velocity2) / (mass1 + mass2)
             velocity2 = ((mass2 - mass1) * velocity2 + 2*mass1 * velocity1) / (mass1 + mass2)
             */
            var finalVelocityX1 = ((ball1.mass - ball2.mass) * rotatedVelocityX1 + (ball2.mass + ball2.mass) * rotatedVelocityX2) / (ball1.mass + ball2.mass);
            var finalVelocityX2 = ((ball1.mass + ball1.mass) * rotatedVelocityX1 + (ball2.mass - ball1.mass) * rotatedVelocityX2) / (ball1.mass + ball2.mass);

            // Y velocities remain constant
            var finalVelocityY1 = rotatedVelocityY1;
            var finalVelocityY2 = rotatedVelocityY2;

            // Rotate angles back again so the collision angle is preserved
            ball1.velocityX = Math.cos(collisionAngle) * finalVelocityX1 + Math.cos(collisionAngle + Math.PI/2) * finalVelocityY1;
            ball1.velocityY = Math.sin(collisionAngle) * finalVelocityX1 + Math.sin(collisionAngle + Math.PI/2) * finalVelocityY1;
            ball2.velocityX = Math.cos(collisionAngle) * finalVelocityX2 + Math.cos(collisionAngle + Math.PI/2) * finalVelocityY2;
            ball2.velocityY = Math.sin(collisionAngle) * finalVelocityX2 + Math.sin(collisionAngle + Math.PI/2) * finalVelocityY2;

            // Update nextX and nextY for both balls so we can use them in render() or another collision
            ball1.nextX += ball1.velocityX;
            ball1.nextY += ball1.velocityY;
            ball2.nextX += ball2.velocityX;
            ball2.nextY += ball2.velocityY;
        }

        function render() {
            var ball;

            for (var i = 0; i < balls.length; i += 1) {
                ball = balls[i];
                if(checkboxColor.checked){
                    context.fillStyle = get_random_colour();
                }else{
                    context.fillStyle = ball.colour;
                }
                ball.x = ball.nextX;
                ball.y = ball.nextY;

                context.beginPath();
                context.arc(ball.x, ball.y, ball.radius, 0, Math.PI *2, true);
                context.closePath();
                context.fill();
            }
        }

        function drawScreen() {
            trailTimer++;
            // Reset canvas

            //if(trailTimer == 5){
                context.fillStyle = "#EEEEEE";
                context.fillRect(0, 0, Canvas.width, Canvas.height);
                trailTimer = 0;
            //}
            // Outside border
            context.strokeStyle = "#000000";
            context.strokeRect(1, 1, Canvas.width - 2, Canvas.height - 2);

            update();
            testWalls();
            collide();
            render();
        }

        function getPosition(event)
        {
            var x = new Number();
            var y = new Number();
            var canvas = document.getElementById("canvas");

            if (event.x != undefined && event.y != undefined){
                x = event.x;
                y = event.y;
            }else{ // Firefox method to get the position
                x = event.clientX + document.body.scrollLeft +
                    document.documentElement.scrollLeft;
                y = event.clientY + document.body.scrollTop +
                    document.documentElement.scrollTop;
            }
            var tempRadius = getRandomNumber(minSize, maxSize);
            var tempX = x;
            var tempY = y;
            var tempSpeed = getRandomNumber(minSpeed, maxSpeed);
            var tempAngle = Math.floor(Math.random() * 360);
            var tempRadians = tempAngle * Math.PI/180;
            var tempVelocityX = Math.cos(tempRadians) * tempSpeed;
            var tempVelocityY = Math.sin(tempRadians) * tempSpeed;
            var tempColour=get_random_colour();

            tempBall = {
                x: tempX,
                y: tempY,
                nextX: tempX,
                nextY: tempY,
                radius: tempRadius,
                speed: tempSpeed,
                angle: tempAngle,
                velocityX: tempVelocityX,
                velocityY: tempVelocityY,
                mass: tempRadius,
                colour: tempColour
            };
            balls.push(tempBall);
            //alert("x: " + x + "  y: " + y);
        }

        function reset() {
            balls = [];
        }

        function getRandomNumber(minVal, maxVal) {
            return Math.floor(Math.random() * (maxVal - minVal+1) + minVal);
        }

        function get_random_colour() {
            var letters = '0123456789ABCDEF'.split('');
            var colour = '#';
            for (var i = 0; i < 6; i++ ) {
                colour += letters[Math.round(Math.random() * 15)];
            }
            return colour;
        }

    }
});