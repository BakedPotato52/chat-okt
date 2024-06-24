import React, { useState, useEffect, useRef } from 'react';
import { Button, Avatar, Typography, InputAdornment, IconButton } from '@mui/material';
import './Sidebar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PlusIcon, SearchIcon } from './Icons';
import ChatLoading from './ChatLoader';
import GroupModal from './Modals/GroupModal';
import axios from 'axios';
import { ChatState } from '../context/ChatProvider';
import { getSender } from '../config/ChatLogics';
import { Textarea } from '@mui/joy';
import ChatHeader from './ChatHeader';

function Sidebar({ fetchAgain }) {
    const searchInputRef = useRef(null);

    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get('/api/chat', config);
            console.log(data)
            setChats(data);
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        setLoggedUser(userInfo);

        if (userInfo && userInfo.token) {
            fetchChats();
        } else {
            toast.error('User is not logged in', {
                position: 'bottom-left',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        // eslint-disable-next-line
    }, [fetchAgain]);

    return (
        <>
            <ChatHeader />
            <div className="flex flex-col h-dvh max-sm:invisible">
                <div className="border-r border-gray-200 bg-white ">
                    <div className="flex items-center justify-end px-6 py-4 dark:border-gray-700">
                        <h2 className="text-lg font-semibold">Chats</h2>

                        <GroupModal>
                            <Button variant="ghost" size="icon">
                                <PlusIcon className="h-5 w-5" />
                            </Button>
                        </GroupModal>
                    </div>
                    <div className="flex-grow flex justify-center dark:bg-gray-900 items-center px-4">
                        <div className="w-full rounded-xl max-w-md text-gray-300">
                            <Textarea
                                type="text"
                                placeholder="Search"
                                className="rounded-full px-8 py-2 text-sm"
                                inputprops={{
                                    endAdornment: (
                                        <InputAdornment position='start'>
                                            <IconButton >
                                                <SearchIcon className="text-gray-400" />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                ref={searchInputRef}
                            />
                        </div>
                    </div>
                    <div className="h-[calc(100vh-64px)] overflow-y-auto">
                        <div className="space-y-4">
                            {chats ? (
                                chats.map((chat) => (
                                    <div
                                        key={chat._id} // Ensure the key is unique
                                        className={`flex flex-row items-center gap-4 rounded-lg p-4 transition-colors ${selectedChat === chat ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'
                                            }`}
                                        onClick={() => setSelectedChat(chat)}
                                    >
                                        <Avatar className="h-10 w-10" />
                                        <div className="flex-1">
                                            <h3 className="font-semibold">
                                                {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {chat.latestMessage && (
                                                    <Typography fontSize="xs">
                                                        <b>{chat.latestMessage.sender.name}:</b>
                                                        {chat.latestMessage.content.length > 50
                                                            ? chat.latestMessage.content.substring(0, 51) + '...'
                                                            : chat.latestMessage.content}
                                                    </Typography>
                                                )}
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-400 dark:text-gray-500">2h</span>
                                    </div>
                                ))
                            ) : (
                                <ChatLoading />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}

export default Sidebar;
