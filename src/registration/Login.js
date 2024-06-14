//Login.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CssBaseline from '@mui/material/CssBaseline';
import { Avatar, Button, Grid, Box, Typography, Container, TextField, InputAdornment, IconButton, FormControlLabel, Checkbox } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
//import ChatHeader from "../components/ChatHeader"
import { ChatState } from "../context/ChatProvider";

const Login = () => {
    const notify = () => toast.success(`Welcome ${email}`);
    const notifyFail = () => toast.error("Log in Failed");

    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    const { setUser } = ChatState();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);


    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true)
        if (!email || !password) {
            toast({
                title: "Please Fill all the Feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post(
                "/api/user/login",
                { email, password },
                config
            );

            console.log(data);
            // Optionally, you can perform further actions here, such as redirecting the user or displaying a success message
            notify();
            setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            setTimeout(() => navigate(`/chats`), 4000);
        } catch (error) {
            console.error(error);
            setLoading(false)
            // Handle error scenarios, such as displaying an error message to the user
            notifyFail();
        }
    }

    useEffect(() => {
        return () => clearTimeout();
    }, []);

    return (
        <>

            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: '#155fa0' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={show ? "text" : "password"}
                            id="password"
                            autoComplete="new-password"
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClick}
                                            edge="end"
                                        >
                                            {show ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Sign in'}
                        </Button>
                        <Grid container justifyContent={"center"}>
                            <Grid item >
                                <Link className="font-medium text-[#00a3d9] hover:underline dark:text-[#00d9ff]"
                                    to={`/`}>
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link
                                    className="font-medium text-[#00a3d9] hover:underline dark:text-[#00d9ff] mt-4 inline-block"
                                    to={`/Forgetpassword`}
                                >
                                    Forgot your password?
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

            </Container>
            <ToastContainer />
        </>
    )
}
export default Login
