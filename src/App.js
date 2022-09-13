import './App.css';
import React from 'react';

class App extends React.Component
{
  colours = {
    // Colours
    red : "rgb(242,76, 76)",
    blue: "rgb(66,202,202)",
    white: 'rgb(250,250,250)',
    // Highlights
    red_transparent: '(242,76,76,0.5)',
    blue_transparent: 'rgb(66,202,202,0.5)'
  }

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
          state.boxColours[ i + "," + j ]= 'rgb(250, 250, 250)'
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
              'data-coord' : '0,' + Math.floor( i/2 ) + ',' + Math.floor( j/2 ),
              onClick: this.drawLine,
              style:
              {
                backgroundColor: this.updateColour( this.state.lineCoordinates[ '0,' + Math.floor( i/2 ) + ',' + Math.floor( j/2 ) ] )
              }
              // TODO: Add hover effect on lines
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
              'data-coord': '1,' + Math.floor( j/2 ) + ',' + Math.floor( i/2 ),
              onClick: this.drawLine,
              style:
              {
                backgroundColor: this.updateColour( this.state.lineCoordinates[ '1,' + Math.floor( j/2 ) + ',' + Math.floor( i/2 ) ] )
              }
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

      this.setState( ( prevState ) => newState )
    }
  }

  // Update gameboard color
  // Blue: (66,202,202)
  // Red: (242,76, 76)
  // White: (250,250,250)
  updateColour = ( colour ) =>
  {
    // White
    if ( colour === 0)
    {
      return ( this.colours.white )
    }
    // Red
    if ( colour === 1)
    {
      return ( this.colours.red )
    }
    // Blue
    if ( colour === -1 )
    {
      return ( this.colours.blue )
    }
  }

  // Draw the lines between dots when clicked
  drawLine = ( event ) =>
  {
    // Read current coordinates for line, dots and box
    var currentCoordinate = event.target.dataset.coord
    console.log(currentCoordinate)

    // i, j and k coordinates as set by createBoard function.
    var i = currentCoordinate.split( ',' )[ 0 ]
    var j = currentCoordinate.split( ',' )[ 1 ]
    var k = currentCoordinate.split( ',' )[ 2 ]
    var currentLineCoordinate = this.state.lineCoordinates[ currentCoordinate ]

    // Box object to store new colour and check whether it is filled
    let boxState = {
      newBoxColours: this.state.boxColours,
      filledBox: 0
    }

    // If the current line coordinate is null,
    // Check which player's turn is it now and update linecoordinates accordingly.
    if( currentLineCoordinate === 0 )
    {
      let newState = this.state.lineCoordinates

      newState[ currentCoordinate ] = this.state.turn === 'red' ? 1 : -1

      this.setState( prevState => ( {
        lineCoordinates : newState
      } ) )
    }

    if( i === '0' )
    {
      this.verifyBoxHelper(j, k, boxState )
      this.verifyBoxHelper(parseFloat(j) - 1, k, boxState )
    }
    else
    {
      this.verifyBoxHelper( k, j, boxState )
      this.verifyBoxHelper( k, parseFloat( j ) - 1, boxState )
    }

    // If no box is filled, continue the game.
    if( boxState.filledBox === 0 )
    {
      console.log('Switch!')
      this.setState( ( prevState ) => ({
        turn: prevState.turn === 'red' ? 'blue' : 'red'
      }))
    }
    else
    {
      this.checkGameOver()
    }
  }

  // Checks whether the box is compelete
  verifyBox = ( j, k ) =>
  {
    var borderUp, borderDown, borderLeft, borderRight

    borderUp = Math.abs( this.state.lineCoordinates[ '0,' + j + ',' + k ] )
    borderDown = Math.abs( this.state.lineCoordinates[ '1,' + k + ',' + j ] )

    var J = parseFloat( j )
    var K = parseFloat( k )

    borderLeft  = Math.abs( ( J + 1 ) > this.state.boardSize ? 0 : this.state.lineCoordinates[ '0,' + ( J + 1 ) + ',' + k])
    borderRight = Math.abs( ( K + 1 ) > this.state.boardSize ? 0 : this.state.lineCoordinates[ '1,' + ( K + 1 ) + ',' + j])

    return ( borderUp + borderDown + borderLeft + borderRight )
  }

  // Helper to update Box properly
  verifyBoxHelper = ( j, k, boxState) =>
  {
    if ( this.verifyBox( j, k ) === 4 )
    {
      // Box is filled
      boxState.filledBox = 1

      // Check whose turn it is
      console.log(j + ',' + k)
      console.log('verifyBoxHelper.boxState.newBoxColours:' + boxState.newBoxColours[ j + ',' + k ])
      console.log('verifyBoxHelper.boxState.fillexBox:' + boxState.filledBox)

      boxState.newBoxColours[ j + ',' + k ] = this.state.turn === 'red' ? this.colours.red_transparent : this.colours.blue_transparent

      // Update score and box colour
      this.setState( ( prevState ) => (
      {
        scoreRed: ( prevState.turn === 'red' ) ? prevState.scoreRed + 1 : prevState.scoreRed,
        scoreBlue: ( prevState.turn === 'blue' ) ? prevState.scoreBlue + 1 : prevState.scoreBlue,
        boxColours : boxState.newBoxColours
      } ) )
    }
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
            Red: { this.state.scoreRed }, Blue: { this.state.scoreBlue }
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
