import * as React from 'react'
import PropTypes from 'prop-types';
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


//
const ProfileModal = ({ user, children }) => {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if (!user) {
        return null; // or return some fallback UI
    }

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
                            borderRadius: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            height: 410,
                        }}
                    >
                        <Typography
                            id="transition-modal-title"
                            variant="h6"
                            component="h2"
                            sx={{ fontSize: 40, fontFamily: "Work sans" }}
                        >
                            {user.name}
                        </Typography>
                        <IconButton onClick={handleClose}>
                            <CiSquareInfo />
                        </IconButton>
                        <Grid>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    height: '100%',
                                }}
                            >
                                <Avatar
                                    sx={{ width: 150, height: 150, borderRadius: '50%' }}
                                    src={user.pic}
                                    alt={user.name}
                                />
                                <Typography
                                    id="modal-description"
                                    sx={{ mt: 2, fontSize: { xs: '1.75rem', md: '1.875rem' }, fontFamily: 'Work sans' }}
                                >
                                    Email: {user.email}
                                </Typography>
                            </Box>
                        </Grid>
                        <Button onClick={handleClose}>Close</Button>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

ProfileModal.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        pic: PropTypes.string.isRequired,
    }),
    children: PropTypes.node,
};

export default ProfileModal;