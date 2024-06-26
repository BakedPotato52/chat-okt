import { useState, useEffect } from "react";
import {
    Box,
    IconButton,
    InputBase,
    Typography,
    CircularProgress,
    Avatar,
    Button,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { styled } from '@mui/system';
import axios from "axios";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import ProfileModal from "./Modals/ProfileModal";
import UpdateChatModal from "./Modals/UpdateChatModal";
import { ChatState } from "../context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ChatScroll from "./ChatScroll";
import { PhoneIcon, VideoIcon } from "./Icons";

const ENDPOINT = "http://localhost:5000"; // -> After deployment
var socket, selectedChatCompare;


const ChatBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: theme.spacing(2),
    backgroundColor: "#E8E8E8",
    overflow: "scroll",
    width: "100%",
    height: "100%",
    borderRadius: "8px",
    overflowY: "hidden",
}));

const MessagesContainer = styled(Box)({
    overflowY: "scroll",
    flex: 1,
});

const TypingIndicator = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    marginLeft: 0,
}));

const ChatInput = styled(InputBase)(({ theme }) => ({
    backgroundColor: "#E0E0E0",
    padding: theme.spacing(1),
    borderRadius: "4px",
    width: "100%",
}));

const NoChatSelected = styled(Box)({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    textAlign: "center",
    padding: "0 20px",
});

function ChatConversation({ fetchAgain, setFetchAgain }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const { selectedChat, setSelectedChat, user, notification, setNotification } =
        ChatState();

    const fetchMessages = async () => {
        if (!selectedChat || !selectedChat._id) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(
                `/api/message/${selectedChat._id}`,
                config
            );
            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            alert("Failed to load the messages");
            setLoading(false); // Stop loading even if there's an error
        }
    };

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage && selectedChat && selectedChat._id) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(
                    "/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    },
                    config
                );
                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                alert("Failed to send the message");
            }
        }
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (selectedChat && selectedChat._id) {
            fetchMessages();
            selectedChatCompare = selectedChat;
        }
        // eslint-disable-next-line
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageReceived.chat._id
            ) {
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageReceived]);
            }
        });
    });

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    return (
        <>
            {selectedChat ? (
                <>
                    <header class="flex flex-1 flex-col text-3xl md:text-2xl">
                        <div className="border-b p-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="border">
                                    <Avatar src="/placeholder-user.jpg" />
                                </Avatar>
                                <div>
                                    <h2 className="text-lg font-medium">{getSender(user, selectedChat.users)}</h2>
                                    <p className="text-xs text-muted-foreground">Active 2 hours ago</p>
                                </div>
                                <div className="ml-auto flex items-center gap-2">
                                    <Button variant="ghost" size="icon">
                                        <PhoneIcon className="h-5 w-5" />
                                        <span className="sr-only">Call</span>
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <VideoIcon className="h-5 w-5" />
                                        <span className="sr-only">Video Call</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <IconButton onClick={() => setSelectedChat(null)}>
                            <ArrowBack />
                        </IconButton>
                        {messages && selectedChat.users && selectedChat.users.length > 0 && (!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateChatModal
                                    fetchMessages={fetchMessages}
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                />
                            </>
                        ))}
                    </header>
                    <ChatBox>
                        {loading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                <CircularProgress size={40} />
                            </Box>
                        ) : (
                            <MessagesContainer>
                                <ChatScroll messages={messages} />
                            </MessagesContainer>
                        )}
                        <Box mt={2}>
                            {istyping && (
                                <TypingIndicator>
                                    <Lottie options={defaultOptions} width={70} />
                                </TypingIndicator>
                            )}
                            <ChatInput
                                placeholder="Enter a message..."
                                value={newMessage}
                                onChange={typingHandler}
                                onKeyDown={sendMessage}
                            />
                        </Box>
                    </ChatBox>
                </>
            ) : (
                <NoChatSelected>
                    <Typography variant="h4">
                        Click on a user to start chatting
                    </Typography>
                </NoChatSelected>
            )}
        </>
    );
}

export default ChatConversation;
