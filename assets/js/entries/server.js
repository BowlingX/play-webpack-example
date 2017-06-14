/**
 * @flow
 */

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { getDataFromTree } from "react-apollo/lib/server";
import { StaticRouter } from 'react-router';
import BaseContainerCreator from '../store/BaseContainer';
import Home from '../pages/Home';

global.render = (queryExecutor, path:string) => {
  const { BaseContainer, client } = BaseContainerCreator(queryExecutor);
  const context = {};

  const app = (
    <StaticRouter location={path} context={context}>
      <BaseContainer>
        <Home />
      </BaseContainer>
    </StaticRouter>
  );

  return getDataFromTree(app).then(() => {
    const initialState = { apollo: client.getInitialState() };
    const content = ReactDOMServer.renderToString(app);
    return { content, initialState: JSON.stringify(initialState), context };
  });
};
