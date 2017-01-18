import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import Tile from './Tile'

const Board = React.createClass({
	
	propTypes: {
		boardGrid: PropTypes.array
	},

	getInitialState: function() {
		const correctCoordinateHash = {};
		_.each(this.props.boardGrid, function(row, index1) {
			_.each(row, function(number, index2) {
				correctCoordinateHash[number.toString()] = [index1, index2];
			})
		});
		var boardHashingDictionary = this.createBoardHashingDict(4);
		var correctBoardHashString = 
			this.boardHashString(this.props.boardGrid, boardHashingDictionary);
    return {
    	boardWidth: 4,
    	emptyTileCoordinates: [3, 3],
    	boardGrid: this.props.boardGrid,
    	correctBoardHashString: correctBoardHashString,
    	correctBoardCoordinates: correctCoordinateHash,
    	boardHashingDictionary: boardHashingDictionary,
    	listOfBestMovesForCurrentBoard: [],
    	steppingThroughBoardHints: false,
    	numberOfMoves: 0,
    	gameWon: false,
    	showHint: false,
    	solvingBoard: false
    }
   },
  createNboard (N) {
  	var nBoard;
  	switch (N) {
  		case 3:
  			nBoard = [
	  			[1, 2, 3],
	  			[4, 5, 6],
	  			[7, 8, 0]
	  		];
	  		break;
	  	case 5:
	  		nBoard = [
	  			[1, 2, 3, 4, 5],
	  			[6, 7, 8, 9, 10],
	  			[11, 12, 13, 14, 15],
		  		[16, 17, 18, 19, 20],
		  		[21, 22, 23, 24, 0]
	  		];
	  		break;
	  	default: nBoard = this.props.boardGrid;
  	}
  	
  	var correctCoordinateHash = {}
		_.each(nBoard, function(row, index1) {
			_.each(row, function(number, index2) {
				correctCoordinateHash[number.toString()] = [index1, index2]
			})
		})

		var newBoardHashingDictionary = this.createBoardHashingDict(N);
  	var newCorrectBoardHash = this.boardHashString(nBoard, newBoardHashingDictionary);
  	this.setState({
    	boardWidth: N,
    	emptyTileCoordinates: [N - 1, N - 1],
    	boardGrid: nBoard,
    	correctBoardHashString: newCorrectBoardHash,
    	correctBoardCoordinates: correctCoordinateHash,
    	boardHashingDictionary: newBoardHashingDictionary,
    	listOfBestMovesForCurrentBoard: [],
    	steppingThroughBoardHints: false,
    	numberOfMoves: 0,
    	gameWon: false,
    	showHint: false,
    	solvingBoard: false
  	})
  },

	solveBoard (currentBoard, emptyTileCoordinates, userRequestingHints) {
		var alreadyVisitedBoards = {}
		if (typeof currentBoard === 'undefined') {
			currentBoard = this.state.boardGrid
		}

		if (typeof emptyTileCoordinates === 'undefined') {
			emptyTileCoordinates = this.state.emptyTileCoordinates;
		}

		var currentBoardHash = this.boardHashString(currentBoard);
		
		var frontierQueue = [];
		frontierQueue.push({
			board: currentBoard,
			emptyTileCoordinates: emptyTileCoordinates,
			boardHash: currentBoardHash,
			currentPathPreviousMoves:[]
		});

		while (frontierQueue.length) {
			var currentBoard = frontierQueue.shift();
			if (currentBoard.boardHash === this.state.correctBoardHashString) {
				if (userRequestingHints) {
					this.setState({
						showHint: true,
						steppingThroughBoardHints: true,
						listOfBestMovesForCurrentBoard: currentBoard.currentPathPreviousMoves
					});
				} else {
					this.setState({
						listOfBestMovesForCurrentBoard: currentBoard.currentPathPreviousMoves,
						steppingThroughBoardHints: true,
						solvingBoard: true,
						showHint: true})
				}
				break;
			} else {
				var possibleMoves = this.currentPossibleBoardMoves(
					currentBoard.board,
					currentBoard.emptyTileCoordinates
				);
				var boardsWithHeuristicApplied = [];
				for (var i=0; i < possibleMoves.length; i++) {
					var newState = {};
					var tempBoard = this.swapTiles(
						possibleMoves[i],
						currentBoard.emptyTileCoordinates,
						true,
						currentBoard.board
					);

					var tempEmptyTileCoordinates = possibleMoves[i];

					// if board has already been visited, continue;
					var tempBoardHash = this.boardHashString(tempBoard);
					if (alreadyVisitedBoards[tempBoardHash]) {
						continue;
					} else {
						var tempCurrentPathPreviousMoves = _.cloneDeep(currentBoard.currentPathPreviousMoves);
						tempCurrentPathPreviousMoves.push(possibleMoves[i]);
						alreadyVisitedBoards[tempBoardHash] = true;
						newState.board = tempBoard;
						newState.emptyTileCoordinates = tempEmptyTileCoordinates;
						newState.boardHash = tempBoardHash;
						newState.currentPathPreviousMoves = tempCurrentPathPreviousMoves;
						newState.boardManhattanDistance = this.getManhattanDistance(tempBoard);
						boardsWithHeuristicApplied.push(newState);
					}
				}
				
				frontierQueue = frontierQueue.concat(boardsWithHeuristicApplied);

				/*
					After getting the manhattan distance of all of the recently checked boards we
					add them to the queue of states to check next. I am using the built in javascript
					sort so it's constant insertion, but n*log n to sort at each step. Ideally I'd like 
					to use a priority queue here which would have constant insertion and log n lookup,
					but I ran out of time to implement the min-heap.
				*/
				frontierQueue.sort(function (b, a) {
  				return (b.boardManhattanDistance + b.currentPathPreviousMoves.length) - 
  					(a.boardManhattanDistance + a.currentPathPreviousMoves.length);
				})
			}
		}
	},

	getManhattanDistance(board) {
		var manhattanDistance = 0;
		for (var x=0; x < board.length; x++) {
			for (var y=0; y < board.length; y++) {
				var goalXY = this.state.correctBoardCoordinates[board[x][y]];
				var goalX = goalXY[0];
				var goalY = goalXY[1];
				manhattanDistance += Math.abs(x - goalX) + Math.abs(y - goalY);
			}
		}
		return manhattanDistance;
	},

  swapTiles(tileCoordinates, emptyTileCoordinates, returnBoard, boardGrid) {
  	const boardGridCopy = boardGrid == null ? this.state.boardGrid : _.cloneDeep(boardGrid);
  	const tile1 = boardGridCopy[tileCoordinates[0]][tileCoordinates[1]];
  	const tile2 = boardGridCopy[emptyTileCoordinates[0]][emptyTileCoordinates[1]];
  	boardGridCopy[tileCoordinates[0]][tileCoordinates[1]] = tile2;
  	boardGridCopy[emptyTileCoordinates[0]][emptyTileCoordinates[1]] = tile1;
  	if (returnBoard) {
  		return boardGridCopy;
  	} else {
  		this.setState({
  			boardGrid: boardGridCopy, 
  			emptyTileCoordinates: tileCoordinates, 
  			showHint:false, 
  			numberOfMoves: this.state.numberOfMoves + 1,
  		});
  	}
  },

  /*
   * Called to update the a board step
   */
  triggerBoardUpdate (tileCoordinates, emptyTileCoordinates) {
  	var currentNumberOfMoves = this.state.numberOfMoves;
  	if (this.state.steppingThroughBoardHints) {
  		var updatedBoard = this.swapTiles(tileCoordinates, emptyTileCoordinates, true)
  		if (_.isEqual(tileCoordinates, this.state.listOfBestMovesForCurrentBoard[0])){
  			var updatedListOfMoves = this.state.listOfBestMovesForCurrentBoard;
  			updatedListOfMoves.shift();
  			if (!updatedListOfMoves.length) {
  				this.setState({
	  				boardGrid: updatedBoard,
	  				emptyTileCoordinates: tileCoordinates,
	  				listOfBestMovesForCurrentBoard: [],
	  				steppingThroughBoardHints: false,
	  				showHint: false,
	  				solvingBoard: false,
	  				numberOfMoves: this.state.numberOfMoves + 1
  				})
  			} else {
  				this.setState({
  					boardGrid: updatedBoard,
  					emptyTileCoordinates: tileCoordinates,
  					listOfBestMovesForCurrentBoard: updatedListOfMoves,
  					showHint: false,
  					numberOfMoves: this.state.numberOfMoves + 1
  				})
  			}
  		} else {
  			this.setState({
  				boardGrid: updatedBoard,
  				emptyTileCoordinates: tileCoordinates,
  				listOfBestMovesForCurrentBoard: [],
  				steppingThroughBoardHints: false,
  				showHint: false,
  				numberOfMoves: this.state.numberOfMoves + 1
  			})
  		}
  	} else {
   		this.swapTiles(tileCoordinates, emptyTileCoordinates)
   	}
  },

  getEmptyTileCoordinates () {
  	return this.state.emptyTileCoordinates
  },

  createBoardHashingDict (boardWidth) {
  	var integerToLetterHashObject = {};
  	var numberOfKeys = typeof boardWidth === 'undefined' 
  		? (this.state.boardWidth * this.state.boardWidth) 
  		: boardWidth * boardWidth;
  	
  	var currentChar = 'a';

  	for (var i = 0; i < numberOfKeys; i ++) {
  		integerToLetterHashObject[i.toString()] = currentChar;
  		currentChar = String.fromCharCode(currentChar.charCodeAt() + 1);
  	}
  	return integerToLetterHashObject
  },

  boardHashString (board, hashDict) {
  	var hashedBoardString = ''
  	var boardHashDict = (typeof hashDict === "undefined") 
  		? this.state.boardHashingDictionary 
  		: (hashDict || this.createBoardHashingDict(board.length))
  	for (var i=0; i < board.length; i ++) {
  		for (var j=0; j < board.length; j++) {
  			hashedBoardString += boardHashDict[board[i][j].toString()]
  		}
  	}
  	return hashedBoardString
  },

  currentPossibleBoardMoves (board, emptyTileCoordinates) {
  	var possibleMoves = []
  	var x = emptyTileCoordinates[0]
  	var y = emptyTileCoordinates[1]
  	var boardWidth = this.state.boardWidth
  	// look at nodes that are adjacent to empty tile coord
  	if (x - 1 >= 0 && board[x - 1][y]) {
  		possibleMoves.push([x - 1, y])
  	}
  	if (x + 1 <= (boardWidth - 1) && board[x + 1][y]) {
  		possibleMoves.push([x + 1, y])
  	}
  	if (y - 1 >= 0 && board[x][y - 1]) {
  		possibleMoves.push([x, y - 1])
  	}
  	if (y + 1 <= (boardWidth - 1) && board[x][y + 1]) {
  		possibleMoves.push([x, y + 1])
  	}
	  return possibleMoves
  },

  /*
   *  shuffles the board slightly by performing four random moves
   */
  shuffleBoard() {
  	var N = 4
  	var emptyTileCoordinates = this.state.emptyTileCoordinates
  	var boardCopy = this.state.boardGrid
  	var visitedBoards = {};

  	for (var i = 0; i < N; i++) {
	  	var possibleMoves = this.currentPossibleBoardMoves(boardCopy, emptyTileCoordinates)
	  	var randomMoveIndex = Math.floor(Math.random() * (possibleMoves.length))

	  	var makeMove = function () {
	  		var randomMove = possibleMoves[randomMoveIndex]
		  	var boardCopy2 = this.swapTiles(randomMove, emptyTileCoordinates, true, boardCopy)
		  	var hashedCurrentBoard = this.boardHashString(boardCopy2)
		  	if (!visitedBoards[hashedCurrentBoard]) {
		  		visitedBoards[hashedCurrentBoard] = true
		  		emptyTileCoordinates = randomMove
		  		boardCopy = boardCopy2
		  		return;
		  	} else {
		  		possibleMoves.splice(randomMoveIndex, 1)
		  		randomMoveIndex = Math.floor(Math.random() * (possibleMoves.length))
		  		makeMove.call(this)
		  	}
	  	}

	  	makeMove.call(this)
	  	
	  }
	  this.setState({boardGrid: boardCopy, emptyTileCoordinates: emptyTileCoordinates});
  },

  renderBoard () {
		const triggerBoardUpdate = this.triggerBoardUpdate;
		const getEmptyTileCoordinates = this.getEmptyTileCoordinates;
		const solvingBoard = this.state.solvingBoard;
		const showHint = this.state.showHint;
		const boardWidth = this.state.boardWidth;
		const nextHint = 
			this.state.listOfBestMovesForCurrentBoard.length 
			? this.state.listOfBestMovesForCurrentBoard[0] : [];
		const gameWon = 
		  this.state.numberOfMoves > 0 
		  && this.state.correctBoardHashString === this.boardHashString(this.state.boardGrid);
		var rows = this.state.boardGrid.map(function(row, i) {
			var items = row.map(function(tileValue, j) {
				return (<td><Tile 
				currentCoordinates={[i, j]} 
				tileValue={tileValue}
				triggerBoardUpdate={triggerBoardUpdate}
				solveMove={solvingBoard && _.isEqual([i, j], nextHint)}
				emptyTileCoordinates={getEmptyTileCoordinates}
				isHintTile={showHint && _.isEqual([i, j], nextHint)}
				gameWon={gameWon}
				boardWidth={boardWidth}/></td>)
			})
			return (<tbody><tr>{items}</tr></tbody>)
		})
		return (<div><table>{rows}</table></div>)
	},

	showHint () {
		if (this.state.steppingThroughBoardHints) {
			this.setState({showHint: true});
		} else {
			this.solveBoard(this.state.boardGrid, this.state.emptyTileCoordinates, true)
		}
	},
	restartGame () {
		this.setState(this.getInitialState())
	},
	render () {
		if ((this.state.numberOfMoves > 0) &&
			this.state.correctBoardHashString === this.boardHashString(this.state.boardGrid)){
			return <div>
				<div className="sideBar"></div>
				<div className="notSideBar">
						<div className="containerWrapper">
							<img src={"https://s-media-cache-ak0.pinimg.com/originals/8d/14/9e/8d149e1e88e88441d28e4cacfedc4246.gif"}/>
							<div className="alignDiv">
									<div className="gameTitle">N-Puzzle</div>
									<div className="boardContainer">{this.renderBoard()}</div>
									<div className="youWonMessage">YOU WON!!</div>
									<div className="buttonContainer">
									<div className="restartButton" onClick={() => this.restartGame()}>Restart Game</div>
							</div>
						</div>
						<img src={"https://s-media-cache-ak0.pinimg.com/originals/8d/14/9e/8d149e1e88e88441d28e4cacfedc4246.gif"}/>
					</div>
				</div>
			</div>
		} else {
			return <div>
				<div className="sideBar">
						<div className="numberMovesContainer">
								<div className="numberMoves">{this.state.numberOfMoves}</div>
						</div>
						<div className="numberMovesDescription">Number Of Moves</div>
						<div>
								<div className="newPuzzleMenuItem" onClick={() => this.createNboard(3)}>8-Puzzle</div>
								<div className="newPuzzleMenuItem" onClick={() => this.createNboard(4)}>15-Puzzle</div>
								<div className="newPuzzleMenuItem" onClick={() => this.createNboard(5)}>24-Puzzle</div>	
						</div>
				</div>
					<div className="notSideBar">
							<div className="containerWrapper">
									<div className="alignDiv">
										<div className="gameTitle">
														{(this.state.boardWidth * this.state.boardWidth) - 1}
														-Puzzle</div>
										<div className="boardContainer">{this.renderBoard()}</div>
										<div className="buttonContainer">
											<div className="cell">
												<div onClick={() => this.shuffleBoard()}
															className="shuffleButton"> Shuffle Board </div>
											</div>
											<div className="cell">
												<div onClick={() => this.solveBoard()}
															className="solveButton"> Solve Board </div>
											</div>
											<div className="cell">	
												<div onClick={() => this.showHint()}
															className="hintButton"> Show Hint </div>
											</div>
										</div>
									</div>
							</div>
					</div>
			</div>
		}		
	},
	componentDidMount() {
		if (this.state && !this.state.correctBoardHashString) {
			var boardHashDict = this.createBoardHashingDict()
			var boardHashString = this.boardHashString(this.state.boardGrid, boardHashDict)
			this.setState({
				boardHashingDictionary: boardHashDict,
				correctBoardHashString: boardHashString})
		}
	}
})

export default Board