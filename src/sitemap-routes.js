import { Route } from 'react-router';
import React from 'react';
import ROUTES from './constants/routes';

export default (
    <Route>
        <Route exact path={ROUTES.createArt} />
        <Route exact path={ROUTES.helpGuide} />
        <Route exact path={ROUTES.policy} />
        <Route exact path={ROUTES.terms} />
    </Route>
);
