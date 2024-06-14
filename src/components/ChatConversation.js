import { useState, useEffect } from "react";
import {
    Box,
    IconButton,
    InputBase,
    Typography,
    CircularProgress,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { styled } from '@mui/material/styles';
import axios from "axios";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import ProfileModal from "./Modals/ProfileModal";
import UpdateChatModal from "./Modals/UpdateChatModal";
import { ChatState } from "../context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ChatScroll from "./ChatScroll";

const ENDPOINT = "http://localhost:4000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const useStyles = styled((theme) => ({
    chatHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        width: "100%",
        fontFamily: "Work sans",
        fontSize: theme.breakpoints.down('md') ? '28px' : '30px',
    },
    chatBox: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: theme.spacing(2),
        backgroundColor: "#E8E8E8",
        width: "100%",
        height: "100%",
        borderRadius: "8px",
        overflowY: "hidden",
    },
    messagesContainer: {
        overflowY: "auto",
    },
    typingIndicator: {
        marginBottom: theme.spacing(2),
        marginLeft: 0,
    },
    chatInput: {
        backgroundColor: "#E0E0E0",
        padding: theme.spacing(1),
        borderRadius: "4px",
    },
    noChatSelected: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
    },
}));

function ChatConversation({ fetchAgain, setFetchAgain }) {
    const classes = useStyles();
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
        if (!selectedChat) return;

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
        }
    };

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
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
                        chatId: selectedChat,
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
        fetchMessages();

        selectedChatCompare = selectedChat;
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
                    <Typography className={classes.chatHeader}>
                        <IconButton
                            onClick={() => setSelectedChat("")}
                        >
                            <ArrowBack />
                        </IconButton>
                        {messages &&
                            (!selectedChat.isGroupChat ? (
                                <>
                                    {getSender(user, selectedChat.users)}
                                    <ProfileModal
                                        user={getSenderFull(user, selectedChat.users)}
                                    />
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
                    </Typography>
                    <Box className={classes.chatBox}>
                        {loading ? (
                            <CircularProgress size={40} />
                        ) : (
                            <div className={classes.messagesContainer}>
                                <ChatScroll messages={messages} />
                            </div>
                        )}

                        <Box mt={2}>
                            {istyping && (
                                <div className={classes.typingIndicator}>
                                    <Lottie options={defaultOptions} width={70} />
                                </div>
                            )}
                            <InputBase
                                className={classes.chatInput}
                                placeholder="Enter a message..."
                                value={newMessage}
                                onChange={typingHandler}
                                onKeyDown={sendMessage}
                                fullWidth
                            />
                        </Box>
                    </Box>
                </>
            ) : (
                <Box className={classes.noChatSelected}>
                    <Typography variant="h4">
                        Click on a user to start chatting
                    </Typography>
                </Box>
            )}
        </>

    );
}

export default ChatConversation;