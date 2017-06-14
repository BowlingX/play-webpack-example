/* global global */
/**
 * @flow
 */

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { ApolloClient } from 'react-apollo';
import { print } from 'graphql/language/printer';

type QueryExecutor = (query: string,
                      variables: string,
                      operationName: string,
                      callback: (result: string) => void,
                      reject: (error: string) => void) => void;
type JsInvoke = {
  apply: QueryExecutor
};

export default (queryExecutor?: JsInvoke) => {
  const options = {};
  if (queryExecutor) {
    options.ssrMode = true;
    options.networkInterface = {
      query: ({ query, variables, operationName }) => {
        return new Promise((resolve, reject) => {
          if (queryExecutor) {
            // if variables is empty, we need to provide a fallback, otherwise the method does not get executed
            queryExecutor.apply(print(query), JSON.stringify(variables) || "{}", operationName, (result) => {
              resolve(JSON.parse(result));
            }, (error) => {
              reject(JSON.parse(error));
            });
          }
        });
      }
    };
  }
  const client = new ApolloClient(options);
  const store = createStore(
    combineReducers({
      apollo: client.reducer()
    }),
    global.__STATE__ || {},
    compose(
      applyMiddleware(client.middleware()),
      // connect redux middleware
      (typeof global.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') ? global.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
    )
  );

  return { client, store };
};
