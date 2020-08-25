/*
    the bot will be black
    TODO: for tommorow you need to make the evaluate function but not efore ou make sure that the eats and basic rules are understood

    go through 
*/
class Bot{
    turn(board){
        let cube1 = cubes[0].state, cube2 = cubes[1].state;
        let value = [0,null];
        for(let x=0;x<board.length;x++)
        {
            if(board[x].length <= 0)
                continue;
            if(board[x].tiles[0].color == "white")
                continue;
            let tempBoard = copyArray(board);//copying array
            tempBoard = this.move(tempBoard, x, cube1, 0)
            if(tempBoard == null)
                continue;
            
            for(let y=0;y<tempBoard.length;y++)
            {
                if(tempBoard[y].length <= 0)
                    continue;
                if(tempBoard[y].tiles[0].color == "white")
                    continue;
                let newBoard = copyArray(tempBoard);//copying array
                newBoard = this.move(newBoard, y, cube2, 1)
                if(newBoard == null)
                    continue;
                let newValue = this.evaluate();
                if(value[0] < newValue)
                    value = [newValue,copyArray(newBoard)];
            }
        }

        return value[1] == null ? board : value[1];
    }
    /*
    evaluate function - evaluating how good is this move going to be
    */
    evaluate(board)
    {
        return Math.floor(Math.random()*10) + 1;
    }
    move(board, tile, steps, state)
    {
        minus = 1;  //In some scenarios we need to reverse the calaculation of the move
        if (tile <12) 
            minus = -1;
        moves = set_moves_by_cubes(tile,minus);
        if (moves[state] > 23 && minus == 1)
            moves[state] = 11 - (moves[state] % 12);
        let tiles_x = moves[state];
        if(!this.validMove(board, tiles_x, state))
            return null;
        


            if(board[tiles_x].length == 1 && "white" == board[tiles_x].tiles[0].color)
            {
                // tile_out => {"black":[Tile, Tile], "white":[Tile, Tile]}
                eaten_tiles[board[tiles_x].tiles[0].color].push(board[tiles_x].tiles[0]);
                board[tiles_x].tiles = [];
                board[tiles_x].length = 0;
            }
            board[tiles_x].tiles.push(board[tile].tiles.splice(0,1)[0]); //ads the new tile to the triangle
            board[tile].length -= 1;
            board[tiles_x].length += 1;
        
        
            /*if (cubes[0].state == cubes[1].state) {
                if (double_cubes == -99) 
                    double_cubes = 2;
        
                if (board[tiles_x].cube_number == 0 || board[tiles_x].cube_number == 100) {
                    if (double_cubes > 0) {
                        double_cubes -= 1;
                    }
                    else if (cubes[0].fill_color == "grey") {
                        cubes[1].dark_mode();
                        double_cubes = -99;
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
                        double_cubes = -99;
                    }
                }
            }
            else if (board[tiles_x].cube_number == 2 || board[tiles_x].cube_number==100) {
                cubes[0].dark_mode();
                cubes[1].dark_mode();
            }
            
            else{
                cubes[board[tiles_x].cube_number].dark_mode();
            }*/
        
        return board;
    }
    validMove(board, number, move_number) {
        if (number > 23 || number < 0) {
            return false;
        }
        
        if(board[number].tiles.length <= 1)
        {
            return true;
        }
        
        if(board[number].tiles[0].color == "white")
        {
            return false;
        }
    
        return true;
    }
    
}