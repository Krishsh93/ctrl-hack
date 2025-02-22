import React from 'react';
import { ChatEngine } from 'react-chat-engine';

function Messages() {
  return (
    <div className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-slate-200">
      <ChatEngine
        projectID='cececc70-f0eb-4ec9-a0c5-2c4dfbed12fe'
        userName='krish'
        userSecret='hello'
      />
    </div>
  );
}

export default Messages;
