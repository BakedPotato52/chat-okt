import React, { useState, useEffect } from 'react'
import { Button, Avatar, Typography } from '@mui/material';
import './Sidebar.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PlusIcon } from './Icons';
import ChatLoading from './ChatLoader';
import GroupModal from './Modals/GroupModal'
import axios from 'axios';
import { ChatState } from '../context/ChatProvider';
import { getSender } from '../config/ChatLogics';

function Sidebar({ fetchAgain }) {
    const [loggedUser, setLoggedUser] = useState();

    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

    const fetchChats = async () => {
        console.log(user._id);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get("/api/chat", config);
            setChats(data);
        } catch (error) {
            toast.error({
                title: "Error Occured!",
                description: "Failed to Load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };
    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
        fetchChats();
        // eslint-disable-next-line
    }, [fetchAgain]);

    return (
        <>
            <div className='flex flex-col h-dvh max-sm:invisible'>
                <div className="border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                        <h2 className="text-lg font-semibold">Conversations</h2>
                        <GroupModal>

                            <Button variant="ghost" size="icon">
                                <PlusIcon className="h-5 w-5" />
                                <span className="sr-only">New Conversation</span>
                            </Button>
                        </GroupModal>
                    </div>
                    <div className="h-[calc(100vh-64px)] overflow-y-auto">
                        <div className="space-y-4 p-6">
                            {chats ? (
                                <div className="space-y-4 p-6">
                                    {chats.map((chat) => (

                                        <nav
                                            href="#"
                                            className="flex flex-row items-center gap-4 rounded-lg bg-gray-100 p-4 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                                            prefetch='false'
                                            key={chat._id}
                                            onClick={() => setSelectedChat(chat)}
                                            bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                        >
                                            <Avatar className="h-10 w-10">

                                            </Avatar>
                                            <div className="flex-1">
                                                <h3 className="font-semibold">
                                                    {!chat.isGroupChat
                                                        ? getSender(loggedUser, chat.users)
                                                        : chat.chatName}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {chat.latestMessage && (
                                                        <Typography fontSize="xs">
                                                            <b>{chat.latestMessage.sender.name} : </b>
                                                            {chat.latestMessage.content.length > 50
                                                                ? chat.latestMessage.content.substring(0, 51) + "..."
                                                                : chat.latestMessage.content}
                                                        </Typography>
                                                    )}
                                                </p>
                                            </div>
                                            <span className="text-xs text-gray-400 dark:text-gray-500">2h</span>
                                        </nav>

                                    ))}
                                </div>
                            ) : (
                                <ChatLoading />
                            )}
                        </div>

                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default Sidebar

