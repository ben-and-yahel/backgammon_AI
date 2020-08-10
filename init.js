function dynamicallyLoadScript(url) {
    var script = document.createElement("script");  // create a script DOM node
    script.src = url;  // set its src to the provided URL
    document.body.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}

window.onload =function() {

    // document.addEventListener("keypress",draw_path);
    // document.onctxmenu = onClick;
    // document.onmousedown = onClick;
    canv=document.getElementById("gc");
    ctx = canv.getContext("2d");
    //TODO: make the canvas size change according to window size
    ctx.canvas.width  = 940;
    ctx.canvas.height = 920 - strap_height;
    init();
    
}
strap_height = 40;
board = [];
radius = 0;
currTile = Object;
cubes = [Object, Object];
turn = "white";

class Tile{
    constructor(color, x = 0, y = 0){
        this.color = color;
        this.x = x;
        this.y = y;
        this.glow = false;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y- radius*2, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        //glowing effect
        if(this.glow)
        {
            ctx.shadowBlur = 50;
            ctx.shadowColor = "gray";
        }
        else //stop glowing effect
        {
            ctx.shadowBlur = 0;
            ctx.shadowColor = "black";
        }
        
        ctx.fill();
        ctx.closePath();
    }
}
class Triangle{
    constructor(tiles = [], color="black", inverted=false, x = 0, y = 0){
        this.color = color;
        this.x = x;
        this.y = y;
        this.inverted = inverted;
        this.glow = false;
        this.sign = false;
        
        this.frame_size = 20;
        this.width = ctx.canvas.width;
        this.width = this.width/ 15.12903225806452;
        this.height = 200;
        this.tiles = tiles;
        this.length = tiles.length;
    }
    draw(){
        let height_parameter = this.height * Math.cos(Math.PI / 6);

        if (this.inverted) {
            height_parameter *= -1;
            this.y = this.frame_size+ 5;
        }
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x+this.width, this.y);
        ctx.lineTo(this.x+this.width/2, this.y - height_parameter);
        ctx.closePath();

        // the outline
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#666666';
        ctx.stroke();

        // the fill color
        ctx.fillStyle = this.sign ? '#666666':this.color;
        ctx.fill();
    }
}

class Cube{
    constructor(state, seperate_x=0){
        this.state = state;
        this.cubeX = ctx.canvas.width/4 + seperate_x; // for the second cube
        this.cubeY = ctx.canvas.height/2;
        this.cueb_size = 40;
    }
    stageOne(){
        ctx.beginPath();
        ctx.arc(this.cubeX + this.cueb_size/2, this.cubeY + this.cueb_size/2, 2, 0, 2 * Math.PI, false);
        
        ctx.fill();
        ctx.closePath();
    }
    stageTwo(){
        ctx.beginPath();
        ctx.arc(this.cubeX + this.cueb_size*0.2, this.cubeY + this.cueb_size*0.2, 2, 0, 2 * Math.PI, false);
        ctx.arc(this.cubeX + this.cueb_size*0.8, this.cubeY + this.cueb_size*0.8, 2, 0, 2 * Math.PI, false);
        
        ctx.fill();
        ctx.closePath();
    }
    stageThree(){
        ctx.beginPath();
        ctx.arc(this.cubeX + this.cueb_size/2, this.cubeY + this.cueb_size/2, 2, 0, 2 * Math.PI, false);
        ctx.arc(this.cubeX + this.cueb_size*0.2, this.cubeY + this.cueb_size*0.2, 2, 0, 2 * Math.PI, false);
        ctx.arc(this.cubeX + this.cueb_size*0.8, this.cubeY + this.cueb_size*0.8, 2, 0, 2 * Math.PI, false);
   
        ctx.fill();
        ctx.closePath();
    }
    stageFour(){
        ctx.beginPath();
        ctx.arc(this.cubeX + this.cueb_size*0.8, this.cubeY + this.cueb_size*0.2, 2, 0, 2 * Math.PI, false);
        ctx.arc(this.cubeX + this.cueb_size*0.8, this.cubeY + this.cueb_size*0.8, 2, 0, 2 * Math.PI, false);

        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.cubeX + this.cueb_size*0.2, this.cubeY + this.cueb_size*0.2, 2, 0, 2 * Math.PI, false);
        ctx.arc(this.cubeX + this.cueb_size*0.2, this.cubeY + this.cueb_size*0.8, 2, 0, 2 * Math.PI, false);

        ctx.fill();
        ctx.closePath();
    }
    stageFive(){
        ctx.beginPath();
        ctx.arc(this.cubeX + this.cueb_size*0.8, this.cubeY + this.cueb_size*0.2, 2, 0, 2 * Math.PI, false);
        ctx.arc(this.cubeX + this.cueb_size*0.8, this.cubeY + this.cueb_size*0.8, 2, 0, 2 * Math.PI, false);

        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.cubeX + this.cueb_size*0.2, this.cubeY + this.cueb_size*0.2, 2, 0, 2 * Math.PI, false);
        ctx.arc(this.cubeX + this.cueb_size*0.2, this.cubeY + this.cueb_size*0.8, 2, 0, 2 * Math.PI, false);
        

        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.cubeX + this.cueb_size/2, this.cubeY + this.cueb_size/2, 2, 0, 2 * Math.PI, false);

        ctx.fill();
        ctx.closePath();
    }
    stageSix(){
        ctx.beginPath();
        ctx.arc(this.cubeX + this.cueb_size*0.8, this.cubeY + this.cueb_size*0.2, 2, 0, 2 * Math.PI, false);
        ctx.arc(this.cubeX + this.cueb_size*0.8, this.cubeY + this.cueb_size*0.8, 2, 0, 2 * Math.PI, false);

        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.cubeX + this.cueb_size*0.2, this.cubeY + this.cueb_size*0.2, 2, 0, 2 * Math.PI, false);
        ctx.arc(this.cubeX + this.cueb_size*0.2, this.cubeY + this.cueb_size*0.8, 2, 0, 2 * Math.PI, false);
        

        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.cubeX + this.cueb_size*0.2, this.cubeY + this.cueb_size/2, 2, 0, 2 * Math.PI, false);
        ctx.arc(this.cubeX + this.cueb_size*0.8, this.cubeY + this.cueb_size/2, 2, 0, 2 * Math.PI, false);

        ctx.fill();
        ctx.closePath();
    }
    shuffle(){
        this.state =Math.floor(Math.random() * 6) + 1;
    }
    draw(){
        ctx.fillStyle = "white";
        ctx.fillRect(this.cubeX, this.cubeY, this.cueb_size, this.cueb_size);
        ctx.strokeStyle = "black";
        ctx.lineWidth   = 2;
        ctx.strokeRect(this.cubeX, this.cubeY, this.cueb_size, this.cueb_size);
        ctx.fillStyle = "black";
        switch (this.state) {
            case 1:
                this.stageOne();
                break;
            case 2:
                this.stageTwo();
                break;
            case 3:
                this.stageThree();
                break;
            case 4:
                this.stageFour();
                break;
            case 5:
                this.stageFive();
                break;
            case 6:
                this.stageSix();
                break;
        
            default:
                break;
        }
    }
}
function validMove(number) {
    if (number > 24 || number < 0) {
        return false;
    }
    if (board[number].length == 0) {
        return true;
    }
    if(board[number].tiles[0].color == "black" && currTile.color == "white")
    {
        return false;
    }
    if(board[number].tiles[0].color == "white" && currTile.color == "black")
    {
        return false;
    }
    return true;
}
function move(tiles_x ,tiles_y) {
    minus = 1;
    if (currTile.color == "black") {
        minus = -1;
    }
    succseed = 0;
    moves = [];
    moves[0] = tiles_x + (cubes[0].state) * minus;
    moves[1] = tiles_x + (cubes[1].state) * minus;
    moves[2] = tiles_x + (cubes[0].state + cubes[1].state) * minus;
    for (let i = 0; i < moves.length; i++) {
        if(validMove(moves[i]) == false)
            continue;
        if(i==2 && succseed == 0)
            break
        board[moves[i]].sign = true;
        board[moves[i]].draw();
        succseed++;
    }
}

function mouseClick(e) {
    let mouse_x = event.clientX;
    let mouse_y = event.clientY;

    for (let tiles_x = 0; tiles_x < board.length; tiles_x++) {
        if(board[tiles_x].tiles == [])
            continue;
        for (let tiles_y = 0; tiles_y < board[tiles_x].length; tiles_y++) {
            if(board[tiles_x].tiles[tiles_y] == currTile && currTile.color == "gray")
                continue;
            if (mouse_x >= board[tiles_x].tiles[tiles_y].x - radius && mouse_x <= board[tiles_x].tiles[tiles_y].x + radius) {
            if (mouse_y >= board[tiles_x].tiles[tiles_y].y - radius && mouse_y <= board[tiles_x].tiles[tiles_y].y + radius) {


                move(tiles_x ,tiles_y);
                currTile.color = "gray";
                currTile.draw();
                }
            }
        }
    }        
}

function mouse(e) {
    let mouse_x = event.clientX;
    let mouse_y = event.clientY;

    for (let tiles_x = 0; tiles_x < board.length; tiles_x++) {
        if(board[tiles_x].tiles == [])
            continue;
        for (let tiles_y = 0; tiles_y < board[tiles_x].length; tiles_y++) {
            if(board[tiles_x].tiles[tiles_y] == currTile)
                continue;
            if (mouse_x >= board[tiles_x].tiles[tiles_y].x - radius && mouse_x <= board[tiles_x].tiles[tiles_y].x + radius) {
            if (mouse_y >= board[tiles_x].tiles[tiles_y].y - radius && mouse_y <= board[tiles_x].tiles[tiles_y].y + radius) {
                console.log("hover");
                if (currTile.glow == true) {
                    currTile.glow = false;
                    //currTile.draw();
                }
                currTile = board[tiles_x].tiles[tiles_y];
                currTile.glow = true;
                print_board(board);
                
                }
            }
        }
    }
}
// ----------------init functions--------------------
function init() {
    //makes the board
    board.push(new Triangle([new Tile("white", 0), new Tile("white", 0)]));
    board.push(new Triangle([], "red"));
    board.push(new Triangle());
    board.push(new Triangle([], "red"));
    board.push(new Triangle());
    board.push(new Triangle([new Tile("black", 0), new Tile("black", 0), new Tile("black", 0), new Tile("black", 0), new Tile("black", 0)], "red"));
    board.push(new Triangle());
    board.push(new Triangle([new Tile("black", 0), new Tile("black", 0), new Tile("black", 0)], "red"));
    board.push(new Triangle());
    board.push(new Triangle([], "red"));
    board.push(new Triangle());
    board.push(new Triangle([new Tile("white", 0), new Tile("white", 0), new Tile("white", 0), new Tile("white", 0), new Tile("white", 0)], "red"));
    board.push(new Triangle([new Tile("black", 0), new Tile("black", 0), new Tile("black", 0), new Tile("black", 0), new Tile("black", 0)]));
    board.push(new Triangle([], "red"));
    board.push(new Triangle());
    board.push(new Triangle([], "red"));
    board.push(new Triangle([new Tile("white", 0), new Tile("white", 0), new Tile("white", 0)]));
    board.push(new Triangle([], "red"));
    board.push(new Triangle([new Tile("white", 0), new Tile("white", 0), new Tile("white", 0), new Tile("white", 0), new Tile("white", 0)]));
    board.push(new Triangle([], "red"));
    board.push(new Triangle());
    board.push(new Triangle([], "red"));
    board.push(new Triangle());
    board.push(new Triangle([new Tile("black", 0), new Tile("black", 0)], "red"));
    
    cubes[1] = new Cube(Math.floor(Math.random() * 6) + 1, 50);
    cubes[0] = new Cube(Math.floor(Math.random() * 6) + 1, 0);
    
    init_Triangels();
    print_board(board);
    

}
frame_size = 20;
X_seperate = 8;
function init_Triangels() {
    let x = frame_size + X_seperate;
    let y = ctx.canvas.height-frame_size - 5; // 5 for seperation
    let width =  ctx.canvas.width;
    width = width/ 15.12903225806452; // TODO : change the formula
    const height = 200;
    color = "black";
    for (let i = 0; i < 12; i++) {
        board[i].x = x;
        board[i].y = y;
        
        x += width + X_seperate+5;
        //board[i].color = board[i].color == "black" ? "red" : "black";           
    }
    x = frame_size + X_seperate;
    //color = color == "black" ? "red" : "black";
    for (let i = 12; i < 24; i++) {
        board[i].x = x;
        board[i].y = y;
        board[i].inverted = true;
        x += width + X_seperate+5;
        //board[i].color = board[i].color == "black" ? "red" : "black";      
    }
}
function print_board(board)
{
    ctx.shadowBlur = 0;//stop glowing effect
    ctx.shadowColor = "black";
    //------------------------drawing the frame----------------
    
    
    Y_seperate = 15;
    ctx.fillStyle = "#ff9900";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#cc6600";
    ctx.fillRect(0, 0, ctx.canvas.width, frame_size);
    ctx.fillRect(0, 0, frame_size, ctx.canvas.height);
    ctx.fillRect(0, ctx.canvas.height-frame_size, ctx.canvas.width, frame_size);
    ctx.fillRect(ctx.canvas.width-frame_size, 0, frame_size, ctx.canvas.height);
   
    ctx.fillRect((ctx.canvas.width/2)-3, 0, 8 , ctx.canvas.height);

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(frame_size, frame_size);
    ctx.stroke();

    //------------------------drawing the cubes----------------
    cubes[0].draw();
    cubes[1].draw();


    //------------------------drawing the triangels----------------
    
    for (let i = 0; i < board.length; i++) {
        board[i].draw();
    }

    //------------------------drawing the tiles----------------
    radius = board[0].width*0.5;
    x = frame_size + X_seperate + 30;
    y = ctx.canvas.height- frame_size*2 - Y_seperate;//864
    save_j = 0;
    for (let i = 0; i < board.length/2; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i].tiles == []) {
                continue;
            }
            board[i].tiles[j].x = x;
            board[i].tiles[j].y = y + radius*2;
            board[i].tiles[j].draw();
            //draw_tile(x, y, radius, board[i][j].color);
            y -= radius*2;
           
        }
        y = ctx.canvas.height- frame_size*2 - Y_seperate;
        x +=  board[0].width + X_seperate + 5;
    }
    x = frame_size + X_seperate + radius;
    y  = frame_size*2 + Y_seperate;
   
    for (let i = board.length-1; i > (board.length/2)-1; i--) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i].tiles == []) {
                continue;
            }
            board[i].tiles[j].x = x;
            board[i].tiles[j].y = y + radius*2;
            board[i].tiles[j].draw();
            //draw_tile(x, y, radius, board[i][j].color);
           y += radius*2;
           
        }
        y =  frame_size*2 + Y_seperate;
        x +=  board[0].width + X_seperate + 5;
    }
    
    
}

function role() {
    cubes[0].shuffle();
    cubes[1].shuffle();
    cubes[0].draw();
    cubes[1].draw();
    headline = document.getElementById("welcome");
    headline.innerHTML = "Its the "+turn+" turn!"; 
    //turn = turn == "white" ? "black" : "white";
}
