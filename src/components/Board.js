import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import Tile from './Tile'

const Board = React.createClass({
	propTypes: {
		boardArray: PropTypes.array
	},
	getInitialState: function() {
		const correctCoordHash = {}
		_.each(this.props.boardArray, function(row, index1) {
			_.each(row, function(number, index2) {
				correctCoordHash[number.toString()] = [index1, index2]
			})
		})
		console.log('correctCoordHash: ', correctCoordHash)
    return {
    	boardManhattanDistance: 0,
    	updateBoard: false,
    	boardWidth: 4,
    	emptyTileCoords: [3, 3],
    	boardArray: this.props.boardArray,
    	firstTimeRenderBoard: true
    }
   },
  swapTiles (coords1, coords2) {
  	console.log('coords2: ', coords2)
  	const boardArrayCopy = _.cloneDeep(this.state.boardArray)
  	console.log('in swapTiles method:')
  	//console.log('boardBeforeSwap: ', boardArrayCopy)
  	const tile1 = boardArrayCopy[coords1[0]][coords1[1]]
  	console.log('tile1 = ', tile1)
  	console.log('will be going to coord where: ', boardArrayCopy[coords2[0]][coords2[1]])
  	const tile2 = boardArrayCopy[coords2[0]][coords2[1]]
  	console.log('tile2 (should be empty tile) = ', tile2)
  	console.log('will be going to coord where: ', boardArrayCopy[coords1[0]][coords1[1]])
  	boardArrayCopy[coords1[0]][coords1[1]] = tile2
  	boardArrayCopy[coords2[0]][coords2[1]] = tile1
  	// console.log('boardarray[0][0]**: ', boardArrayCopy[0][2])
  	console.log('boardAfterSwap: ', boardArrayCopy)
  	this.setState({boardArray: boardArrayCopy, emptyTileCoords: coords1})
  },
  triggerBoardUpdate (coords1, coords2) {
   	this.swapTiles(coords1, coords2)
  },
  getEmptyTileCoords () {
  	return this.state.emptyTileCoords
  },
	setBoard () {
		console.log("SETTING BOARD")
		const triggerBoardUpdate = this.triggerBoardUpdate
		const getEmptyTileCoords = this.getEmptyTileCoords
		const boardWidth = this.state.boardWidth
		//console.log('trigger udpate func: ', triggerBoardUpdate)
		//console.log('this.state.boardArray = ', this.state.boardArray)
		var boardArrayCopy = _.cloneDeep(this.state.boardArray)
		var boardArr = _.cloneDeep(this.state.boardArray)

		//console.log('BOARDARR: ', boardArr)
		_.each(boardArrayCopy, function(row, index1) {
			_.each(row, function (number, index2) {
				//console.log('coord: ', [index1, index2])
				boardArrayCopy[index1][index2] = <Tile 
				goalCoordinates={[index1, index2]} 
				currentCoordinates={[index1, index2]} 
				tileNumber={number}
				triggerBoardUpdate={triggerBoardUpdate}
				boardWidth={boardWidth}
				emptyTileCoords={getEmptyTileCoords}/>
			})
		})
		// console.log('boardArrayCopy: ', boardArrayCopy)
		this.setState({boardArray: boardArrayCopy, firstTimeRenderBoard: false})
	},
	markAllMoveableTiles () {

	},
	componentWillMount () {
		//console.log('in componentWillMount')
		if (this.state.firstTimeRenderBoard) {
			this.setBoard()
		}
	},
	render () {
			var boardMatrix = _.cloneDeep(this.state.boardArray)
			console.log('boardmatrix: ', boardMatrix)
			//markAllMoveableTiles()
			console.log('re-rendering board!!::', this.state.boardArray)
			// console.log('boardarray[0][0]: ', this.state.boardArray[0][0])
			return <div><div className="boardContainer">{boardMatrix}</div></div>
		
	},
	componentDidMount () { 
		//console.log('COMPONENT DID MOUNT')
	}



})

export default Board