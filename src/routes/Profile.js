import { signOut } from "firebase/auth";
import React, { useCallback } from "react";
import { authService } from "fbase";
import { useHistory } from "react-router-dom";

export default () => {
    const history = useHistory();
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
        console.log("home");
    };
    return (
        <>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};
