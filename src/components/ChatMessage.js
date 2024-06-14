import React, { useState } from 'react';
import { Button, Avatar } from '@mui/material';
import { ThumbsUpIcon } from './Icons';

function ChatMessage({ message }) {
    const [isLike, setLike] = useState(0);

    const handleLike = () => {
        if (isLike === 0) {
            setLike(1);
        } else {
            setLike(0);
        }
    };

    return (
        <>
            <div className="flex w-60 items-end p-2">
                <div className="flex-1 rounded-lg bg-blue-500 p-4 text-sm text-white">
                    <p>{message.text}</p>
                    <div className="mt-2 flex items-center justify-end gap-2">
                        <span className="text-xs">{message.timestamp}</span>
                        <Button variant="ghost" size="icon" onClick={handleLike}>
                            <ThumbsUpIcon className="h-4 w-4" />
                            <span className="sr-only">Like</span>
                        </Button>
                        {isLike > 0 && <span className="text-xs ml-2">1</span>}
                    </div>
                </div>
                <Avatar className="h-10 w-10">
                    <img src="/placeholder.svg" alt="Avatar" />
                </Avatar>
            </div>
        </>
    );
}

export default ChatMessage;
