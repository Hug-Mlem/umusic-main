import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "./App.css";
import "./customer.css";
import { Provider } from 'react-redux';
import store from './redux/store/index';

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
	<Provider store={store}>

			<App />
	</Provider>, document.getElementById('root')
);


serviceWorker.unregister();