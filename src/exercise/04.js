// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({onClick, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [history, setHistory] = useLocalStorageState('history', [
    Array(9).fill(null),
  ])
  const [currStep, setCurrStep] = useLocalStorageState('currStep', 0)
  const squares = history[currStep]

  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(calculateWinner(squares), squares, nextValue)
  const moves = getMoves()

  function restart() {
    setHistory([Array(9).fill(null)])
    setCurrStep(0)
  }

  function selectSquare(square) {
    if (winner || squares[square]) return
    const newHistory = history
      .map(arr => [...arr])
      .filter((_, index) => index <= currStep)
    const newSquares = [...squares]
    newSquares[square] = nextValue
    newHistory.push(newSquares)
    setCurrStep(newHistory.length - 1)
    setHistory(newHistory)
  }

  function getMoves() {
    return history.map((val, index) => {
      const isCurrent = Number(index) === Number(currStep)
      let btnText = index ? `Go to move #${index}` : 'Go to game start'
      btnText += isCurrent ? ' (current)' : ''
      return (
        <li key={index}>
          <button
            value={index}
            disabled={isCurrent}
            onClick={event => {
              setCurrStep(event.currentTarget.value)
            }}
          >
            {btnText}
          </button>
        </li>
      )
    })
  }

  React.useEffect(() => {
    window.localStorage.setItem('history', JSON.stringify(history))
  }, [history])

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={squares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
