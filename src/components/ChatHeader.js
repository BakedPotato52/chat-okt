import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, ClickAwayListener, Grow, Paper, Popper, MenuItem, MenuList, Stack, CircularProgress, TextField, IconButton, InputAdornment, Popover } from '@mui/material';
import { MessageSquareIcon, SearchIcon } from './Icons'
import { FiBell } from "react-icons/fi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChatState } from '../context/ChatProvider';
import ProfileModal from './Modals/ProfileModal';
import ChatLoading from './ChatLoader';
import UserListItem from './userAvatar/UserListItem';
import { getSender } from '../config/ChatLogics';

import avatar from '../avatar.png'; // Assuming you have a placeholder avatar image

function ChatHeader() {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    const [anchorEl, setAnchorEl] = useState(null);

    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    const history = useNavigate();
    const notificationAnchorRef = useRef(null);
    const profileAnchorRef = useRef(null);
    const prevNotificationOpen = useRef(notificationOpen);
    const prevProfileOpen = useRef(profileOpen);

    const handleNotificationToggle = () => {
        setNotificationOpen((prevOpen) => !prevOpen);
    };

    const handleProfileToggle = () => {
        setProfileOpen((prevOpen) => !prevOpen);
    };

    const handleNotificationClose = (event) => {
        if (notificationAnchorRef.current && notificationAnchorRef.current.contains(event.target)) {
            return;
        }
        setNotificationOpen(false);
    };

    const handleProfileClose = (event) => {
        if (profileAnchorRef.current && profileAnchorRef.current.contains(event.target)) {
            return;
        }
        setProfileOpen(false);
    };

    const handleListKeyDown = (event) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            setNotificationOpen(false);
            setProfileOpen(false);
        } else if (event.key === 'Escape') {
            setNotificationOpen(false);
            setProfileOpen(false);
        }
    };
    //
    useEffect(() => {
        if (prevNotificationOpen.current === true && notificationOpen === false) {
            notificationAnchorRef.current.focus();
        }
        prevNotificationOpen.current = notificationOpen;

        if (prevProfileOpen.current === true && profileOpen === false) {
            profileAnchorRef.current.focus();
        }
        prevProfileOpen.current = profileOpen;
    }, [notificationOpen, profileOpen]);

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history("/");
    };

    const handleSearch = async () => {
        if (!search) {
            toast.warn("Please enter something in search", {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const data = await axios.get(`/api/user?search=${search}`, config);
            setSearchResult(data);
            console.warn(data)
            setLoading(false);
        } catch (error) {
            toast.error("Failed to load search results", {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setLoading(false);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSearchResult("");
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(`/api/chat`, { userId }, config);

            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats]);
            }
            setSelectedChat(data);
            setLoadingChat(false);
            setNotificationOpen(false);
            setProfileOpen(false);

        } catch (error) {
            toast.error("Error fetching the chat", {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setLoadingChat(false);
        }
    };

    const open = Boolean(anchorEl);
    const id = open ? 'search-popover' : undefined;

    return (
        <header className="flex select-none w-full flex-row items-center justify-between bg-gray-900 px-6 py-4 text-white">
            <div className="flex items-center gap-4">
                <Link to={`/`} className='flex flex-row gap-2 items-center justify-center'>
                    <MessageSquareIcon className="h-6 w-6" />
                    <h1 className="text-xl font-semibold">Chat App</h1>
                </Link>
            </div>
            <div className="flex-grow flex justify-center items-center px-4">
                <div className="w-full rounded-full max-w-md text-gray-300">
                    <TextField
                        fullWidth
                        type="text"
                        placeholder="Search conversations"
                        className="rounded-full bg-gray-800  px-8 py-2 text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleSearch}>
                                        <SearchIcon className="text-gray-400" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        PaperProps={{ style: { width: '300px' } }}
                    >
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}
                        {loadingChat && <CircularProgress variant="solid" />}
                    </Popover>
                </div>
            </div>
            <Stack direction="row" spacing={2} sx={{ ml: 'auto' }}>
                <div>
                    <IconButton ref={notificationAnchorRef} aria-controls={notificationOpen ? 'menu-list-grow' : undefined} aria-haspopup="true" onClick={handleNotificationToggle}>
                        <FiBell className='text-gray-400' />
                    </IconButton>
                    <Popper open={notificationOpen} anchorEl={notificationAnchorRef.current} role={undefined} transition disablePortal>
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{ transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom' }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleNotificationClose}>
                                        <MenuList autoFocusItem={notificationOpen} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                            {!notification.length && <MenuItem>No New Messages</MenuItem>}
                                            {notification.map((notif) => (
                                                <MenuItem
                                                    key={notif._id}
                                                    onClick={() => {
                                                        setSelectedChat(notif.chat);
                                                        setNotification(notification.filter((n) => n !== notif));
                                                    }}
                                                >
                                                    {notif.chat.isGroupChat
                                                        ? `New Message in ${notif.chat.chatName}`
                                                        : `New Message from ${getSender(user, notif.chat.users)}`}
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </div>
                <div>
                    <Avatar
                        ref={profileAnchorRef}
                        id="composition-button"
                        aria-controls={profileOpen ? 'composition-menu' : undefined}
                        aria-expanded={profileOpen ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleProfileToggle}
                        alt={user ? user.name : 'Unknown User'}
                        src={user ? user.pic : avatar}
                    />
                    <Popper open={profileOpen} anchorEl={profileAnchorRef.current} role={undefined} placement="bottom-start" transition disablePortal>
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{ transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom' }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleProfileClose}>
                                        <MenuList autoFocusItem={profileOpen} id="composition-menu" aria-labelledby="composition-button" onKeyDown={handleListKeyDown}>
                                            <ProfileModal user={user}>
                                                <MenuItem>Profile</MenuItem>
                                            </ProfileModal>
                                            <MenuItem onClick={handleProfileClose}>My account</MenuItem>
                                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </div>
            </Stack>
            <ToastContainer />
        </header>
    );
}

export default ChatHeader;
