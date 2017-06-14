import React from 'react';
import { Route, Link } from 'react-router-dom';
import { HomeContainer } from './Home.scss';
import ProgrammingLanguages from '../container/ProgrammingLanguages';

const Home = () => {
  return (
    <div className={HomeContainer}>
      <h1>play-webpack-example</h1>

      <p>
        This is an example that uses <code>react-router</code> to render routes.
      </p>
      <Link to="/languages">Show Programming-Languages</Link>
      <Route path="/languages" component={ProgrammingLanguages} />
    </div>
  );
};

export default Home;
