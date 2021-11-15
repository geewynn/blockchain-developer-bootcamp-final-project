import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AccountContextProvider from './contexts/account-context'
import FunctionContextProvider from './contexts/function-context';
import LoadingContextProvider from './contexts/loading-context'
import TabsContextProvider from './contexts/tabs-context'

ReactDOM.render(
  <React.StrictMode>
    <AccountContextProvider>
      <FunctionContextProvider>
        <LoadingContextProvider>
          <TabsContextProvider>

          <App /> 
          </TabsContextProvider>

        </LoadingContextProvider>
      </FunctionContextProvider>

    </AccountContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

