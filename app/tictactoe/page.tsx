"use client"

import { useState } from "react"

export default function TicTacToe() {
    const [board,setBoard]=useState(Array(9).fill(""));
    const [isHumanTurn,setHumanTurn]=useState(true);

    const human = "X";
    const ai = "O";

    //0 1 2
    //3 4 5
    //6 7 8

    const winStates=[
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]

    function checkWinner(board:string[]){
        for(let i=0;i<8;i++){
            const [x,y,z]=winStates[i];

            if(board[x]!=="" && board[x]===board[y] && board[x]===board[z]){
                return board[x];
            }
        }

        return null;
    }

    function handleClick(index:number){
        if(board[index]!=="" || !isHumanTurn )return;

        const newBoard=[...board];
        console.log(newBoard);

        newBoard[index]=human;
        setHumanTurn(false);
        setBoard(newBoard);
        const winner=checkWinner(newBoard);

        if(winner===human){
            alert("CONGRATS! YOU WIN!");
            setBoard(Array(9).fill(""));
            return;
            
        }

        if (!newBoard.includes("")) {
            alert("It's a Draw!");
            setBoard(Array(9).fill(""));
            setHumanTurn(true);
            return;
        }

        setTimeout(()=>{
            aiMove(newBoard)
        },1000)

        return;

    }

    function aiMove(board:string[]){
        const availableIndices = board.map((value,index)=> value==="" ?index :null).filter(value=>value!==null) as number[];
        
        if(availableIndices.length===0) return;
        
        const bestMove=miniMax({board,player:ai}).index;
        const newBoard=[...board];
        newBoard[bestMove]=ai;
        setBoard(newBoard);

        const winner=checkWinner(newBoard);
        if(winner===ai){
            alert("YOU LOSE! SORRY BETTER LUCK NEXT TIME");
            setBoard(Array(9).fill(""));
            return;

        }
        setHumanTurn(true);
        
        return;

    }

    function miniMax({board,player}:{
        board:string[],
        player:string
    }){
        interface Move{
            index:number,
            score:number
        }

        const winner=checkWinner(board);
        if(winner===human) return {index:-1,score:-1};
        if(winner===ai) return {index:-1,score:1};
        if(!board.includes("")) return {index:-1,score:0};
        
        const moves:Move[]=[];

        for(let i=0;i<9;i++){
            if(board[i]===""){
                const move:Move={index:i,score:0};
                move.index=i;
                board[i]=player;

                if(player===ai){
                    const res=miniMax({board,player:human});
                    move.score=res.score;
                }
                else{
                    const res=miniMax({board,player:ai});
                    move.score=res.score;
                }

                board[i]="";
                moves.push(move);
            }
        }

        let bestMove=0;
        if(player==ai){
            let bestScore=-Infinity;

            for(let i=0;i<moves.length;i++){
                if(moves[i].score>bestScore){
                    bestScore=moves[i].score;
                    bestMove=i;
                }
            }
        }
        else{
            let bestScore=Infinity;

            for(let i=0;i<moves.length;i++){
                if(moves[i].score<bestScore){
                    bestScore=moves[i].score;
                    bestMove=i;
                }
            }
        }

        return moves[bestMove]
        
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-600">
  
  <h1 className="text-3xl font-bold mb-6">Tic Tac Toe</h1>

  <div className="grid grid-cols-3 gap-4">
    {board.map((value, index) => (
      <button
        key={index}
        onClick={() => handleClick(index)}
        className="
          w-24 h-24
          bg-white
          text-3xl font-bold
          rounded-xl
          shadow-md
          flex items-center justify-center
          transition
          duration-300
          hover:scale-110
          active:scale-95
        "
      >
        {value}
      </button>
    ))}
  </div>

  <p className="mt-6 text-xl font-semibold text-black-900">
    {isHumanTurn ? "Your Turn" : "AI Thinking..."}
  </p>

  <button
    onClick={() => {
      setBoard(Array(9).fill(""));
      setHumanTurn(true);
    }}
    className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
  >
    Restart
  </button>

</div>
    )
}