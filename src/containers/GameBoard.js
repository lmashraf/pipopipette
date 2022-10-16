import '../styles/GameBoard.css';
import Logo from '../assets/logo.js'
import React from 'react';

class GameBoard extends React.Component
{
  colours =
  {
    // Colours
    red : 'rgb(242,76,76)',
    blue: 'rgb(66,202,202)',
    white: 'rgb(106,106,106)',
    light_grey: 'rgb(217,217,217)',
    black: 'rgb(30,30,30)',

    // Highlights
    red_highlight: 'rgb(242,76,76,0.7)',
    blue_highlight: 'rgb(66,202,202,0.7)'
  }

  constructor( props )
  {
    super( props )
    // Set default game board size set to 3x3
    this.state = this.initBoard( 3 );
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

      // Initialise box coulours to white
      for( let i = 0; i < state.boardSize; ++i )
      {
        for( let j=0; j < state.boardSize; ++j )
        {
          state.boxColours[ i + "," + j ]= 'rgb(255, 255, 255)'
        }
      }

      // Initialise line coordinates.
      for( let i=0; i < 2; ++i )
      {
        for( let j=0; j < state.boardSize + 1; ++j )
        {
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
              className: 'horizontalLine',
              'data-coord' : '0,' + Math.floor( i/2 ) + ',' + Math.floor( j/2 ),
              onClick: this.drawLine,
              style:
              {
                backgroundColor: this.updateColour( this.state.lineCoordinates[ '0,' + Math.floor( i/2 ) + ',' + Math.floor( j/2 ) ] )
              },
              onMouseEnter: this.addHighlight,
              onMouseLeave: this.deleteHighlight
            }, '') )
          }
        }
        else
        {
          if( j%2 === 0 )
          {
            rows.push( React.createElement( 'div',
            {
              className: 'verticalLine',
              'data-coord': '1,' + Math.floor( j/2 ) + ',' + Math.floor( i/2 ),
              onClick: this.drawLine,
              style:
              {
                backgroundColor: this.updateColour( this.state.lineCoordinates[ '1,' + Math.floor( j/2 ) + ',' + Math.floor( i/2 ) ] )
              },
              onMouseEnter: this.addHighlight,
              onMouseLeave: this.deleteHighlight
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
      return ( this.colours.light_grey )
    }
    // Red
    if ( colour === 1)
    {
      return ( this.colours.black )
    }
    // Blue
    if ( colour === -1 )
    {
      return ( this.colours.black )
    }
  }

  addHighlight = ( event ) =>
  {
    var currentCoordinate = event.target.dataset.coord

    if( this.state.lineCoordinates[currentCoordinate] === 0 )
    {
      if( this.state.turn === 'red' )
      {
        event.target.style.backgroundColor = this.colours.red_highlight
      }
      else
      {
        event.target.style.backgroundColor = this.colours.blue_highlight
      }
    }
  }

  deleteHighlight = ( event ) =>
  {
    var currentCoordinate = event.target.dataset.coord

    if( this.state.lineCoordinates[currentCoordinate] === 0 )
    {
      event.target.style.backgroundColor = this.colours.light_grey
    }
  }



  // Draw the lines between dots when clicked
  drawLine = ( event ) =>
  {
    // Read current coordinates for line, dots and box
    var currentCoordinate = event.target.dataset.coord
    var currentLineCoordinate = this.state.lineCoordinates[ currentCoordinate ]

    // Box object to store new colour and check whether it is filled
    let boxState = { }

    // If the current line coordinate is null,
    // Check which player's turn is it now and update linecoordinates accordingly.
    if( currentLineCoordinate === 0 )
    {
      boxState = {
        newBoxColours: this.state.boxColours,
        filledBox: 0
      }
      // Update current line coordinates
      currentLineCoordinate = this.state.lineCoordinates[ currentCoordinate ]

      // i, j and k coordinates as set by createBoard function.
      var i = currentCoordinate.split( ',' )[ 0 ]
      var j = currentCoordinate.split( ',' )[ 1 ]
      var k = currentCoordinate.split( ',' )[ 2 ]

      let newState = this.state.lineCoordinates

      newState[ currentCoordinate ] = this.state.turn === 'red' ? 1 : -1

      this.setState( prevState => (
        {
          lineCoordinates : newState
        } ) )

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
        this.setState( ( prevState ) => (
          {
            turn: prevState.turn === 'red' ? 'blue' : 'red'
          } ) )
      }
      else
      {
        this.checkGameOver( )
      }
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

      boxState.newBoxColours[ j + ',' + k ] = this.state.turn === 'red' ? this.colours.red : this.colours.blue

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
    console.log("Is game over?")
    console.log(this.state.scoreBlue + this.state.scoreRed, " === ", this.state.boardSize*2)
    this.setState( ( prevState ) => (
      {
        victoryMessage: ( prevState.scoreRed + prevState.scoreBlue === prevState.boardSize ** 2 ) ? this.notifyVictory( prevState ) : ''
      } ) )
  }

  // Notify which player has won the game
  notifyVictory = ( state ) =>
  {
    if ( this.state.scoreBlue > this.state.scoreRed )
    {
      return "Blue is the Victor!"
    }
    else if( this.state.scoreBlue < this.state.scoreRed )
    {
      return "Red is the Victor!"
    }
    else
    {
      return "Draw!"
    }
  }

  render( )
  {
    return (
      <div id="game">
        <div id="header">
          <Logo></Logo>
          <h1 id="title">
            La Pipopipette
          </h1>
          <p id="score">
            <p id="red" style={{ textAlign: 'center', width: '128px', borderRadius:'10px', backgroundColor: (this.state.turn === 'red') ? 'rgb(242,76,76,0.5)' :'white' }}>
              Red: { this.state.scoreRed }
            </p>
            <p id="blue" style={{ textAlign: 'center', width: '128px', borderRadius:'10px',backgroundColor:  this.state.turn === 'blue' ? 'rgb(66,202,202,0.5)' : 'white' }} >
              Blue: { this.state.scoreBlue }
            </p>
          </p>
          Please select the size of the game board:
          <div id="difficulty">
            <button class="button" id="small" onClick={ this.updateBoardSize }> Small </button>
            <button class="button" id="medium" onClick={ this.updateBoardSize }> Medium </button>
            <button class="button" id="large" onClick={ this.updateBoardSize }> Large </button>
          </div>
        </div>
        <div id="board">
          { this.createBoard( this.state.boardSize ) }
        </div>
      </div>
    );
  }
}

export default GameBoard;