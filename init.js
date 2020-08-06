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
strap_height = 65;

class Tile{
    constructor(color, x = 0, y = 0){
        this.color = color;
        this.x = x;
        this.y = y;
    }
}

board = [];
let radius = 0;
currTile = Object;
function mouse(e) {
    let mouse_x = event.clientX;
    let mouse_y = event.clientY;

    for (let tiles_x = 0; tiles_x < board.length; tiles_x++) {
        if(board[tiles_x] == "none")
            continue;
        for (let tiles_y = 0; tiles_y < board[tiles_x].length; tiles_y++) {
            if(board[tiles_x][tiles_y] == currTile)
                continue;
            if (mouse_x >= board[tiles_x][tiles_y].x - radius && mouse_x <= board[tiles_x][tiles_y].x + radius) {
            if (mouse_y >= board[tiles_x][tiles_y].y - radius && mouse_y <= board[tiles_x][tiles_y].y + radius) {
                console.log("hover");
                currTile = board[tiles_x][tiles_y];
                print_board(board);
                }
            }
        }
    }
}
// ----------------init functions--------------------

function init() {
    //makes the board
    board.push([new Tile("white", 0), new Tile("white", 0)]);
    board.push("none");
    board.push("none");
    board.push("none");
    board.push("none");
    board.push([new Tile("black", 0), new Tile("black", 0), new Tile("black", 0), new Tile("black", 0), new Tile("black", 0)]);
    board.push("none");
    board.push([new Tile("black", 0), new Tile("black", 0), new Tile("black", 0)]);
    board.push("none");
    board.push("none");
    board.push("none");
    board.push([new Tile("white", 0), new Tile("white", 0), new Tile("white", 0), new Tile("white", 0), new Tile("white", 0)]);
    board.push([new Tile("black", 0), new Tile("black", 0), new Tile("black", 0), new Tile("black", 0), new Tile("black", 0)]);
    board.push("none");
    board.push("none");
    board.push("none");
    board.push([new Tile("white", 0), new Tile("white", 0), new Tile("white", 0)]);
    board.push("none");
    board.push([new Tile("white", 0), new Tile("white", 0), new Tile("white", 0), new Tile("white", 0), new Tile("white", 0)]);
    board.push("none");
    board.push("none");
    board.push("none");
    board.push("none");
    board.push([new Tile("black", 0), new Tile("black", 0)]);
    
    
    print_board(board);
}
function print_board(board)
{
    ctx.shadowBlur = 0;//stop glowing effect
    ctx.shadowColor = "black";
    //------------------------drawing the frame----------------
    frame_size = 20;
    X_seperate = 8;
    Y_seperate = 15;
    ctx.fillStyle = "#ff9900";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#cc6600";
    ctx.fillRect(0, 0, ctx.canvas.width, frame_size);
    ctx.fillRect(0, 0, frame_size, ctx.canvas.height);
    ctx.fillRect(0, ctx.canvas.height-frame_size, ctx.canvas.width, frame_size);
    ctx.fillRect(ctx.canvas.width-frame_size, 0, frame_size, ctx.canvas.height);
   
    ctx.fillRect((ctx.canvas.width/2)-3, 0, 8 , ctx.canvas.height);


    //------------------------drawing the triangels----------------
    let x = frame_size + X_seperate;
    let y = ctx.canvas.height-frame_size - 5; // 5 for seperation
    let width =  ctx.canvas.width;
    width = width/ 15.12903225806452; // TODO : change the formula
    const height = 200;
    color = "black";
    for (let i = 0; i < 12; i++) {
        draw_triangle(x, y, width, height, color);
        x += width + X_seperate+5;
        color = color == "black" ? "red" : "black";           
    }
    x = frame_size + X_seperate;
    color = color == "black" ? "red" : "black";
    for (let i = 0; i < 12; i++) {
        draw_triangle(x, y, width, height, color, true);
        x += width + X_seperate+5;
        color = color == "black" ? "red" : "black";           
    }


    //------------------------drawing the tiles----------------
    radius = width*0.5;
    x = frame_size + X_seperate + 30;
    y = ctx.canvas.height- frame_size*2 - Y_seperate;//864
    save_j = 0;
    for (let i = 0; i < board.length/2; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if ( board[i] == "none") {
                continue;
            }
            board[i][j].x = x;
            board[i][j].y = y + radius*2;
            draw_tile(x, y, radius, board[i][j].color);
            y -= radius*2;
           
        }
        y = ctx.canvas.height- frame_size*2 - Y_seperate;
        x += width + X_seperate + 5;
    }
    x = frame_size + X_seperate + radius;
    y  = frame_size*2 + Y_seperate;
   
    for (let i = board.length-1; i > (board.length/2)-1; i--) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i] == "none") {
                continue;
            }
            board[i][j].x = x;
            board[i][j].y = y + radius*2;
            draw_tile(x, y, radius, board[i][j].color);
           y += radius*2;
           
        }
        y =  frame_size*2 + Y_seperate;
        x += width + X_seperate + 5;
    }
    
    
}
function draw_tile(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    //glowing effect
    if(currTile && currTile.x == x && currTile.y == y + radius*2)
    {

        ctx.shadowBlur = 50;
        ctx.shadowColor = "blue";
    }
    else //stop glowing effect
    {
        ctx.shadowBlur = 0;
        ctx.shadowColor = "black";
    }
    ctx.fill();
    
}
function draw_triangle(x, y, width, height, color, inverted=false)
{
    let height_parameter = height * Math.cos(Math.PI / 6);

    if (inverted) {
        height_parameter *= -1;
        y = frame_size+ 5;
    }
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x+width, y);
    ctx.lineTo(x+width/2, y - height_parameter);
    ctx.closePath();

    // the outline
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#666666';
    ctx.stroke();

    // the fill color
    ctx.fillStyle = color;
    ctx.fill();
}