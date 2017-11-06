/**
 * Created by Crofty on 11/6/17.
 */

// set up "canvas"

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//get height and width canvas element

var width = canvas.width;
var height = canvas.height;

//calculate height and width in block

var blockSize = 10;
var widthInBlocks = width/blockSize;
var heightInBlocks = height/blockSize;

//set score 0

var score =0;

//draw frame

var drawBorder = function () {
    ctx.fillStyle ="Gray";
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize,width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
};

//show score on left top corner

var drawScore = function () {
    ctx.font = "20px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + score, blockSize, blockSize);
};

//cancel "setInterval" and show text "Game over"

var gameOver = function () {
    clearInterval(intervalId);
    ctx.font = "60px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game over", width / 2, height / 2);
};

//draw circle

var circle = function (x, y, radius, fillCircle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle){
        ctx.fill();
    } else {
        ctx.stroke();
    }
};

//set constructor Block

var Block = function (col, row) {
    this.col = col;
    this.row = row;
};

//draw square in block position

Block.prototype.drawSquare = function (color) {
    var x = this.col * blockSize;
    var y = this.row * blockSize;
    ctx.fillStyle = color;
    ctxfillRect(x, y, blockSize, blockSize);
};

//draw circle in block position

Block.prototype.drawCircle = function (color) {
    var centerX = this.col * blockSize + blockSize / 2;
    var centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize/2, true);
};

//otherBlock

Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row ===otherBlock.row;
};

//set constructor Snake

var Snake = function () {
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ];
    this.direction = "right";
    this.nextDirection = "right";
};

//draw square for snake body

Snake.prototype.draw = function () {
    for (var i = 0; i < this.segments.length; i++ ){
        this.segments[i].drawSquare("Blue");
    }
};

//when snake eats apple,becomes longer
//give length at the begining,in such a way give current direction

  Snake.prototype.move = function () {
      var head = this.segments[0];
      var newHead;

      this.direction = this.nextDirection;

      if(this.direction === "right"){
          newHead = new Block(head.col + 1, head.row);
      } else if (this.direction === "down") {
          newHead = new Block(head.col, head.row + 1);
      } else if (this.direction === "left") {
          newHead = new Block(head.col - 1, head.row);
      } else if (this.direction === "up"){
          newHead = new Block(head.col, head.row - 1);
      }

      if (this.checkCollision(newHead)){
          gameOver();
          return;
      }

      this.segments.unshift(newHead);
      if (newHead.equal(apple.position)) {
          score++;
          apple.move();
      } else {
          this.segments.pop();
      }
  };

  //check if snake doesn't hit with the wall or its body

  Snake.prototype.checkCollision = function (head) {
      var  leftCollision = (head.col === 0);
      var  topCollision = (head.row === 0);
      var  rightCollision = (head.col === widthInBlocks - 1);
      var  bottomCollision = (head.col === heightInBlocks -1);

      var wallCollision = leftCollision || topCollision ||
              rightCollision || bottomCollision;

      var selfCollision = false;

      for (var i = 0; i < this.segments.length; i++){
          if (head.equal(this.segments[i])){
              selfCollision = true;
          }
      }

      return wallCollision || selfCollision;
  };

  //set direction to snake with the help of keyboard

  Snake.prototype.setDirection = function (newDirection) {
      if (this.direction === "up" && newDirection === "down") {
          return;
      }

      if (this.direction === "right" && newDirection === "left") {
          return;
      }

      if (this.direction === "down" && newDirection === "up") {
          return;
      }

      if (this.direction === "left" && newDirection === "right") {
          return;
      }

      this.nextDirection = newDirection;

  };

  //set constructor apple

   var Apple = function () {
       this.position = new Block(10, 10);
   };

   //draw circle in apple position

   Apple.prototype.draw = function () {
       this.position.drawCircle("LimeGreen");
   };

   //put apple in rando position

   Apple.prototype.move = function () {
       var randomCol = Math.floor(Math.random() * (widthInBlocks -2)) +1;
       var randomRow = Math.floor(Math.random() * (heightInBlocks -2)) +1;
       this.position = new Block(randomCol, randomRow);
   };

   //create object-snake and object-apple

   var snake = new Snake();
   var apple = new Apple();

   //launch function animation with setInterval

   var intervalId = setInterval(function () {
       ctx.clearRect(0, 0, width, height);
       drawScore();
       snake.move();
       snake.draw();
       apple.draw();
       drawBorder();
   }, 100);

   //transform event handler keydown

   $("body").keydown(function (event) {
       var newDirection = directions[event.keyCode];

       if(newDirection !== undefined){
           snake.setDirection(newDirection);
       }

   });