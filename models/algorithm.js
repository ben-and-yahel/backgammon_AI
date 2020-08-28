class Bot{
    turn(board, eatArray){
        if(eatArray["black"].length > 0)
            return this.haveEatenTilesTurn(board, eatArray)
        if(cubes[0].state == cubes[1].state)
            return this.double(board, eatArray)
        return this.ordinaryTurn(board, eatArray)
    }

    ordinaryTurn(board, eatArray)
    {
        let eatArrayProp = eatArray.__proto__;
        let cube1 = cubes[0].state, cube2 = cubes[1].state;
        let value = [0,null];
        for(let x=0;x<board.length;x++)
        {
            if(board[x].length <= 0)
                continue;
            if(board[x].tiles[0].color == "white")
                continue;
            let tempBoard = copyBoard(board);//copying array
            let tempEatArray = copyArray(eatArray,eatArrayProp);
            let result = this.move(tempBoard, tempEatArray, x, cube1, 0)
            if(result === null)
                continue;
            tempBoard  = result[0];
            tempEatArray = result[1];
            if(checkIfEmpty(tempBoard,"black"))
            {
                return [0,copyBoard(tempBoard),copyArray(tempEatArray,eatArrayProp)]
            }
            for(let y=0;y<tempBoard.length;y++)
            {
                if(tempBoard[y].length <= 0)
                    continue;
                if(tempBoard[y].tiles[0].color == "white")
                    continue;
                let newBoard = copyBoard(tempBoard);//copying array
                let newEatArray = copyArray(tempEatArray,eatArrayProp);
                result = this.move(newBoard, newEatArray, y, cube2, 1)
                if(result == null)
                    continue;
                newBoard  = result[0];
                newEatArray = result[1];
                if(checkIfEmpty(newBoard,"black"))
                {
                    return [0,copyBoard(tempBoard),copyArray(tempEatArray,eatArrayProp)]
                }
                let newValue = this.evaluate();
                if(value[0] < newValue)
                    value = [newValue,copyBoard(newBoard),copyArray(newEatArray,eatArrayProp)];
            }
        }
        return value[1] == null ? [0,board,eatArray] : value;
    }
    double(board, eatArray)
    {
        let result = this.ordinaryTurn(board,eatArray);
        let newBoard  = result[1];
        let newEatArray = result[2];
        return this.ordinaryTurn(newBoard,newEatArray);
    }
    haveEatenTilesTurn(board, eatArray)
    {
        let numberOfEatenTiles = eatArray["black"].length;
        let eatArrayProp = eatArray.__proto__;
        let cube1 = cubes[0].state, cube2 = cubes[1].state;
        let value = [0,null];
        let turns = 2
        let state = 0;
        let double = false;
        if(cube1 == cube2){
            turns = 4;
            double = true;
        }
        minus = -1;  //In some scenarios we need to reverse the calaculation of the move
        tile = 11;
        moves = set_moves_by_cubes(tile,minus);
        let tiles_x = moves[state][0];
        for(let i=0;i<numberOfEatenTiles;i++)
        {
            let canGoIn = this.validMove(board, eatArray, tiles_x, state)
            if(!canGoIn)
                continue;
            //getting tiles back in
            if(eatArray["black"].length > 0)
            {
                eatArray["black"].splice(0,1);
            }
            if(board[tiles_x].length == 1 && "white" == board[tiles_x].tiles[0].color)
            {
                // tile_out => {"black":[Tile, Tile], "white":[Tile, Tile]}
                eatArray[board[tiles_x].tiles[0].color].push(board[tiles_x].tiles[0]);
                board[tiles_x].tiles = [];
                board[tiles_x].length = 0;
            }
            board[tiles_x].tiles.push(board[tile].tiles.splice(0,1)[0]); //ads the new tile to the triangle
            board[tiles_x].length += 1;
            if(!double)
            {
                state++;
            }
            turns--;
            if(turns <= 0)
            {
                break;
            }
        }
        if(turns == 0 || eatArray["black"].length > 0)
        {
            return [0,board,eatArray]
        }
        if(turns % 2 == 0)
        {
            return this.ordinaryTurn(board,eatArray);
        }
        let tempBoard  = copyBoard(board);
        let tempEatArray = copyArray(eatArray, eatArrayProp);
        if(turns > 1)
        {
            let result = this.ordinaryTurn(board,eatArray);
            tempBoard  = result[1];
            tempEatArray = result[2];
        }
        for(let y=0;y<tempBoard.length;y++)
        {
            if(tempBoard[y].length <= 0)
                continue;
            if(tempBoard[y].tiles[0].color == "white")
                continue;
            let newBoard = copyBoard(tempBoard);//copying array
            let newEatArray = copyArray(tempEatArray,eatArrayProp);
            result = this.move(newBoard, newEatArray, y, cube2, 1)
            if(result == null)
                continue;
            newBoard  = result[0];
            newEatArray = result[1];
            if(checkIfEmpty(newBoard,"black"))
            {
                return [0,copyBoard(tempBoard),copyArray(tempEatArray,eatArrayProp)]
            }
            let newValue = this.evaluate();
            if(value[0] < newValue)
                value = [newValue,copyBoard(newBoard),copyArray(newEatArray,eatArrayProp)];
        }
        return value[1] == null ? [0,tempBoard,tempEatArray] : value;
    }








    /*
    evaluate function - evaluating how good is this move going to be
    */
    evaluate(board)
    {
        return Math.floor(Math.random()*10) + 1;
    }
    move(board, eat, tile, steps, state)
    {
        minus = 1;  //In some scenarios we need to reverse the calaculation of the move
        if (tile <12) 
            minus = -1;
        moves = set_moves_by_cubes(tile,minus);
        if (moves[state][0] > 23 && minus == 1)
            moves[state] = [11 - (moves[state][0] % 12)];
        let tiles_x = moves[state][0];
        if(!this.validMove(board, eat, tiles_x, state))
            return null;
        


            
            //finding the fartest tile in the house
            //getting tiles out
            let fartest = 0;
            if(this.check_tiles_in(board) == true){
                for(let i = 0; i < 6; i++)
                {
                    if(board[i].length > 0 && board[i].tiles[0].color === "black")
                        fartest = i;
                }
                if(tiles_x < 0){
                    if(tile < fartest)
                    {
                        return null
                    }
                    board[tile].tiles.splice(0,1);
                    board[tile].length -= 1;
                }
                else
                {
                    if(board[tiles_x].length == 1 && "white" == board[tiles_x].tiles[0].color)
                    {
                        // tile_out => {"black":[Tile, Tile], "white":[Tile, Tile]}
                        eat[board[tiles_x].tiles[0].color].push(board[tiles_x].tiles[0]);
                        board[tiles_x].tiles = [];
                        board[tiles_x].length = 0;
                    }
                    board[tiles_x].tiles.push(board[tile].tiles.splice(0,1)[0]); //ads the new tile to the triangle
                    board[tile].length -= 1;
                    board[tiles_x].length += 1;
                }
            }
            else if(tiles_x >= 0)
            {
                if(board[tiles_x].length == 1 && "white" == board[tiles_x].tiles[0].color)
                {
                    // tile_out => {"black":[Tile, Tile], "white":[Tile, Tile]}
                    eat[board[tiles_x].tiles[0].color].push(board[tiles_x].tiles[0]);
                    board[tiles_x].tiles = [];
                    board[tiles_x].length = 0;
                }
                board[tiles_x].tiles.push(board[tile].tiles.splice(0,1)[0]); //ads the new tile to the triangle
                board[tile].length -= 1;
                board[tiles_x].length += 1;
            }
        
        
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
        
        return [board,eat];
    }
    validMove(board, eat, number, move_number) {
        if(!(number < 0 && this.check_tiles_in(board) == true)){
            if (number > 23 || number < 0) {
                return false;
            }
        }    
        else{
            return true;
        }
        if(eat["black"].length > 0)
        {
            if(!(number >= 12 && number <= 17))
            {
                return false;
            }
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
    check_tiles_in(board) {
        let tiles_start = 6; 
        for (let tiles_x = tiles_start; tiles_x < board.length; tiles_x++) {
            if (board[tiles_x].tiles == []) {
                continue;
            }
            for (let tiles_y = 0; tiles_y < board[tiles_x].tiles.length; tiles_y++) {
                if (board[tiles_x].tiles[tiles_y].color == "black") {
                    return false;
                }
            }
        }
        return true;
    }
}