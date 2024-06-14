import React, { createContext, useContext, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

function ChatProvider({ children }) {
    const [selectedChat, setSelectedChat] = useState();
    const [user, setUser] = useState();
    const [notification, setNotification] = useState([]);
    const [chats, setChats] = useState();

    return (
        <ChatContext.Provider
            value={{
                selectedChat,
                setSelectedChat,
                user,
                setUser,
                notification,
                setNotification,
                chats,
                setChats,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

function ChatProviderWrapper({ children }) {
    const navigate = useNavigate();

    useLayoutEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo) navigate("/");
    }, [navigate]);

    return <ChatProvider>{children}</ChatProvider>;
}

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProviderWrapper;
