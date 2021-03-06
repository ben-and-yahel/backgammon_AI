class Bot{
    constructor(color)
    {
        this.color = color;
    }
    /*
    The function get called when ever the bot have dont eaten tiles and dont have double
    the function will play an ordinary turn and find the best move for the player
    */
    turn(b, eatArray){
        if(eatArray[this.color].length > 0)
            return this.haveEatenTilesTurn(b, eatArray)
        if(cubes[0].state == cubes[1].state)
            return this.double(b, eatArray)
        return this.ordinaryTurn(b, eatArray)
    }

    ordinaryTurn(b, e)
    {
        let eatArrayProp = e.__proto__;
        let cube1 = cubes[0].state, cube2 = cubes[1].state;
        let value = [10,null];
        let move1 = 0, move2 = 0;;
        for(let x=0;x<b.length;x++)
        {
            if(b[x].length <= 0)
                continue;
            if(b[x].tiles[0].color != this.color)
                continue;
            let tempBoard = copyBoard(b);//copying array
            let tempEatArray = copyArray(e,eatArrayProp);
            let result = this.move(tempBoard, tempEatArray, x, cube1, 0)
            if(result === null)
                continue;
            tempBoard  = result[0];
            tempEatArray = result[1];
            move1 = result[2];
            if(checkIfEmpty(tempBoard,this.color))
            {
                return [0,copyBoard(tempBoard),copyArray(tempEatArray,eatArrayProp)]
            }
            for(let y=0;y<tempBoard.length;y++)
            {
                if(tempBoard[y].length <= 0)
                    continue;
                if(tempBoard[y].tiles[0].color != this.color)
                    continue;
                let newBoard = copyBoard(tempBoard);//copying array
                let newEatArray = copyArray(tempEatArray,eatArrayProp);
                result = this.move(newBoard, newEatArray, y, cube2, 1)
                if(result == null)
                    continue;
                newBoard  = result[0];
                newEatArray = result[1];
                move2 = result[2];
                if(checkIfEmpty(newBoard,this.color))
                {
                    return [0,copyBoard(newBoard),copyArray(newEatArray,eatArrayProp)]
                }
                let newValue = this.evaluate(b,newBoard,e,newEatArray,move1,move2);
                if(value[0] > newValue)
                    value = [newValue,copyBoard(newBoard),copyArray(newEatArray,eatArrayProp)];
            }
        }
        return value[1] == null ? [0,b,e] : value;
    }
    /*
    The function get called when ever the bot have double on his turn
    the function will dill with double (4 moves) and find the best move for the player
    */
    double(b, e)
    {
        let result = this.ordinaryTurn(b,e);
        b  = result[1];
        e = result[2];
        print_board(b);
        return this.ordinaryTurn(b,e);
    }
    /*
    The function get called when ever the bot have eaten tiles
    the function will force the bot to return the eaten tiles
    with the remaining rolls of dice as best as it can
    */
    haveEatenTilesTurn(b, eatArray)
    {
        let numberOfEatenTiles = eatArray[this.color].length;
        let eatArrayProp = eatArray.__proto__;
        let cube1 = cubes[0].state, cube2 = cubes[1].state;
        let value = [10,null];
        let turns = 2
        let state = 0;
        let stateUsed = -1;
        let double = false;
        
        let minus = 1;  //In some scenarios we need to reverse the calaculation of the move
        let tile = this.color == "black" ? 11 : -1;
        let moves = set_moves_by_cubes(tile,minus);
        let tiles_x = moves[state][0];
        
        if(cube1 == cube2){//if double
            turns = 4;
            double = true;
            if(!this.validMove(b, eatArray, tiles_x, state)){
                return [0,b,eatArray];
            }
        }
        
        for(let i=0;i<numberOfEatenTiles && turns > 0 && state < 2;i++)
        {
            tiles_x = moves[state][0];
            let canGoIn = this.validMove(b, eatArray, tiles_x, state)
            if(!canGoIn){
                i--;
                if(!double){
                    state++;
                    if(stateUsed === -1 && state > 1)
                        return [0,b,eatArray];
                }
                continue;
            }
                
            
            if(b[tiles_x].length == 1 && this.color != b[tiles_x].tiles[0].color)
            {
                // tile_out => {"black":[Tile, Tile], "white":[Tile, Tile]}
                eatArray[b[tiles_x].tiles[0].color].push(b[tiles_x].tiles[0]);
                b[tiles_x].tiles = [];
                b[tiles_x].length = 0;
            }
            //getting tiles back in
            b[tiles_x].tiles.push(eatArray[this.color].splice(0,1)[0]); //ads the new tile to the triangle
            b[tiles_x].length += 1;
            
            stateUsed = state;
            if(!double)
                state++;
            turns--;

        }
        if(turns == 0 || eatArray[this.color].length > 0)
        {
            return [0,b,eatArray]
        }
        if(turns % 2 === 0)
        {
            return this.ordinaryTurn(b,eatArray);
        }
        let tempBoard  = copyBoard(b);
        let tempEatArray = copyArray(eatArray, eatArrayProp);
        if(turns > 1)
        {
            let result = this.ordinaryTurn(b,eatArray);
            tempBoard  = result[1];
            tempEatArray = result[2];
        }
        for(let y=0;y<tempBoard.length;y++)
        {
            if(tempBoard[y].length <= 0)
                continue;
            if(tempBoard[y].tiles[0].color != this.color)
                continue;
            let newBoard = copyBoard(tempBoard);//copying array
            let newEatArray = copyArray(tempEatArray,eatArrayProp);
            let result = this.move(newBoard, newEatArray, y, cube1, 0)
            if(result == null)
                continue;
            newBoard  = result[0];
            newEatArray = result[1];
            let moved = result[2];
            if(checkIfEmpty(newBoard,this.color))
            {
                return [0,copyBoard(newBoard),copyArray(newEatArray,eatArrayProp)]
            }
            let newValue = this.evaluate(b,newBoard,eatArray,newEatArray,moved,null);
            if(value[0] > newValue)
                value = [newValue,copyBoard(newBoard),copyArray(newEatArray,eatArrayProp)];
        }
        return value[1] == null ? [0,tempBoard,tempEatArray] : value;
    }
    /*
    evaluate function - evaluating how good is this move going to be
    */
    evaluate(b, newBoard, eat, newEat, tileA,tileB)
    {
        Array.prototype.differences = function(arr2) {//find differences between two arrays
            var ret = [];
            this.sort();
            arr2.sort();
            for(var i = 0; i < this.length; i += 1) {
                if(arr2.indexOf(this[i]) > -1){
                    ret.push(this[i]);
                }
            }
            return ret;
        };
        //let haeMovedTHeLast = 10, haveEat = 5, haveOpenTilesInTheHouse = -5/* check if realy et someone */, HaveOpenTilesThatAtGreatRisk = 0, closedHouse;
        let enemyColor = this.color == "black" ? "white" : "black";
        let opens = findAllOpen(b, this.color);
        let closed = findAllClosed(newBoard, this.color);
        let houseOpen = findHouseOpen(newBoard, this.color);
        let fartest = findFartest(b, this.color);
        let newFartest = findFartest(newBoard, this.color);

        let haveClosed = opens.differences(closed).length > 0;
        let haveEat = eat[enemyColor].length < newEat[enemyColor].length;
        
        let finaleValue = 0;

        let check = false;
        
        if(haveEat)//אכל ויש בבית מקומות פתוחים
        {
            //evaluate
            finaleValue += 3;
            if(houseOpen.length > 0)
                finaleValue = finaleValue - (3 * (houseOpen.length/6.0));
            check = true;
        }
        if(haveClosed)//סגר בית
        {
            //evaluate
            finaleValue += 5;
            check = true;
        }
        if(fartest != newFartest)//קידם את האחרון
        {
            //evaluate
            finaleValue += 2
            check = true;
        }
        let c = 0;
        if(tileB)
            c += this.risk(newBoard, newEat, tileB);
        c += this.risk(newBoard, newEat, tileA)
        console.log(c);
        return c;
        if(!check)
            return Math.random()
        return finaleValue;

    }
    dist(tile,color)//distance from house
    {
        if(tile < 12 && this.check_tiles_in(board))
            return -1;//change

        let start = color == "black" ? 0 : 18
        let end = color == "black" ? 5 : 23
        if(tile >= 12)
            tile = 35 - tile;
        if((color == "black" && tile >= 0 && tile <= 5) || (color == "white" && tile >= 18 && tile <= 23))
            return 0;
        let ret = color == "white" ? 18 - tile : tile - 5;
        return ret <= 0 ? 0 : ret;
    }
    risk(board,eat,tile)
    {
        if(tile < 12 && this.check_tiles_in(board))
            return -10;
        if(board[tile].length == 0)
            return 10;
        if(board[tile].length > 1)
            return 0;
        let mightEat = []
        let factor = this.color == "white"  ? 1 : -1;   
        for (let x = tile; x < board.length && x > 0; x += factor) {
            let i = x;
            if(i > 11)
                i = 35 - i;
            if(board[x].length > 0 && board[x].tiles[0].color != this.color)
                mightEat.push(i);
        }
        let chance = 0;
        let enemyColor = this.color == "black" ? "white" : "black";
        let startHouse = this.color == "black" ? 0 : 12;
        let endHouse = this.color == "black" ? 5 : 17;
        if(eat[enemyColor].length > 0)
        {
           if(tile >= startHouse && tile <= endHouse)
           {
               let dTile = tile > 11 ? tile - 11 : tile + 1;
               switch (dTile) {
                case 1:
                    chance += 11/36.0;
                    break;
                case 2:
                    chance += 1/3.0
                    break;
                case 3:
                    chance += 14/36.0
                    break;
                case 4:
                case 5:
                    chance += 5/12.0
                    break;
                case 6:
                    chance += 17/36.0
                    break;
                } 
            }
        }
        mightEat.forEach(enemy => {
            let distenceOfEnemy = Math.abs(enemy - tile);
            switch (distenceOfEnemy) {
                case 1:
                    chance += 11/36.0;
                    break;
                case 2:
                    chance += 1/3.0
                    break;
                case 3:
                    chance += 14/36.0
                    break;
                case 4:
                case 5:
                    chance += 5/12.0
                    break;
                case 6:
                    chance += 17/36.0
                    break;
                case 7:
                case 8:
                    chance += 1/6.0
                    break;
                case 9:
                    chance += 5/36.0
                    break;
                case 10:
                    chance += 1/12.0
                    break;
                case 11:
                    chance += 1/18.0
                    break;
                case 12:
                    chance += 1/12.0
                    break;
                case 15:
                case 16:
                case 18:
                case 20:
                case 24:
                    chance += 1/36.0
                    break;
                default:
                    break;
            }
        });
        return chance;
    }
    profit(board,newBoard,eat,newEat, tileA, tileB)
    {
        let enemyColor = this.color == "black" ? "white" : "black";
        if(eat[enemyColor].length < newEat[enemyColor].length)
        {

        }
        let opens = findAllOpen(newBoard, this.color);
        let closed = findAllClosed(newBoard, this.color);
        if(opens.length < closed.length)
        {

        }
        let oldOpen = findAllOpen(board, this.color);
        if(oldOpen.length < opens.length)
        {

        }
    }
    move(b, eat, tile, steps, state)
    {
        if(cubes[0].state == cubes[1].state)
            state = 0;
        let minus = 1;  //In some scenarios we need to reverse the calaculation of the move
        if (this.color == "black" && tile <12 || this.color == "white" && tile >=12)
            minus = -1;
        let moves = set_moves_by_cubes(tile,minus);
        if (moves[state][0] > 23 && minus == 1 && this.color == "black")
            moves[state] = [11 - (moves[state][0] % 12)];
        if (moves[state][0] > 11 && this.color == "white" && minus == 1)
            moves[state] = [23 - (moves[state][0] % 12)]; 
        if (moves[state][0] < 12 && this.color == "white" && minus == -1 && !this.check_tiles_in(b))
            return null;
        let tiles_x = moves[state][0];
        if(!this.validMove(b, eat, tiles_x, state))
            return null;

            //finding the fartest tile in the house
            //getting tiles out
            let fartest = 0;
            if(this.check_tiles_in(b) == true){
                let start = this.color === "black" ? 0 : 12;
                let end = this.color === "black" ? 6 : 18;
                for(let i = start; i < end; i++)
                {
                    if(b[i].length > 0 && b[i].tiles[0].color === this.color)
                        fartest = i;
                }
                if((tiles_x < 0 && this.color == "black") || (tiles_x < 12 && this.color == "white")){
                    let addToStart = this.color == "black" ? 1 : -11;
                    if(tile + addToStart < fartest + addToStart && steps > tile + addToStart)
                    {
                        return null
                    }
                    b[tile].tiles.splice(0,1);
                    b[tile].length -= 1;
                }
                else
                {
                    if(b[tiles_x].length == 1 && this.color != b[tiles_x].tiles[0].color)
                    {
                        // tile_out => {"black":[Tile, Tile], "white":[Tile, Tile]}
                        eat[b[tiles_x].tiles[0].color].push(b[tiles_x].tiles[0]);
                        b[tiles_x].tiles = [];
                        b[tiles_x].length = 0;
                    }
                    b[tiles_x].tiles.push(b[tile].tiles.splice(0,1)[0]); //ads the new tile to the triangle
                    b[tile].length -= 1;
                    b[tiles_x].length += 1;
                }
            }
            else if(tiles_x >= 0)
            {
                if(b[tiles_x].length == 1 && this.color != b[tiles_x].tiles[0].color)
                {
                    // tile_out => {"black":[Tile, Tile], "white":[Tile, Tile]}
                    eat[b[tiles_x].tiles[0].color].push(b[tiles_x].tiles[0]);
                    b[tiles_x].tiles = [];
                    b[tiles_x].length = 0;
                }
                b[tiles_x].tiles.push(b[tile].tiles.splice(0,1)[0]); //ads the new tile to the triangle
                b[tile].length -= 1;
                b[tiles_x].length += 1;
            }
        
        return [b,eat,tiles_x];
    }
    validMove(b, eat, number, move_number) {
        if(!(((number < 0 && this.color == "black") || (number < 12 && this.color == "white")) && this.check_tiles_in(b) == true)){
            if (number > 23 || number < 0) {
                return false;
            }
        }    
        else{
            return true;
        }
        if(eat[this.color].length > 0)
        {
            if(this.color == "black")
            {
                if(!(number >= 12 && number <= 17))
                {
                    return false;
                }
            }
            else
            {
                if(!(number >= 0 && number <= 5))
                {
                    return false;
                }
            }
            
        }
        if(b[number].tiles.length <= 1)
        {
            return true;
        }
        
        if(b[number].tiles[0].color != this.color)
        {
            return false;
        }
    
        return true;
    }
    check_tiles_in(b) {
        let tiles_start = this.color == "black" ? 6 : 0; 
        for (let tiles_x = tiles_start; tiles_x < b.length; tiles_x++) {
            if (b[tiles_x].tiles == [] || (this.color == "white" && tiles_x>11 && tiles_x<18)) {
                continue;
            }
            for (let tiles_y = 0; tiles_y < b[tiles_x].tiles.length; tiles_y++) {
                if (b[tiles_x].tiles[tiles_y].color == this.color) {
                    return false;
                }
            }
    }
    return true;
    }
}