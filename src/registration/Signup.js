//Signup.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CssBaseline from '@mui/material/CssBaseline';
import { Avatar, Button, Grid, Box, Typography, Container, TextField, InputAdornment, IconButton } from "@mui/material";
import { styled } from '@mui/material/styles'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
//import ChatHeader from "../components/ChatHeader";

const SignUp = () => {
    const notify = () => toast.success("Sign Up Successful");

    const notifyFail = () => toast.error("Sign Up Failed");

    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pic, setPic] = useState();
    const [picLoading, setPicLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setPicLoading(true);
        if (!firstName || !lastName || !email || !password) {
            toast.warning("Please fill all the fields", {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setPicLoading(false);
            setPic(false)
            return;
        }
        console.log(firstName, lastName, email, password, pic);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post(
                "/api/user",
                {
                    firstName,
                    lastName,
                    email,
                    password,
                    pic,
                },
                config
            );
            console.log(data);

            localStorage.setItem("userInfo", JSON.stringify(data));
            setPicLoading(false);
            navigate.push("/chats");
            // Optionally, you can perform further actions here, such as redirecting the user or displaying a success message
            notify();
            setTimeout(() => navigate(`/login`), 4000);
        } catch (error) {
            console.error(error);
            notifyFail();

            // Handle error scenarios, such as displaying an error message to the user
        } finally {
            setPicLoading(false);
        }
    }

    const postDetails = (pics) => {
        setPicLoading(true);
        if (pics === undefined) {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }
        //375329223321574:mN2Vsof-9rODefdmI2YKFK4vUoc
        console.log(pics);
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "kanak-acharya");
            fetch("https://api.cloudinary.com/v1_1/kanak-acharya/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    console.log(data.url.toString());
                    setPicLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setPicLoading(false);
                });
        } else {
            toast.warning({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            setPicLoading(false);
            return;
        }
    };

    useEffect(() => {
        return () => clearTimeout();
    }, []);

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

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
                    <Avatar sx={{ m: 1, bgcolor: '#00897b' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required={true}
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required={true}
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required={true}
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12}>
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
                            </Grid>


                        </Grid>
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            style={{ marginTop: 15, justifyContent: "center", alignItems: "center", backgroundColor: "navy" }}
                            tabIndex={-1}
                            type="file"
                            startIcon={<CloudUploadIcon />}
                            onChange={(e) => postDetails(e.target.files[0])}
                            isloading={picLoading}
                        >
                            {picLoading ? 'Uploading.....' : 'Upload file'}
                            <VisuallyHiddenInput type="file" />
                        </Button>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={picLoading}
                        >
                            {picLoading ? 'Loading...' : 'SignUP'}
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item >
                                <Link className="font-medium text-[#00a3d9] hover:underline dark:text-[#00d9ff]"
                                    to={`/login`}>
                                    {"Already have an account? Sign In"}
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

export default SignUp;
