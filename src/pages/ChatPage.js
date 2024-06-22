import React, { useState } from "react";
import { Grid, Box } from "@mui/material";
import { ChatState } from "../context/ChatProvider";
import Sidebar from "../components/Sidebar";
import ChatConversation from "../components/ChatConversation";

function ChatPage() {
    const [fetchAgain, setFetchAgain] = useState(false);
    const { user } = ChatState();

    return (
        <Box sx={{ width: "100vw", overflowY: "none", height: "100dvh", display: "flex", flexDirection: "column" }}>

            <Grid container sx={{ flexGrow: 1 }}>


                {user && (
                    <>

                        <Sidebar fetchAgain={fetchAgain} />
                        <Grid item xs={12} md={9}>
                            <ChatConversation fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                        </Grid>
                    </>
                )}
            </Grid>
        </Box>
    );
}

export default ChatPage;
