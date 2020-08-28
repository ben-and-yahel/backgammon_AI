/*
the function is called once the player clicks on tile and wants to view his move options
*/
const none_cube_number = -99;
const outNumber = -50;
const special_double = 100;
double_cubes = none_cube_number;

function set_moves_by_cubes(tiles_x, minus) {
    moves = [];
    if (cubes[0].state == cubes[1].state) { // double situation
        moves.push([tiles_x + (cubes[0].state * minus)]);
        if (cubes[0].fill_color != "grey" &&  cubes[1].fill_color != "grey") 
            moves.push([tiles_x + ((cubes[0].state + cubes[1].state)* minus)]);  
        return moves;
    }

    if (cubes[0].fill_color != "grey") {
        moves.push([tiles_x + (cubes[0].state * minus)]);
    }
    if (cubes[1].fill_color != "grey") {
         moves.push([tiles_x + (cubes[1].state * minus)]);
    }
    if (cubes[0].fill_color != "grey" && cubes[1].fill_color != "grey"){
        moves.push([tiles_x + ((cubes[0].state + cubes[1].state)* minus)]);
    }
    return moves;
}
function draw_move_options(tiles_x, isEaten, isIn) {

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
        if (moves[i] < 12 && currTile.color == "white" && minus == -1 && !isIn)
            continue;
        
        if (isIn && ((turn=="black" && moves[i] < 0) || (turn == "white" && moves[i] < 12))){
            borderDraw = true;
            continue;
        } 

        isValid = validMove(moves[i], i);

        if(isValid == false)
            continue;
        if(moves.length > 1 && i == moves.length-1 && succseed == 0) // In case of the first and second move dosen't work
            break;
        board[moves[i]].sign = true;
        if (moves.length == 1) { // spicial case were there is double and the second move is like the third
            board[moves[i]].cube_number = special_double; // stands for turn pass after the move
        } else {
            board[moves[i]].cube_number = i;
        }
        
        board[moves[i]].draw();
        succseed++;
    }
}

function check_move_options(tiles_x, tiles_y, isEaten, isIn){
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
        
    draw_move_options(tiles_x, isEaten, isIn); // needes to get tiles_x for the calc
    currTile.sign = true;
    currTile.draw();
    eatsPosition = true;
}
function tile_to_triangle(tiles_x) {
    
    let tiles_location = find_sign_tile();
    x_tile = tiles_location[0];
    y_tile = tiles_location[1];
    // ------------ case: need to extract tiles out of the board-----------
    if (tiles_x == outNumber) {
        board[x_tile].tiles.splice(y_tile, 1); // delets the old tile
        board[x_tile].length -= 1;
        if (cubes[0].fill_color == "grey" && cubes[1].fill_color == "grey") {
            role();
            if(turn == "black")
            {
                let bot = new Bot();
                let result = bot.turn(board, eaten_tiles);   
                board = result[1];
                eaten_tiles = result[2];
                role(); 
            }
        }
        eatsPosition = false;
        return;
    }
    // ------------ case: need to eat tile from the triangle -----------
    else if(board[tiles_x].length == 1 && currTile.color != board[tiles_x].tiles[0].color)
    {
        // tile_out => {"black":[Tile, Tile], "white":[Tile, Tile]}
        eaten_tiles[board[tiles_x].tiles[0].color].push(board[tiles_x].tiles[0]);
        board[tiles_x].tiles.splice(0,1);
        board[tiles_x].length = 0;
    }
    // ------------ case: when tile is eaten we need to copy it from diffrent array -----------  
    if(x_tile === true)
    {
        board[tiles_x].tiles.push(eaten_tiles[turn][0]);
    } 
    // ------------ case: usual case adding the tile to the board -----------  
    else
        board[tiles_x].tiles.push(board[x_tile].tiles[y_tile]); //ads the new tile to the triangle


    board[tiles_x].length += 1;

    // ------------ case: double situation where the cubes are the same-----------
    if (cubes[0].state == cubes[1].state) {
        if (double_cubes == none_cube_number) 
            double_cubes = 2;

        if (board[tiles_x].cube_number == 0 || board[tiles_x].cube_number == special_double) {
            if (double_cubes > 0) {
                double_cubes -= 1;
            }
            else if (cubes[0].fill_color == "grey") {
                cubes[1].dark_mode();
                double_cubes = none_cube_number;
            }
            else{
                cubes[0].dark_mode();
            }
        }
        else if(board[tiles_x].cube_number == 1){
            if (double_cubes == 2) {
                double_cubes = 0;
            }
            else if (double_cubes == 1) {
                double_cubes = 0;
                cubes[0].dark_mode();
            }
            else if (double_cubes == 0) {
                cubes[0].dark_mode();
                cubes[1].dark_mode();
                double_cubes = none_cube_number;
            }
        }
    }
    // ------------ case: if player picking the last option of the cube is need spicial case-----------
    else if (board[tiles_x].cube_number == 2 || board[tiles_x].cube_number==special_double) {
        cubes[0].dark_mode();
        cubes[1].dark_mode();
    }
    // ------------ case: usual case were the cube are getting dark mode -----------
    else{
        cubes[board[tiles_x].cube_number].dark_mode();
    }
    // ------------ case: we need to check if there is eaten tile in the move -----------
    if (board[tiles_x].cube_number == 2 || (cubes[0].state == cubes[1].state && board[tiles_x].cube_number == 1)) {
        for (let tiles_x = 0; tiles_x < board.length; tiles_x++) {
            if (board[tiles_x].length == 0)
                continue;
            
            if (board[tiles_x].cube_number !=none_cube_number && board[tiles_x].length == 1 && currTile.color != board[tiles_x].tiles[0].color) {
                eaten_tiles[board[tiles_x].tiles[0].color].push(board[tiles_x].tiles[0]);
                board[tiles_x].tiles.splice(0,1);
                board[tiles_x].length = 0;
            }
        }
    }


    clean();
    // ------------ case: usual case were we delete the old tile from the array-----------
    if(!(x_tile === true)){
        board[x_tile].tiles.splice(y_tile, 1); // delets the old tile
        board[x_tile].length -= 1;
    }
    // ------------ case: when tile is eaten we neeed to delete it from defernt array-----------
    else{
        eaten_tiles[turn].splice(0,1);
    }
    //TODO: make animation of turn been switched
    // ------------ case: usual when 2 cubes are in dark mode we need to change the turn -----------
    if (cubes[0].fill_color == "grey" && cubes[1].fill_color == "grey") {
        role();
        if(turn == "black")
        {
            let bot = new Bot();
            console.log(cubes[0].state,cubes[1].state);

            let result = bot.turn(board, eaten_tiles);   
            board = result[1];
            eaten_tiles = result[2];
            role(); 
        }
    }
    //TODO: wtf is this?!
    eatsPosition = false; 
}
function find_triangle_by_cordinates(mouse_x, mouse_y) {
    for (let tiles_x = 0; tiles_x < board.length; tiles_x++) {
        if(board[tiles_x].tiles == [])
            continue;
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

    let isIn = check_tiles_in(turn); // check if all the tiles are in their bases
    let isBorderClicked = check_border_by_cordinates(mouse_x, mouse_y);

    cordinates = find_tile_by_cordinates(mouse_x, mouse_y);
    tiles_x = find_triangle_by_cordinates(mouse_x, mouse_y);
    if (find_sign_tile()[0] == cordinates[0]) {
        clean();
    }
    else if(cordinates && eaten_tiles[turn].length && cordinates[2] != true && tiles_x==false ) // in case we have eaten
    {
        alert("you have eaten Tile!");
    }
    else if(isBorderClicked)
        tiles_x = outNumber;    

    
    else if(cordinates  && (tiles_x == false || board[tiles_x].cube_number < 0)){
        check_move_options(cordinates[0], cordinates[1], cordinates[2], isIn); // cordinates => [tiles_X, tiles_Y, isEaten]
    }
    else if(currTile.sign == true || tiles_x == outNumber) { // sign == is marked and was clicked
        if(tiles_x !== false)
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
    if (check_border_by_cordinates(mouse_x, mouse_y)) {
        borderGlow = true;
    }
    for (let tiles_x = 0; tiles_x < board.length; tiles_x++) {
        if(board[tiles_x].tiles == [])
            continue;
        //change the glow affect by asking if the mouse is inside the tringle
        if(board[tiles_x].sign)
            board[tiles_x].glow = board[tiles_x].isInside(mouse_x,mouse_y - 5 - board[tiles_x].frame_size - strap_height) ? true : false; 
        for (let tiles_y = 0; tiles_y < board[tiles_x].length; tiles_y++) {
            if(board[tiles_x].tiles[tiles_y] == currTile)
                continue;
            if (mouse_x >= board[tiles_x].tiles[tiles_y].x - radius && mouse_x <= board[tiles_x].tiles[tiles_y].x + radius) {
                if (mouse_y >= board[tiles_x].tiles[tiles_y].y - radius && mouse_y <= board[tiles_x].tiles[tiles_y].y + radius) {
                    if (currTile.glow == true) {
                        currTile.glow = false;
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