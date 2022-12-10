// import { authService } from "fbase";
import React from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { authService } from "fbase";
import AuthForm from "./AuthForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faSubway } from "@fortawesome/free-solid-svg-icons";

const Auth = () => {
    const onSocialClick = async (event) => {
        const {
            target: { name },
        } = event;

        let provider;

        if (name === "google") {
            provider = new GoogleAuthProvider();
        }
        await signInWithPopup(authService, provider);
    };
    return (
        <div className="authContainer">
            <FontAwesomeIcon
                icon={faSubway}
                color={"#04AAFF"}
                size="3x"
                style={{ marginBottom: 30 }}
            />
            <AuthForm />
            <div className="authBtns">
                <button
                    onClick={onSocialClick}
                    name="google"
                    className="authBtn"
                >
                    <FontAwesomeIcon icon={faGoogle} /> Google로 로그인하기
                </button>
            </div>
        </div>
    );
};

export default Auth;
