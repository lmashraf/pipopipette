import './App.css';
import React from 'react';

class App extends React.Component
{
  constructor( props )
  {
    super( props )
    // Set default game board size set to 5x5
    this.state = this.initBoard( 5 );
  }

  // Initialise the game board
  initBoard = ( size ) =>
  {
      let state =
      {
        boardSize: size,
        scoreRed: 0,
        scoreBlue: 0,
        turn: 'red',
        victoryMessage: '',
        lineCoordinates: { },
        boxColours: { }
      };

      // Initialise box coulours to #FAFAFA
      for( let i = 0; i < state.boardSize; ++i )
      {
        for( let j=0; j < state.boardSize; ++j )
        {
          state.boxColours = 'rgb(250, 250, 250)';
        }
      }

      // Initialise line coordinates.
      // i: Colour
      for( let i=0; i < 2; ++i )
      {
        // j: Dots
        for( let j=0; j < state.boardSize + 1; ++j )
        {
          // k: Lines
          for( let k=0; k < state.boardSize; ++k )
          {
            state.lineCoordinates[ i + "," + j + "," + k ] = 0;
          }
        }
      }

    return state;
  };

  // Create the game board
  createBoard = ( boardSize ) =>
  {
    let columns = [ ]
    let rows = [ ]

    // Rows
    for( let i=0; i <= ( boardSize * 2 ); ++i )
    {
      // Resets the rows at each column iteration
      rows = [ ]

      // Columns
      for( let j=0; j <= ( boardSize * 2 ); ++j )
      {
        if ( i%2 === 0 )
        {
          if ( j%2 === 0 )
          {
            rows.push( React.createElement( 'div',
            {
              className: 'dot',
              id: 'dot' + Math.floor( i/2 ) + ',' + Math.floor( j/2 )
            }, '' ) )
          }
          else
          {
            rows.push( React.createElement( 'div',
            {
              className: 'horizontalContainer',
              'data-coordinate' : '0,' + Math.floor( i/2 ) + ',' + Math.floor( j/2 )
              // TODO: Add onclick event to fill line with different colour.
            }, '') )
          }
        }
        // i%2 != 0
        else
        {
          if( j%2 === 0 )
          {
            rows.push( React.createElement( 'div',
            {
              className: 'verticalContainer',
              'data-coordinate': '1,' + Math.floor( j/2 ) + ',' + Math.floor( i/2 )
              //TODO: Add onclick event to fill line with different colour
            }, '' ) )
          }
          else
          {
            rows.push( React.createElement( 'div',
            {
              className: 'box',
              id: 'box' + Math.floor( i/2 ) + ',' + Math.floor( j/2 ),
              style: { backgroundColor: this.state.boxColours[ Math.floor( i/2 ) + ',' + Math.floor( j/2 ) ] }
            }, '') )
          }
        }
      }
      columns.push( React.createElement( 'div', { className: 'row' }, rows ) )
    }
    return ( React.createElement( 'div', { id: 'gameboard' }, columns ) )
  }

  // Update the size of the game board
  updateBoardSize = ( event ) =>
  {

  }

  // Update gameboard color
  // Blue: (242,76, 76)
  // Red: (66,202,202)
  // White: (250,250,250)
  updateColour = ( int ) =>
  {

  }

  // Draw the lines between dots when clicked
  drawLine = ( event ) =>
  {

  }

  // Checks whether the square is compelete
  applyDots = ( j, k ) =>
  {

  }

  // Checks game over conditions
  checkGameOver = ( ) =>
  {

  }

  // Notify which player has won the game
  notifyVictory = ( state ) =>
  {

  }

  render( )
  {
    return (
      <div id="game">
        <div id="header">
          <h1 id="title">
            La Pipopipette
          </h1>
          <p id="score">
            Red: [scoreRed], Blue: [scoreBlue]
          </p>
          Please select the size of the game board:

          <button id="small"> Small </button>
          <button id="medium"> Medium </button>
          <button id="large"> Large </button>

          <p id="winner">
            [victory message notification]
          </p>
        </div>
        <div id="board">
          { this.createBoard( 3 ) }
        </div>
      </div>
    );
  }
}

export default App;
