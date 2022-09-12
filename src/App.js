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
    if(window.confirm('Would you really like to restart the game?'))
    {
      // Create a new state
      var newState

      // Read value of the new chosen board size
      let size = event.target.id

      switch( size )
      {
        case "small":
          newState = this.initBoard( 3 )
          break
        case "medium":
          newState = this.initBoard( 5 )
          break
        case "large":
          newState = this.initBoard( 11 )
          break
        default:
          // Do nothing
          return
      }

      this.setState((prevState) => newState)
    }
  }

  // Update gameboard color
  // Blue: (66,202,202)
  // Red: (242,76, 76)
  // White: (250,250,250)
  updateColour = ( color ) =>
  {
    // White
    if ( color === 0)
    {
      return ( 'rgb(250,250,250)' )
    }
    // Red
    if ( color === 1)
    {
      return ( 'rgb(242,76, 76)' )
    }
    // Blue
    if ( color === -1 )
    {
      return ( 'rgb(66,202,202)' )
    }
  }

  // Draw the lines between dots when clicked
  drawLine = ( event ) =>
  {
    var currentCoordinate = event.target.dataset.coord
    var currentLineCoordinate = this.state.lineCoordinates[currentCoordinate]

    // If the current line coordinate is null,
    // Check which player's turn is it now and update linecoordinates accordingly.
    if(currentLineCoordinate === 0)
    {
      let newState = this.state.lineCoordinates

      newState[currentCoordinate] = this.state.turn === 'red' ? 1 : -1
      this.setState(prevState => ({
        lineCoordinates : newState
      }))
    }
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

          <button id="small" onClick={ this.updateBoardSize }> Small </button>
          <button id="medium" onClick={ this.updateBoardSize }> Medium </button>
          <button id="large" onClick={ this.updateBoardSize }> Large </button>

          <p id="winner">
            [victory message notification]
          </p>
        </div>
        <div id="board">
          { this.createBoard( this.state.boardSize ) }
        </div>
      </div>
    );
  }
}

export default App;
