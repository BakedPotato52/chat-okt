import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ChatProviderWrapper from './context/ChatProvider';
import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChatProviderWrapper>
        <App />
      </ChatProviderWrapper>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))

