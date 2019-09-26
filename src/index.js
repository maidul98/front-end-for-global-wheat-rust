import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware, compose} from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';

import reducers from './reducers';

var middleware = process.env.NODE_ENV === 'development' ? 
    applyMiddleware(logger ,thunk, promiseMiddleware()) :
    applyMiddleware(thunk, promiseMiddleware())
    ;

var store = createStore(reducers, 
    compose(
        middleware,
        // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, document.getElementById('root'));
registerServiceWorker();
