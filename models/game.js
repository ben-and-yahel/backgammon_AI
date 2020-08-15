/*
the function is called once the player clicks on tile and wants to view his move options
*/
function move(tiles_x) {
    minus = 1;  //In some scenarios we need to reverse the calaculation of the move
    if ((currTile.color == "black" && tiles_x <12 || currTile.color == "white" && tiles_x >12)) 
        minus = -1;
    succseed = 0;
    moves = [];
    moves[0] = tiles_x + (cubes[0].state * minus);
    moves[1] = tiles_x + (cubes[1].state * minus);
    moves[2] = tiles_x + ((cubes[0].state + cubes[1].state)* minus);
    for (let i = 0; i < moves.length; i++) {
         //In some scenario we need to modulo the cubes and reverse them
        if (moves[i] > 11 && currTile.color == "white" && minus == 1)
            moves[i] = 23 - (moves[i] % 12); 
        if (moves[i] > 23 && currTile.color == "black" && minus == 1)
            moves[i] = 11 - (moves[i] % 12);
        if (moves[i] < 12 && currTile.color == "white" && minus == -1)
            continue;
        

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
        //TODO: doc this!!
        if(board[tiles_x].sign && board[tiles_x].isInside(mouse_x,mouse_y - 5 - board[tiles_x].frame_size - strap_height))
        {
            let tiles_loc = find_sign_tile();
            if(board[tiles_x].length == 1 && currTile.color != board[tiles_x].tiles[0].color)
            {
                eats.push(board[tiles_x].tiles.splice(0, 1)); // eat
                board[tiles_x].length -= 1;
            }
            board[tiles_x].tiles.push(board[tiles_loc[0]].tiles[tiles_loc[1]]);
            board[tiles_x].length += 1;
            //board[tiles_x].tiles[tiles_loc[1]].sign = false;

            board[tiles_loc[0]].tiles.splice(tiles_loc[1], 1); // delets the old tile
            board[tiles_loc[0]].length -= 1;
            clean();
            break;
            //alert("move");
            
        }
        for (let tiles_y = 0; tiles_y < board[tiles_x].length; tiles_y++) {
            if(board[tiles_x].tiles[tiles_y] == currTile && currTile.color == "gray")
                continue;
            if (mouse_x >= board[tiles_x].tiles[tiles_y].x - radius && mouse_x <= board[tiles_x].tiles[tiles_y].x + radius) {
            if (mouse_y >= board[tiles_x].tiles[tiles_y].y - radius && mouse_y <= board[tiles_x].tiles[tiles_y].y + radius) {

                clean();
                move(tiles_x); // needes to get tiles_x for the calc
                currTile.sign = true;
                currTile.draw();
                }
            }
        }
    }      
    print_board(board)
  
}
function mouse_hover(e) {
    let mouse_x = event.clientX;
    let mouse_y = event.clientY;

    for (let tiles_x = 0; tiles_x < board.length; tiles_x++) {
        if(board[tiles_x].tiles == [])
            continue;
        if(board[tiles_x].sign)
            board[tiles_x].glow = board[tiles_x].isInside(mouse_x,mouse_y - 5 - board[tiles_x].frame_size - strap_height) ? true : false; 
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
                
                }
            }
        }
    }
    print_board(board);

}