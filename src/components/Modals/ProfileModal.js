import * as React from 'react'
import { CiSquareInfo } from "react-icons/ci";
import {
    Modal,
    Backdrop,
    Fade,
    Box,
    Typography,
    IconButton,
    Button,
    Grid,
    Avatar,
} from "@mui/material";


const ProfileModal = ({ user, children }) => {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            {children ? (
                <span onClick={handleOpen}>{children}</span>
            ) : (
                <IconButton onClick={handleOpen}>
                    <CiSquareInfo />
                </IconButton>
            )}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 400,
                            bgcolor: "background.paper",

                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <Typography
                            id="transition-modal-title"
                            variant="h6"
                            component="h2"
                            sx={{ fontSize: 40, fontFamily: "Work sans" }}
                        >
                            {user ? user.name : 'Unknown User'}
                        </Typography>
                        <IconButton onClick={handleClose}>
                            <CiSquareInfo />
                        </IconButton>
                        {user && (
                            <Grid
                                container
                                direction="column"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Avatar
                                    src={user.pic}
                                    alt={user.name}
                                    sx={{ width: 150, height: 150, borderRadius: "50%" }}
                                />
                                <Typography
                                    id="transition-modal-description"
                                    sx={{ mt: 2, fontSize: 28, fontFamily: "Work sans" }}
                                >
                                    Email: {user.email}
                                </Typography>
                            </Grid>
                        )}
                        <Button onClick={handleClose}>Close</Button>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default ProfileModal;