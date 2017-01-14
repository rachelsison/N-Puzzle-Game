import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'

/* Each tile on the board should have the following attributes:
	- goalCoordinates: coordinate on board x,y
	- currentCoordinates: coordinate on board x,y
	- manhattanDistance of goal vs. current
	- tileNumber: tile number
	- 
*/
const Tile = React.createClass({
	propTypes: {
		boardWidth: PropTypes.number.isRequired,
		goalCoordinates: PropTypes.array.isRequired,
		currentCoordinates: PropTypes.array.isRequired,
		tileNumber: PropTypes.number.isRequired,
		triggerBoardUpdate: PropTypes.func.isRequired,
		emptyTileCoords: PropTypes.func.isRequired
	},
	getInitialState: function() {
    return {
    	goalCoordinates: this.props.goalCoordinates,
    	currentCoordinates: this.props.currentCoordinates,
    	tileNumber: this.props.tileNumber,
    	tileManhattanDistance: 0,
    	tileCanMove: false
    }
  },
  moveTile (e) {
  	console.log('updated moveTILE METHOD_______________')
  	const currentCoordinates = this.props.currentCoordinates
  	const emptyTileCoords = this.props.emptyTileCoords
  	const triggerBoardUpdate = this.props.triggerBoardUpdate
  	var el = e.target
  	if (el.classList.contains("tileInnerContainer")) {
  		el = el.parentElement
  	}
  	//if can move
  	//right
  	// is emptyTile to the right of currentTile?
  		if (currentCoordinates[1] === emptyTileCoords()[1] - 1) {
  			console.log('in MOVERIGHT, EMPTYCOORDS: ', emptyTileCoords())
  			el.classList.add('move-right')
  			setTimeout(function () {
  				console.log('IN TIMEOUT MOVERIGHT')
  				el.classList.remove('move-right')
  				triggerBoardUpdate(currentCoordinates, emptyTileCoords())
  			}, 400)
  			this.setState({currentCoordinates: emptyTileCoords})
  		}
  	//left
  	// is emptyTile to the left of currentTile?
  		if (currentCoordinates[1] === emptyTileCoords()[1] + 1) {
  			console.log('in MOVELeft, EMPTYCOORDS: ', emptyTileCoords())
  			el.classList.add('move-left')
  			setTimeout(function () {
  				console.log('IN TIMEOUT MOVELEFT')
  				el.classList.remove('move-left')
  				triggerBoardUpdate(currentCoordinates, emptyTileCoords())
  			}, 400)
  			this.setState({currentCoordinates: emptyTileCoords})
  		}
  	//up
  	// is emptyTile above 
  		if (currentCoordinates[0] === emptyTileCoords()[0] + 1) {
  			console.log('in MOVEup, EMPTYCOORDS: ', emptyTileCoords())
  			el.classList.add('move-up')
  			setTimeout(function () {
  				console.log('IN TIMEOUT MOVEUP')
  				el.classList.remove('move-up')
  				triggerBoardUpdate(currentCoordinates, emptyTileCoords())
  			}, 400)
  			this.setState({currentCoordinates: emptyTileCoords})
  		}
  	//down
  	// is emptyTile below?
  	if (currentCoordinates[0] === emptyTileCoords()[0] - 1 ) {
  		console.log('in MOVEdown, EMPTYCOORDS: ', emptyTileCoords())
  		el.classList.add('move-down')
  		setTimeout(function () {
  			console.log('IN TIMEOUT MOVEDOWN')
  				el.classList.remove('move-down')
  				triggerBoardUpdate(currentCoordinates, emptyTileCoords())
  			}, 400)
  		this.setState({currentCoordinates: emptyTileCoords})
  	}
  	// update current coords
  	// reset tileCanMove to false (will be updated accordingly in boardupdat)
  	// pass new info to triggerBoardUpdate
  },
  // moveTile (e) {
  // 	console.log('moveTile el: ', e.target)
  // 	var el = e.target
  // 	if (el.classList.contains("tileInnerContainer")) {
  // 		el = el.parentElement
  // 		console.log('parent element: ', el)
  // 		el.classList.add('move-down')
  // 		console.log('added movedown class')
  // 	} else {
  // 		console.log('cant find classname')
  // 	}
  // 	this.props.triggerBoardUpdate()
  // 	//this.setState({tileNumber:100})
  // },
	render () {
		console.log('RERENDERING TILE')
		if (this.state.tileNumber === 0) {
			return <div className="emptyTile"></div>
		}
		return <div onClick={this.moveTile} className="tileBorder">
							<div className="tileInnerContainer">{this.state.tileNumber}</div>
						</div>
	},
	ComponentDidMount () {

	},
	ComonentWillUpdate () {

	}

})

export default Tile