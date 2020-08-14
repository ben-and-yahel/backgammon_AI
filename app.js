window.onload = function() {
    canv=document.getElementById("gc");
    ctx = canv.getContext("2d");
    //TODO: make the canvas size change for small to big according to window size
    ctx.canvas.width  = 940;
    ctx.canvas.height = 920 - strap_height;
    init();
    
}
const strap_height = 40;
radius = 0;
board = [];
currTile = Object;
cubes = [Object, Object];
turn = "white";

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
    
    board.push(new Triangle([new Tile("black", 0), new Tile("black", 0)], "red"));
    board.push(new Triangle());
    board.push(new Triangle([], "red"));
    board.push(new Triangle());
    board.push(new Triangle([], "red"));
    board.push(new Triangle([new Tile("white", 0), new Tile("white", 0), new Tile("white", 0), new Tile("white", 0), new Tile("white", 0)]));
    board.push(new Triangle([], "red"));
    board.push(new Triangle([new Tile("white", 0), new Tile("white", 0), new Tile("white", 0)]));
    board.push(new Triangle([], "red"));
    board.push(new Triangle());
    board.push(new Triangle([], "red"));
    board.push(new Triangle([new Tile("black", 0), new Tile("black", 0), new Tile("black", 0), new Tile("black", 0), new Tile("black", 0)]));
    
    cubes[0] = new Cube(Math.floor(Math.random() * 6) + 1, 0);
    cubes[1] = new Cube(Math.floor(Math.random() * 6) + 1, 50);
    
    
    init_Triangels();
    print_board(board);
}
const frame_size = 20;
const X_seperate = 8;
function init_Triangels() {
    let x = frame_size + X_seperate;
    let y = ctx.canvas.height-frame_size - 5; // 5 for seperation
    let width =  ctx.canvas.width;
    width = width/ 15.12903225806452; // TODO : change the formula
    const height = 200;
    for (let i = 0; i < 12; i++) {
        board[i].x = x;
        board[i].y = y;
        
        x += width + X_seperate+5;
    }

    x = frame_size + X_seperate;
    for (let i = 12; i < 24; i++) {
        board[i].x = x;
        board[i].y = y;
        board[i].inverted = true;
        x += width + X_seperate+5;     
    }
}
function print_board(board)
{
    ctx.shadowBlur = 0;//stop glowing effect
    ctx.shadowColor = "black";


    //------------------------drawing the frame---------------
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

            y -= radius*2;
           
        }
        y = ctx.canvas.height- frame_size*2 - Y_seperate;
        x +=  board[0].width + X_seperate + 5;
    }
    x = frame_size + X_seperate + radius;
    y  = frame_size*2 + Y_seperate;
   
    for (let i = board.length/2; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i].tiles == []) {
                continue;
            }
            board[i].tiles[j].x = x;
            board[i].tiles[j].y = y + radius*2;
            board[i].tiles[j].draw();
            
           y += radius*2;
           
        }
        y =  frame_size*2 + Y_seperate;
        x +=  board[0].width + X_seperate + 5;
    }
    
    
}
