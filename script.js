let start = document.getElementById("start");
let retry = document.getElementById("retry");
let death = document.querySelector(".death");
start.addEventListener("click" , startGame);
retry.addEventListener("click" , startGame);
let size = 20;
let char_speed = 5;
let score = 0;

function startGame() {
    myGamePiece = new Component(size , size , "white" , 200 , 200);
    myFruit = new Component(size , size , "green" , Math.random()*myGameArea.canvas.width , Math.random()*myGameArea.canvas.height);
    myScore = new Component("30px", "Consolas", "blue", window.innerWidth*6/7, window.innerHeight/15, "text");
    if(death.classList.contains("died")){
        death.classList.remove("died");
    }
    myGameArea.start();
}

 
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        
        this.interval = setInterval(updateGameArea , 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown") 
        })

        window.addEventListener('keyup' , function(e){
            myGameArea.keys[e.keyCode] = (e.type == "keydown") 
        })

    },
    clear : function(){
        this.context.clearRect(0 , 0 , this.canvas.width , this.canvas.height);
    },
    stop : function(){
        death.classList.add("died");
        clearInterval(this.interval);
    }
}

function drawpart(snakepart){
    myGameArea.context.fillStyle = "white";
    myGameArea.context.fillRect(snakepart.x , snakepart.y , size , size);
}

function Component(width , height , color , x , y  , type){
    this.color = color;
    this.type = type;
    this.gamearea = myGameArea;
    this.x = x;
    this.y = y;
    this.speedX = char_speed;
    this.speedY = 0;
    this.length = 0;
    this.positions = [{x: 200, y: 200},
        {x: 190, y: 200},
        {x: 180, y: 200},
        {x: 170, y: 200},
        {x: 160, y: 200},
        {x: 150, y: 200},
        {x: 140, y: 200},
        {x: 130, y: 200},
        {x: 120, y: 200},
        {x: 110, y: 200},
        {x: 100, y: 200},
        {x: 90, y: 200}];
    this.width = width;
    this.height = height;
    this.update = function(){
        ctx = myGameArea.context; 
        if(this.type === "text"){
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text , this.x , this.y );
        }else{
        ctx.fillStyle = color;
        if(this.color === "green"){
            ctx.fillRect(this.x , this.y , this.width , this.height);
        }else if(this.color === "white"){
            this.positions.forEach(drawpart);
        }
    }
    },
    this.newpos = function(){
        this.width += this.length * width;
        this.x += this.speedX;
        this.y += this.speedY;
        let head = {x:this.x , y : this.y  };
        this.positions.unshift(head);
    },
    this.crashBorder = function(){
        var left = this.x;
        var right = this.x + this.width;
        var top = this.y;
        var bottom = this.y + this.height    

        let crash = false;
        if((left < 0) || (right > this.gamearea.canvas.width) || (top < 0) || (bottom > this.gamearea.canvas.height)){
            crash = true;
        }
        return crash;
    },
    this.eat = function(fruit){
        var left = this.x;
        var right = this.x + this.width;
        var top = this.y;
        var bottom = this.y + this.height;      
        var fruit_left = fruit.x;
        var fruit_right = fruit.x + fruit.width;
        var fruit_top = fruit.y;
        var fruit_bottom = fruit.y + fruit.height;    
        //console.log(fruit);  
        //console.log(this);  

        let eaten = false;
        if (
            this.x < fruit.x + fruit.width &&
            this.x + this.width > fruit.x &&
            this.y < fruit.y + fruit.height &&
            this.height + this.y > fruit.y
          ) {
            // Collision detected!
            eaten =  true;
          }
        return eaten;
    }
    
    
}

function check_movement(){
    
    if(myGameArea.keys && myGameArea.keys[37] && myGamePiece.speedX == 0){myGamePiece.speedX = -char_speed ; myGamePiece.speedY = 0}
    if(myGameArea.keys && myGameArea.keys[38] && myGamePiece.speedY == 0){myGamePiece.speedY = -char_speed ; myGamePiece.speedX = 0}
    if(myGameArea.keys && myGameArea.keys[39] && myGamePiece.speedX == 0){myGamePiece.speedX = char_speed; myGamePiece.speedY = 0}
    if(myGameArea.keys && myGameArea.keys[40] && myGamePiece.speedY == 0){myGamePiece.speedY = char_speed; myGamePiece.speedX = 0}
    myGamePiece.newpos();
}

function updateGameArea(){
    myGamePiece.length = 0;
    if(myGamePiece.crashBorder()){
        myGameArea.stop();
    }
    for (let i = 1; i < myGamePiece.positions.length; i++) {
        if (myGamePiece.positions[i].x === myGamePiece.positions[0].x && myGamePiece.positions[i].y === myGamePiece.positions[0].y)
           {
            // Collision detected!
            myGameArea.stop();
          }
    }
    check_movement();  
    if(myGamePiece.eat(myFruit)){
        score += 1;
        delete myFruit;
        myFruit = new Component(size , size , "green" , Math.random()*myGameArea.canvas.width , Math.random()*myGameArea.canvas.height/2);
        myFruit.update();
    }else{
        myGamePiece.positions.pop();
    }
    myGameArea.clear();
    myGamePiece.update();
    myScore.text = "Score : " + score;
    myScore.update();
    myFruit.update();
}