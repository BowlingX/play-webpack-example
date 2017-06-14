/**
 * @flow
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import '../../sass/base.scss';
import BaseContainerCreator from '../store/BaseContainer';

function browserRun() {
  const { BaseContainer } = BaseContainerCreator();
  const element = document.querySelector('[data-app]');
  ReactDOM.render(<BrowserRouter><BaseContainer><Home /></BaseContainer></BrowserRouter>, element);
}

if (global.document) {
  if (['complete', 'loaded', 'interactive']
      .filter(v => v === document.readyState).length > 0 && document.body) {
    browserRun();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      browserRun();
    }, false);
  }
}
