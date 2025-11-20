import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { ChatBox } from './components/chat/ChatBox';
import './styles/globals.css';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <ChatBox />
      </div>
    </Provider>
  );
}

export default App;