class Bot{
    /*
    The function get called when ever the bot have dont eaten tiles and dont have double
    the function will play an ordinary turn and find the best move for the player
    */
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
    /*
    The function get called when ever the bot have double on his turn
    the function will dill with double (4 moves) and find the best move for the player
    */
    double(board, eatArray)
    {
        let result = this.ordinaryTurn(board,eatArray);
        let newBoard  = result[1];
        let newEatArray = result[2];
        return this.ordinaryTurn(newBoard,newEatArray);
    }
    /*
    The function get called when ever the bot have eaten tiles
    the function will force the bot to return the eaten tiles
    with the remaining rolls of dice as best as it can
    */
    haveEatenTilesTurn(board, eatArray)
    {
        let numberOfEatenTiles = eatArray["black"].length;
        let eatArrayProp = eatArray.__proto__;
        let cube1 = cubes[0].state, cube2 = cubes[1].state;
        let value = [0,null];
        let turns = 2
        let state = 0;
        let stateUsed = 0;
        let double = false;
        if(cube1 == cube2){//if double
            turns = 4;
            double = true;
        }
        let minus = 1;  //In some scenarios we need to reverse the calaculation of the move
        let tile = 11;
        let moves = set_moves_by_cubes(tile,minus);
        let tiles_x = moves[state][0];
        for(let i=0;i<numberOfEatenTiles;i++)
        {
            if(state > 1)
                return [0,board,eatArray];
            tiles_x = moves[state][0];
            let canGoIn = this.validMove(board, eatArray, tiles_x, state)
            if(!canGoIn){
                if(!double)
                {
                    state++;
                    if(stateUsed == 0)  
                        stateUsed = state;
                }
                else{
                    return [0,board,eatArray];
                }
                i--;
                continue;
            }
                
            
            if(board[tiles_x].length == 1 && "white" == board[tiles_x].tiles[0].color)
            {
                // tile_out => {"black":[Tile, Tile], "white":[Tile, Tile]}
                eatArray[board[tiles_x].tiles[0].color].push(board[tiles_x].tiles[0]);
                board[tiles_x].tiles = [];
                board[tiles_x].length = 0;
            }
            //getting tiles back in
            board[tiles_x].tiles.push(eatArray["black"].splice(0,1)[0]); //ads the new tile to the triangle
            board[tiles_x].length += 1;
            if(!double)
            {
                state++;
                stateUsed = state > 1 ? stateUsed : state;
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
            let result = this.move(newBoard, newEatArray, y, stateUsed == 0 ? cube2 : cube1, stateUsed == 0 ? 1 : 0)
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
    evaluate(board, newBoard, eat, newEat)
    {
        let haeMovedTHeLast = 10, haveEat = 5, haveOpenTilesInTheHouse = -5/* check if realy et someone */, HaveOpenTilesThatAtGreatRisk = , closedHouse;









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