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
function check_tiles_in(color) {
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
                    //TODO: there is a bug here!
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
function checkWin(colorToCheck)
{
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