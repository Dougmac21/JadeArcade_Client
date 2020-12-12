function BreakoutGame() {


        // (Prep game canvas)
        const canvas = document.getElementById("myCanvas");
        const ctx = canvas.getContext("2d");
        let gameIsRunning = 0;


        // (Prep paddle)
        const paddleHeight = 12;
        let paddleWidth = 85;
        let paddleColour = "black";
        let paddlePosition = (canvas.width - paddleWidth) / 2;

        // (Prep ball)
        const ballRadius = 7;
        let ballColour = "black";
        let xAxisPosition = canvas.width/2;
        let yAxisPosition = canvas.height-30;

        // (Prep ball motion)
        let xAxisPositionChange = 1.5;
        let yAxisPositionChange = -2.8;

        // (Prep control system)
        let leftKeyPressed = false;
        let rightKeyPressed = false;

        // (Prep bricks)
        let brickRowsCount = 3;
        let brickColumnsCount = 5;
        let brickWidth = 75;
        let brickHeight = 20;
        let brickPadding = 10;
        let BrickOffsetTop = 30;
        let brickOffsetLeft = 30;
        let brickColour = "black"

        let bricks = [];
        for(let column=0; column<brickColumnsCount; column++){
            bricks[column] = [];
            for (let row=0; row<brickRowsCount; row++){
                bricks[column][row] = { xAxisPosition: 0, yAxisPosition: 0, drawStatus: 1 };
            }
        };

        // (Prep score)
        let score = 0;
        let highScore = 0;
        let lives = 3;
        let timer = 0;

        // // (Prep sound)
        // let theGameMusic;
        // let theGameSound;



        //  (Set for input from controls)
        // document.addEventListener("keydown", keyDownHandler, false);
        // document.addEventListener("keyup", keyUpHandler, false);
        document.addEventListener("mousemove", mouseMovementHandler, false);

        // function startupTouch(){
        // document.addEventListener("touchstart", handleStart, false);
        // document.addEventListener("touchend", handleEnd, false);
        // document.addEventListener("touchcancel", handleCancel, false);
        // document.addEventListener("touchmove", handleMove, false);
        // }

        // document.addEventListener("DOMContentLoaded", startupTouch);

        // let ongoingTouchInputs = [];

        // touch control function here


        // function keyDownHandler(event){
        //     if (event.key == "Right" || event.key == "ArrowRight"){
        //         rightKeyPressed = true;
        //     }
        //     else if (event.key == "Left" || event.key == "ArrowLeft"){
        //         leftKeyPressed = true;
        //     }
        // };

        // function keyUpHandler(event){
        //     if (event.key == "Right" || event.key == "ArrowRight"){
        //         rightKeyPressed = false;
        //     }
        //     else if (event.key == "Left" || event.key == "ArrowLeft"){
        //         leftKeyPressed = false;
        //     }
        // };

        function mouseMovementHandler(event){
            let paddleXAxis = event.clientX - canvas.offsetLeft;
            if(paddleXAxis > 0 && paddleXAxis < canvas.width){
                paddlePosition = paddleXAxis - paddleWidth/2;
            }
        }



        // (Draw paddle)
        function createPaddle(){
            ctx.beginPath();
            ctx.rect(paddlePosition, canvas.height - paddleHeight, paddleWidth, paddleHeight);
            ctx.fillStyle = paddleColour;
            ctx.fill();
            ctx.closePath();
        };
     
        // (Draw ball)
        function createBall() {
            ctx.beginPath();
            ctx.arc(xAxisPosition, yAxisPosition, ballRadius, 0, Math.PI*2);
            ctx.fillStyle = ballColour;
            ctx.fill();
            ctx.closePath();
        };

        // (Draw bricks)
        function createBricks(){
            for(let column=0; column < brickColumnsCount; column++){
                for(let row=0; row < brickRowsCount; row++){
                    if(bricks[column][row].drawStatus === 1){
                        let brickXAxisPlacement = (column * (brickWidth+brickPadding)) + brickOffsetLeft;
                        let brickYAxisPlacement = (row * (brickHeight+brickPadding)) + BrickOffsetTop;
                        bricks[column][row].xAxisPosition = brickXAxisPlacement;
                        bricks[column][row].yAxisPosition = brickYAxisPlacement;
                        ctx.beginPath();
                        ctx.rect(brickXAxisPlacement, brickYAxisPlacement, brickWidth, brickHeight);
                        ctx.fillStyle = brickColour;
                        ctx.fill();
                        ctx.closePath();
                    }
                }
            }
        };

        // (Draw score)
        function drawscore(){
            ctx.font = "16px Ariel";
            ctx.fillStyle = "black";
            ctx.fillText("Score: " + score, 8, 20);
        }

        // (Draw lives)
        function drawLives(){
            ctx.font = "16px Ariel";
            ctx.fillStyle = "black";
            ctx.fillText("Lives: " + lives, canvas.width-65, 20);
        }

        // (Draw timer)
        function drawTimer(){
            ctx.font = "16px Ariel";
            ctx.fillstyle = "black";
            ctx.filltext("Gametime: " + timer, 40, 20);
        }



        // (Change ball angle of motion and accellerate on contact with paddle)
        // (Change in motion biases towards greater horizontal motion to stop game becoming too hard)
        function alterBallAngle(){
            xAxisPositionChange = xAxisPositionChange * (1.04 + (1.27 * Math.floor(Math.random())));
            yAxisPositionChange = yAxisPositionChange * (1.01 + (1.09 * Math.floor(Math.random())));
        }

        // (Ball-Brick Collision Detection)
        function ballBrickCollisionDetection(){
            for(let column=0; column<brickColumnsCount; column++){
                for(let row=0; row<brickRowsCount; row++){
                    let brickObject = bricks[column][row];
                    if(brickObject.drawStatus === 1){
                        if(xAxisPosition > brickObject.xAxisPosition && xAxisPosition < brickObject.xAxisPosition+brickWidth
                        && yAxisPosition > brickObject.yAxisPosition && yAxisPosition < brickObject.yAxisPosition+brickHeight){
                        yAxisPositionChange = -yAxisPositionChange;
                        brickObject.drawStatus = 0;         // (removes brick from render array)
                        xAxisPositionChange *=1.06;         // (speeds up ball)
                        yAxisPositionChange *=1.11;         // (speeds up ball)
                        ballColourController();
                        brickColourController();
                        bounceSound();
                        score++;
                        if (score === 15){
                            setHighScore(score);
                            alert("                  YOU WIN! \nYOU SMASHED ALL " + (brickRowsCount*brickColumnsCount) + " BRICKS!");
                            gameIsRunning = 0;
                            document.location.reload();
                        }
                        }
                    }
                }
            }
        }


        // (Random colour selector)
        function randomColourGenerator(){
            const hexChars = "ABCDEF0123456789";
            let hexColourCode = '#';
            for (let i = 0; i < 6; i++){
                hexColourCode += hexChars[Math.floor(Math.random() * 16)];
            }
            return hexColourCode;
        };
        
        // (Ball to change colour on wall bounce)
        function ballColourController(){
            if (score >= 5){
                ballColour = randomColourGenerator();
            }
        };

        // (Bricks to change colour on wall bounce)
        function brickColourController(){
            if (score >= 10){
                brickColour = randomColourGenerator();
            }
        };

        // (Paddle to strobe at 14/15 bricks destroyed)
        function paddleColourController(){
            if (score >= 14){
                paddleColour = randomColourGenerator();
            }
        };

        // (Play sound effects)

        let audioContext = new AudioContext();

        function generateSound(amplitude, frequency, duration) {          //amplitude from 0 to 100, frequency in Hz, duration in milliseconds
            if (!audioContext) return;
            let oscillator = audioContext.createOscillator();
            let gain = audioContext.createGain();
            oscillator.connect(gain);
            oscillator.value = frequency;
            gain.connect(audioContext.destination);
            gain.gain.value = amplitude/100;
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime+duration/1000);
        }

        function bounceSound(){
            generateSound(80, 120, 90);
        };


        // (Render game)
        function renderGame(){
            // (Create game elements)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            createBricks();
            createBall();
            createPaddle();
            ballBrickCollisionDetection();
            drawscore();
            drawLives();
            paddleColourController();
            
            // (Configuration of ball movement)
            xAxisPosition += xAxisPositionChange;
            yAxisPosition += yAxisPositionChange;
            
            if (xAxisPosition + xAxisPositionChange > canvas.width - ballRadius || xAxisPosition + xAxisPositionChange < ballRadius){
            xAxisPositionChange = -xAxisPositionChange;
            ballColourController();
            brickColourController();
            bounceSound();
            }

            if (yAxisPosition + yAxisPositionChange < ballRadius){
            yAxisPositionChange = -yAxisPositionChange;
            ballColourController();
            brickColourController();
            bounceSound();

            } else if (yAxisPosition + yAxisPositionChange > canvas.height - ballRadius){
                if (xAxisPosition > paddlePosition && xAxisPosition < paddlePosition + paddleWidth){
                    yAxisPositionChange = -yAxisPositionChange;
                    ballColourController();
                    brickColourController();
                    bounceSound();
                    alterBallAngle();
                }
                else {
                    lives--;
                    if(lives === 0){
                        setHighScore(score);
                        setTimer();
                        document.getElementById("alert");
                        alert("  GAME OVER \nYOU SCORED " + score);
                        gameIsRunning = 0;
                        document.location.reload();
                    }
                    else{
                        xAxisPosition = canvas.width/2;
                        yAxisPosition = canvas.height-30;
                        xAxisPositionChange = 1.5;
                        yAxisPositionChange = -2.8;
                        paddlePosition = (canvas.width-paddleWidth)/2;
                    }
                }
            }

            // (Parameters for paddle movement by keypress)
            if (rightKeyPressed){
                paddlePosition += 8;
                if (paddlePosition + paddleWidth > canvas.width){
                    paddlePosition = canvas.width - paddleWidth;
                }
            }

            else if (leftKeyPressed){
                paddlePosition -= 8;
                if (paddlePosition < 0){
                    paddlePosition = 0;
                }
            }

            requestAnimationFrame(renderGame);
        };

        function runTimer(){
            timer = 1;
        }

        function setTimer(){
            timer = 2;
        }

        function setHighScore(scoreToSet){
            highScore = scoreToSet
        }


        // (Run game)
        function playGame(){
            if (gameIsRunning === 0){
                gameIsRunning = 1;
                runTimer();
                renderGame();
            }
        };


};

export default BreakoutGame;