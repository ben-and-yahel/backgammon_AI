/*
    the bot will be black


    go through 
*/
class Bot{
    turn(board){
        let cube1 = cube[0].state, cube2 = cube[1].state;
        evaluationArray = []
        for(let x=0;x<board.length;x++)
        {
            if(board[x].length == 0)
                continue;
            if(board[x].tiles[0].color == "white")
                continue;
            let tempBoard = [...board];//copying array
            tempBoard = this.move(tempBoard, y, cube1, 0)
            if(tempBoard == null)
                continue;
            let value = [0];
            for(let y=0;y<tempBoard.length;y++)
            {
                if(tempBoard[x].length == 0)
                    continue;
                if(tempBoard[x].tiles[0].color == "white")
                    continue;
                let newBoard = [...tempBoard];//copying array
                newBoard = this.move(newBoard, y, cube2, 1)
                if(newBoard == null)
                    continue;
                let newValue = this.evaluate();
                if(value[0] < newValue)
                    value = [newValue,[...newBoard]];
            }
        }


    }
    /*
    evaluate function - evaluating how good is this move going to be
    */
    evaluate(board)
    {
        return (int)(random()*10);
    }
    move(board, tile, steps, state)
    {
        minus = 1;  //In some scenarios we need to reverse the calaculation of the move
        if (tile <12) 
            minus = -1;
        moves = set_moves_by_cubes(tile,minus);
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
            board[tiles_x].tiles.push(board[tile].tiles.splice(0,1)); //ads the new tile to the triangle
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