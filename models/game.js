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
//TODO: needes different name
function move(tiles_x, isEaten) {
    minus = 1;  //In some scenarios we need to reverse the calaculation of the move
    if (!isEaten && (currTile.color == "black" && tiles_x <12 || currTile.color == "white" && tiles_x >=12)) 
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
        

        isValid = validMove(moves[i], i);

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

function draw_move_options(tiles_x, tiles_y, isEaten){
    if (isEaten)
    {
        if (eaten_tiles[turn][0].color != turn) {
            return;
        }
        currTile = eaten_tiles[turn][0];
    }
    else if (board[tiles_x].tiles[tiles_y].color != turn) {
        return;
    }
    else
        currTile = board[tiles_x].tiles[tiles_y];

    clean();
        
    move(tiles_x, isEaten); // needes to get tiles_x for the calc
    currTile.sign = true;
    currTile.draw();
    eatsPosition = true;
}

function eat(tiles_x) {
    // tile_out => {"black":[Tile, Tile], "white":[Tile, Tile]}
    eaten_tiles[board[tiles_x].tiles[0].color].push(board[tiles_x].tiles[0]);
    board[tiles_x].tiles = [];
    board[tiles_x].length = 0;
}
function tile_to_triangle(tiles_x) {
    let tiles_location = find_sign_tile();
    x_tile = tiles_location[0];
    y_tile = tiles_location[1];
    if(board[tiles_x].length == 1 && currTile.color != board[tiles_x].tiles[0].color)
    {
        eat(tiles_x);
    }
    if(x_tile != true)
        board[tiles_x].tiles.push(board[x_tile].tiles[y_tile]); //ads the new tile to the triangle
    else
        board[tiles_x].tiles.push(eaten_tiles[turn][0]);

    board[tiles_x].length += 1;


    if (board[tiles_x].cube_number == 2 || board[tiles_x].cube_number==100) {
        cubes[0].dark_mode();
        cubes[1].dark_mode();
    }
    else{
        cubes[board[tiles_x].cube_number].dark_mode();
    }


    clean();
    if(x_tile != true){
        board[x_tile].tiles.splice(y_tile, 1); // delets the old tile
        board[x_tile].length -= 1;
    }
    else{
        eaten_tiles[turn].splice(0,1)
    }
    if (cubes[0].fill_color == "grey" && cubes[1].fill_color == "grey") {
        role();
    }
    eatsPosition = false;
    
            
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
                    return [tiles_x, tiles_y, false];
                }
            }
        }
    }
    // for eaten tile
    if (eaten_tiles[turn].length) {
        if (mouse_x >= eaten_tiles[turn][0].x - radius && mouse_x <= eaten_tiles[turn][0].x + radius) {
            if (mouse_y >= eaten_tiles[turn][0].y - radius && mouse_y <= eaten_tiles[turn][0].y + radius) {
                if(turn == "white")
                    return [-1,0,true];
                else
                    return [11,0,true];
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
    if (find_sign_tile()[0] == cordinates[0]) {
        clean();
    }
    else if(eaten_tiles[turn].length && cordinates[2] != true && tiles_x==false ) // in case we have eaten
    {
        alert("you have eaten Tile!");
    }
    else if(cordinates  && (tiles_x == false || board[tiles_x].cube_number < 0)){
        draw_move_options(cordinates[0], cordinates[1], cordinates[2]); // cordinates => [tiles_X, tiles_Y, isEaten]
    }

    else if(currTile.sign == true) { // sign == is marked and was clicked
        if(tiles_x != undefined)
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