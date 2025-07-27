import React from 'react';
import { File } from './Icons';

const ChatMessage = ({ message, hasForm }) => {
  return (
    <div className="message">
      <div className="bot-message">
        {message}
        
        {hasForm && (
          <div className="form-notification">
            <div className="form-notification-title">
              <File size={20} />
              Application Form Available
            </div>
            <div className="form-notification-text">
              A government form is available for this scheme
            </div>
            <button className="open-form-button">Open Form</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;