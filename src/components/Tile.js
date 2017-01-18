import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'

const Tile = React.createClass({
	propTypes: {
		currentCoordinates: PropTypes.array.isRequired,
		tileValue: PropTypes.number.isRequired,
		triggerBoardUpdate: PropTypes.func.isRequired,
		emptyTileCoordinates: PropTypes.func.isRequired,
		isHintTile: PropTypes.bool.isRequired,
		solveMove: PropTypes.bool.isRequired,
		gameWon: PropTypes.bool.isRequired,
		boardWidth: PropTypes.number
	},
  moveTile (e) {
  	if (!e) {
  		return
  	}
  	var is24game = this.props.boardWidth === 5
  	var moveup = is24game ? "move-up24" : "move-up"
  	var movedown = is24game ? "move-down24" : "move-down"
  	var moveleft = is24game ? "move-left24" : "move-left"
  	var moveright = is24game ? "move-right24" : "move-right"
  	const currentCoordinates = this.props.currentCoordinates
  	const emptyTileCoordinates = this.props.emptyTileCoordinates
  	const triggerBoardUpdate = this.props.triggerBoardUpdate
  	var el = typeof e.target === 'undefined' ? e : e.target 
  	if (el.classList.contains("tileInnerContainer")) {
  		el = el.parentElement
  	}

  	// move right
  		if (currentCoordinates[0] === emptyTileCoordinates()[0] && currentCoordinates[1] === emptyTileCoordinates()[1] - 1) {
  			el.classList.add(moveright)
  			setTimeout(function () {
  				el.classList.remove(moveright)
  				triggerBoardUpdate(currentCoordinates, emptyTileCoordinates())
  			}, 400)

  		}
  	// move left
  		if (currentCoordinates[0] === emptyTileCoordinates()[0] && currentCoordinates[1] === emptyTileCoordinates()[1] + 1) {
  			el.classList.add(moveleft)
  			setTimeout(function () {
  				el.classList.remove(moveleft)
  				triggerBoardUpdate(currentCoordinates, emptyTileCoordinates())
  			}, 400)

  		}
  	// move up
  		if (currentCoordinates[1] === emptyTileCoordinates()[1] && currentCoordinates[0] === emptyTileCoordinates()[0] + 1) {
  			el.classList.add(moveup)
  			setTimeout(function () {
  				el.classList.remove(moveup)
  				triggerBoardUpdate(currentCoordinates, emptyTileCoordinates())
  			}, 400)

  		}
  	// move down
  	if (currentCoordinates[1] === emptyTileCoordinates()[1] && currentCoordinates[0] === emptyTileCoordinates()[0] - 1 ) {
  		el.classList.add(movedown)
  		setTimeout(function () {
				el.classList.remove(movedown)
				triggerBoardUpdate(currentCoordinates, emptyTileCoordinates())
			}, 400)
  	}
  },
	render () {
		var is24game = this.props.boardWidth === 5
		var colorWin = is24game ? "colorWin24" : "colorWin"
		var basicTile = is24game ? "tileBorder24" : "tileBorder"
		var hintTile = is24game ? "hintTile24" : "hintTile"
		var emptyTile = is24game ? "emptyTile24" : "emptyTile"

		if (this.props.tileValue === 0) {
			return <div className={emptyTile}></div>
		}
		if (this.props.solveMove) {
			return <div ref={(el) => this.moveTile(el)} onClick={this.moveTile} className={basicTile}>
							<div id="hintTile" className="tileInnerContainer">{this.props.tileValue}</div>
						</div>
		}
		if (this.props.gameWon) {
			return <div className={colorWin}>
							<div className="tileInnerContainer">{this.props.tileValue}</div>
						</div>
		}
		if (this.props.isHintTile) {
			return <div onClick={this.moveTile} className={basicTile}>
							<div id="hintTile" className="tileInnerContainer">{this.props.tileValue}</div>
						</div>
		}
		return <div onClick={this.moveTile} className={basicTile}>
							<div className="tileInnerContainer">{this.props.tileValue}</div>
						</div>
	}
})

export default Tile