/**
 * @flow
 */

import React from 'react';
import { gql, graphql } from 'react-apollo';
import { Link } from 'react-router-dom';

type Props = {
  data?: Object
}

let ProgrammingLanguages = (props: Props) => {
  const { data } = props;
  const languages = data ? (data.languages || []) : [];
  return (
    <div>
      <h2>Language Route</h2>
      <p>The following languages have been fetched from the server:</p>
      <ul>
        {languages.map(({ name }) => (<li key={name}>{name}</li>))}
      </ul>
      <p>Reload this page and check the source of the site. It will contain the async result.</p>
      <Link to="/">Go Back</Link>
    </div>
  );
};

ProgrammingLanguages.defaultProps = {
  data: {}
};

ProgrammingLanguages = graphql(gql`
    query getLanguages {
        languages {
            name
        }
    }
`)(ProgrammingLanguages);

export default ProgrammingLanguages;

