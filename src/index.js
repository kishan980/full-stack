import React from 'react';
import ReactDOM from 'react-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ParallaxProvider } from 'react-scroll-parallax';

import { store } from './store/store';
import * as serviceWorker from './serviceWorker';
import App from './App';

import './index.css';

let persistor = persistStore(store);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
        <ParallaxProvider>


            <PersistGate loading={null} persistor={persistor}>
              <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <App />
              </GoogleOAuthProvider>
            </PersistGate>
            </ParallaxProvider>

        </Provider>

    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


