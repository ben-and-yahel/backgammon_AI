function validMove(number) {
    if (number > 23 || number < 0) {
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
}
function clean()
{
    for (let tiles_x = 0; tiles_x < board.length; tiles_x++) {
        board[tiles_x].sign = false; 
        board[tiles_x].glow = false; 
        if(board[tiles_x].tiles == [])
            continue;
        for (let tiles_y = 0; tiles_y < board[tiles_x].length; tiles_y++) {
                board[tiles_x].tiles[tiles_y].sign = false;
                board[tiles_x].tiles[tiles_y].glow = false;
        }
    }
    if(currTile)
    {
        currTile.sign = false;
        currTile.glow = false;
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