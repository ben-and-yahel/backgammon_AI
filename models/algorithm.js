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
            tempBoard = this.move(tempBoard,y,cube2)
            if(tempBoard == null)
                continue;
            let value = [0];
            for(let y=0;y<tempBoard.length;y++)
            {
                if(tempBoard[x].length == 0)
                    continue;
                if(tempBoard[x].tiles[0].color == "white")
                    continue;
                let newBoard = [...board];//copying array
                newBoard = this.move(newBoard,y,cube2)
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
    move(board, cubeNum)
    {
        
    
    }
}