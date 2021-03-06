function validMove(number, move_number) {
    if (number > 23 || number < -1) {
        return false;
    }
    if (move_number==2 && (cubes[0].fill_color == "grey" || cubes[1].fill_color == "grey")) {
        return false;
    }
    if (number < 0 && currTile.color == "black") {
        return false;
    }
    if(board[number].tiles.length <= 1)
    {
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
//returns a the loacation of the sign'ed tile for moving it.
function find_sign_tile() {
    for (let tiles_x = 0; tiles_x < board.length; tiles_x++) {
        if(board[tiles_x].tiles == [])
            continue;
        for (let tiles_y = 0; tiles_y < board[tiles_x].length; tiles_y++) {
            if(board[tiles_x].tiles[tiles_y].sign == true)
                return [tiles_x, tiles_y];   
        }
    }
    if (eaten_tiles[turn].length && eaten_tiles[turn][0].sign == true)
    {
        if(turn == "white")
            return [true];
        else
            return [true];
    }
    return false;
}
function check_border_by_cordinates(mouse_x, mouse_y) {
    if (mouse_x > 0 && mouse_x < frame_size) {
        return true;
    }
}
function check_tiles_in(color) {
    return true;
    let tiles_start = color == "black" ? 6 : 0; 
    for (let tiles_x = tiles_start; tiles_x < board.length; tiles_x++) {
        if (board[tiles_x].tiles == [] || (color == "white" && tiles_x>11 && tiles_x<18)) {
            continue;
        }
        for (let tiles_y = 0; tiles_y < board[tiles_x].tiles.length; tiles_y++) {
            if (board[tiles_x].tiles[tiles_y].color == color) {
                return false;
            }
        }
    }
    return true;
}
function clean()
{
    borderDraw = false;
    for (let tiles_x = 0; tiles_x < board.length; tiles_x++) {
        board[tiles_x].sign = false; 
        board[tiles_x].glow = false; 
        board[tiles_x].cube_number = -99;
        board[tiles_x].length == -1 ? board[tiles_x].length = 0 : true;
        if(board[tiles_x].tiles == [])
            continue;
        for (let tiles_y = 0; tiles_y < board[tiles_x].length; tiles_y++) {
                if (board[tiles_x].tiles.length < 0) 
                    continue;
                if (board[tiles_x].tiles[tiles_y] == undefined) {
                    debugger;
                }
                board[tiles_x].tiles[tiles_y].sign = false;
                board[tiles_x].tiles[tiles_y].glow = false;
                
        }
    }
    if(eaten_tiles[turn].length) {
        eaten_tiles[turn][0].sign = false;
        eaten_tiles[turn][0].glow = false;
    }
    if(currTile)
    {
        currTile.sign = false;
        currTile.glow = false;
    }
}
function role() {
    clean();
    cubes[0].shuffle();
    cubes[1].shuffle();
    cubes[0].draw();
    cubes[1].draw();
    headline = document.getElementById("welcome");
    turn = turn == "white" ? "black" : "white";
    headline.innerHTML = "Its the "+turn+" turn!";
}
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
async function BotGame()
{
    let b1 = new Bot("white");
    let b2 = new Bot("black");
    while(!(checkWin("white") || checkWin("black"))){
        let result = turn === "black" ? b2.turn(board, eaten_tiles) : b1.turn(board, eaten_tiles);
        board = result[1];
        eaten_tiles = result[2];
        print_board(board);
        role(); 
        await sleep(100);
    }
}

function checkWin(colorToCheck)
{
    if(eaten_tiles[colorToCheck].length > 0)
        return false;
    for (let x = 0; x < board.length; x++) {
        if(board[x].length == 0)
            continue;
        if(board[x].tiles[0].color == colorToCheck)
            return false;
    }
    return true;
}

function arrayEquals(a, b) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
}
//use to copy the board
function copyBoard(arr)
{
    newArray = JSON.parse(JSON.stringify(arr));
    for (let i = 0; i < newArray.length; i++) {
        newArray[i].__proto__ = Triangle.prototype;
        for(let j = 0; j < newArray[i].length; j++)
        {
            newArray[i].tiles[j].__proto__ = Tile.prototype;
        }
        
    }
    if(newArray.__proto__ == Triangle.prototype)
    console.log(arr);
    return newArray;
}
//use to copy the eaten tiles array
function copyArray(arr,ArrayProp)
{
    newArray = JSON.parse(JSON.stringify(arr));
    newArray.__proto__ = ArrayProp;
    for(let col in newArray){
        for(let j = 0; j < newArray[col].length; j++)
        {
            newArray[col][j].__proto__ = Tile.prototype;
        }
    }  
    return newArray;
}
function checkIfEmpty(board,color){

    for(let i = 0; i < board.length; i++)
    {
        if(board[i].length > 0 && color == board[i].tiles[0].color )
        {
            return false;
        }
    }
    return true;
}
function findAllOpen(board,color)
{
    let opens = [];
    for(let i = 0; i < board.length; i++)
    {
        if(board[i].length == 1 && board[i].tiles[0].color == color)
            opens.push(i);
    }
    return opens;
}
function findAllClosed(board,color)
{
    let closed = [];
    for(let i = 0; i < board.length; i++)
    {
        if(board[i].length > 1 && board[i].tiles[0].color == color)
            closed.push(i);
    }
    return closed;
}
function findHouseOpen(board,color)
{
    let start = color == "black" ? 0 : 12;
    let end = color == "black" ? 6 : 18;
    let opens = [];
    for(let i = start; i < end; i++)
    {
        if(board[i].length == 1 && board[i].tiles[0].color == color)
            opens.push(i);
    }
    return opens;
}
function findFartest(board,color)
{
    let start = color == "black" ? 12 : 0;
    let end = color == "black" ? -1 : 11;
    let opens = [];
    let factor = 1;
    for(let i = start; !(i == end && factor == -1); i = i + factor)
    {
        if(board[i].length > 0 && board[i].tiles[0].color == color)
            return i;
        if(i + factor == 23 && color == "black" && factor != -1){
            i = 23;
            if(board[i].length == 1 && board[i].tiles[0].color == color)
                return i;
            i = 11;
            if(board[i].length == 1 && board[i].tiles[0].color == color)
                return i;
            factor = -1;
        }
        if(i + factor == 11 && color == "white" && factor != -1){
            i = 11;
            if(board[i].length == 1 && board[i].tiles[0].color == color)
                return i;
            i = 23;
            if(board[i].length == 1 && board[i].tiles[0].color == color)
                return i;
            factor = -1;
        }
    }
    return -1;
}