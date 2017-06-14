/* global global, module */
/**
 * @flow
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import '../../sass/base.scss';
import createStore from '../store/store';

const { store, client } = createStore();

function browserRun(Component = Home) {
  const element = document.querySelector('[data-app]');
  ReactDOM.render(
    (
      <AppContainer>
        <BrowserRouter>
          <ApolloProvider store={store} client={client}>
            <Component />
          </ApolloProvider>
        </BrowserRouter>
      </AppContainer>
    ),
    element
  );
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
if (module.hot) {
  // $FlowFixMe:
  module.hot.accept('../pages/Home', () => {
    browserRun(Home);
  });
}
