import React, { Component } from 'react';
import GameBoard from './containers/GameBoard';
import './App.css';

class App extends Component {
	render() {
		return (
			<div className="app">
				<GameBoard />
			</div>
		);
	}
}

export default App;
