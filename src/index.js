import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { awsSecretAccessKey, awsAccessKeyId } from './keys'

import * as AWS from 'aws-sdk'
import { ConfigurationOptions } from 'aws-sdk'

const configuration = {
	region: 'us-east-2',
    secretAccessKey: awsSecretAccessKey,
    accessKeyId: awsAccessKeyId
}


AWS.config.update(configuration);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
