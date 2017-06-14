/* eslint react/no-children-prop: 0 */
/**
 * @flow
 */

import React, { Children } from 'react';
import { ApolloProvider } from 'react-apollo';
import createStore from './store';

type Props = {
  children: ?Children
}

export const BaseContainer = (store:Object, client:Object) => (props: Props) => {
  const { children } = props;

  return (
    <ApolloProvider store={store} client={client} children={children} />
  );
};

export default (...args?:Array<any>) => {
  const { store, client } = createStore(...args);
  return { BaseContainer: BaseContainer(store, client), store, client };
};
