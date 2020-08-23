/*
the function is called once the player clicks on tile and wants to view his move options
*/
function set_moves_by_cubes(tiles_x, minus) {
    moves = [];
    if (cubes[0].fill_color != "grey") {
        moves.push([tiles_x + (cubes[0].state * minus)]);
    }
    if (cubes[1].fill_color != "grey") {
        moves.push([tiles_x + (cubes[1].state * minus)]);
    }
    if (cubes[0].fill_color != "grey" && cubes[1].fill_color != "grey"){
        moves.push([tiles_x + ((cubes[0].state + cubes[1].state)* minus)])
    }
    return moves;
}
function move(tiles_x) {
    minus = 1;  //In some scenarios we need to reverse the calaculation of the move
    if ((currTile.color == "black" && tiles_x <12 || currTile.color == "white" && tiles_x >=12)) 
        minus = -1;
    succseed = 0;
    moves = set_moves_by_cubes(tiles_x, minus);
    
    for (let i = 0; i < moves.length; i++) {
         //In some scenario we need to modulo the cubes and reverse them
        if (moves[i] > 11 && currTile.color == "white" && minus == 1)
            moves[i] = 23 - (moves[i] % 12); 
        if (moves[i] > 23 && currTile.color == "black" && minus == 1)
            moves[i] = 11 - (moves[i] % 12);
        if (moves[i] < 12 && currTile.color == "white" && minus == -1)
            continue;
        
        //TODO: clean code
        isValid = validMove(moves[i], moves, i);

        if(isValid == false)
            continue;
        if(i==2 && succseed == 0) // In case of the first and second move dosen't work
            break
        board[moves[i]].sign = true;
        if (moves.length == 1) {
            board[moves[i]].cube_number = 100; // stands for turn pass after the move
        } else {
            board[moves[i]].cube_number = i;
        }
        
        board[moves[i]].draw();
        succseed++;
    }
}

function draw_move_options(tiles_x, tiles_y){
    clean();
    if (board[tiles_x].tiles[tiles_y].color != turn) {
        return;
    }
    currTile =  board[tiles_x].tiles[tiles_y];
    move(tiles_x); // needes to get tiles_x for the calc
    currTile.sign = true;
    currTile.draw();
    eatsPosition = true;
}
function tile_to_triangle(tiles_x) {
    let tiles_location = find_sign_tile();

    if(board[tiles_x].length == 1 && currTile.color != board[tiles_x].tiles[0].color)
    {
        eats.push(board[tiles_x].tiles.splice(0, 1)); // eat
        board[tiles_x].length -= 1;
    }
    board[tiles_x].tiles.push(board[tiles_location[0]].tiles[tiles_location[1]]);
    board[tiles_x].length += 1;


    if (board[tiles_x].cube_number == 2 || board[tiles_x].cube_number==100) {
        cubes[0].dark_mode();
        cubes[1].dark_mode();
    }
    else{
        cubes[board[tiles_x].cube_number].dark_mode();
    }


    if (cubes[0].fill_color == "grey" && cubes[1].fill_color == "grey") {
        role();
    }

    board[tiles_location[0]].tiles.splice(tiles_location[1], 1); // delets the old tile
    board[tiles_location[0]].length -= 1;
    eatsPosition = false;
    clean();
            
}
function find_triangle_by_cordinates(mouse_x, mouse_y) {
    for (let tiles_x = 0; tiles_x < board.length; tiles_x++) {
        if(board[tiles_x].tiles == [])
            continue;
        //TODO: doc this!!
        if(board[tiles_x].sign && board[tiles_x].isInside(mouse_x,mouse_y - 5 - board[tiles_x].frame_size - strap_height))
        {
            return tiles_x;
        }
    }
    return false;
}
function find_tile_by_cordinates(mouse_x, mouse_y) {
    for (let tiles_x = 0; tiles_x < board.length; tiles_x++) {
        for (let tiles_y = 0; tiles_y < board[tiles_x].length; tiles_y++) {
            if(board[tiles_x].tiles[tiles_y] == currTile && currTile.color == "gray")
                continue;
            if (mouse_x >= board[tiles_x].tiles[tiles_y].x - radius && mouse_x <= board[tiles_x].tiles[tiles_y].x + radius) {
                if (mouse_y >= board[tiles_x].tiles[tiles_y].y - radius && mouse_y <= board[tiles_x].tiles[tiles_y].y + radius) {
                    return [tiles_x, tiles_y];
                }
            }
        }
    }
    return false;
}
function mouseClick(e) {
    let mouse_x = event.clientX;
    let mouse_y = event.clientY;


    cordinates = find_tile_by_cordinates(mouse_x, mouse_y);
    tiles_x = find_triangle_by_cordinates(mouse_x, mouse_y);
    if(cordinates && tiles_x == false || board[tiles_x].cube_number < 0){
        draw_move_options(cordinates[0], cordinates[1]); // cordinates => [tiles_X, tiles_Y]
    }
    else if(currTile.sign == true) { // sign == is marked and was clicked
        if(tiles_x >= 0)
            tile_to_triangle(tiles_x);
    }



    print_board(board);
    if(checkWin(turn))//check if someone won
    {
        headline = document.getElementById("welcome");
        headline.innerHTML = turn+" won!";
        alert(turn+" won!");
    }
}
//TODO: ADD HELPER FUNCTION
function mouse_hover(e) {
    let mouse_x = event.clientX;
    let mouse_y = event.clientY;

    for (let tiles_x = 0; tiles_x < board.length; tiles_x++) {
        if(board[tiles_x].tiles == [])
            continue;
        //TODO: DOC THIS
        if(board[tiles_x].sign)
            board[tiles_x].glow = board[tiles_x].isInside(mouse_x,mouse_y - 5 - board[tiles_x].frame_size - strap_height) ? true : false; 
        for (let tiles_y = 0; tiles_y < board[tiles_x].length; tiles_y++) {
            if(board[tiles_x].tiles[tiles_y] == currTile)
                continue;
            if (mouse_x >= board[tiles_x].tiles[tiles_y].x - radius && mouse_x <= board[tiles_x].tiles[tiles_y].x + radius) {
                if (mouse_y >= board[tiles_x].tiles[tiles_y].y - radius && mouse_y <= board[tiles_x].tiles[tiles_y].y + radius) {
                    if (currTile.glow == true) {
                        currTile.glow = false;
                        //currTile.draw();
                    }
                    if(!eatsPosition && turn == board[tiles_x].tiles[tiles_y].color)
                    {
                        currTile = board[tiles_x].tiles[tiles_y];
                        currTile.glow = true;
                    }
                }
            }
        }
    }
    print_board(board);

}