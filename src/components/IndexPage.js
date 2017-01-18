'use strict';

import React, { PropTypes} from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom'
import boardArray from '../data/boardData'
import Board from './Board'
import _ from 'lodash'

const Layout = React.createClass({
  render () {
    return (
      <div className="app-container">
        <header>
        </header>
        <div className="app-content"><Board boardGrid={boardArray}/></div>
        <footer>
        </footer>
      </div>
    );
  }
})
export default Layout