import React, { useState } from 'react';
import { SendIcon } from './Icons';

function ChatInput({ onSendMessage }) {
    const [message, setMessage] = useState('');

    const handleChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSendMessage = () => {
        if (message !== '') {
            onSendMessage(message);
            setMessage('');

        }
    };

    return (
        <div className="flex justify-center w-full border-t border-gray-200 dark:border-gray-800 p-4">
            <div className="relative flex flex-row justify-end items-end w-full">
                <textarea
                    placeholder="Type your message..."
                    className="pr-16 min-h-[40px] right-0 rounded-lg w-full resize-none border border-gray-200 dark:border-gray-800 bg-transparent text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={message}
                    onChange={handleChange}
                />
                <button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-2 -translate-y-1/2"
                    onClick={handleSendMessage}
                >
                    <SendIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

export default ChatInput;
