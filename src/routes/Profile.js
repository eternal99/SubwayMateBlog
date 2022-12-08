import { signOut, updateProfile } from "firebase/auth";
import React, { useState, useEffect, useRef } from "react";
import { authService, dbService, storageService } from "fbase";
import { useHistory } from "react-router-dom";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const Profile = ({ refreshUser, userObj }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [attachment, setAttachment] = useState("");
    const fileInput = useRef();
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };

    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewDisplayName(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";

        if (userObj.displayName !== newDisplayName) {
            await updateProfile(authService.currentUser, {
                displayName: newDisplayName,
            });
            refreshUser();
        }
        if (attachment !== "") {
            const fileRef = ref(storageService, `${userObj.uid}/"profile"`);
            const response = await uploadString(
                fileRef,
                attachment,
                "data_url"
            );
            attachmentUrl = await getDownloadURL(response.ref);
        }
    };

    const getMyNweets = async () => {
        const q = query(
            collection(dbService, "nweets"),
            where("creatorId", "==", userObj.uid),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, "=>", doc.data());
        });
    };
    const onFileChange = (event) => {
        const {
            target: { files },
        } = event;

        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };
    useEffect(() => {
        getMyNweets();
    }, []);
    const onClearAttachmentClick = () => {
        fileInput.current.value = "";
        setAttachment(null);
    };

    return (
        <div className="container">
            {/* <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                ref={fileInput}
            />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img
                        src={attachment}
                        style={{ backgroundImage: attachment }}
                        alt=""
                    />

                    <div
                        className="factoryForm__clear"
                        onClick={onClearAttachmentClick}
                    >
                        <span>Remove</span> <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )} */}
            <form onSubmit={onSubmit} className="profileForm">
                <input
                    onChange={onChange}
                    type="text"
                    autoFocus
                    placeholder="Display name"
                    value={newDisplayName}
                    className="formInput"
                />
                <input
                    type="submit"
                    value="닉네임 변경하기"
                    className="formBtn"
                    style={{
                        marginTop: 10,
                    }}
                />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                로그아웃
            </span>
        </div>
    );
};

export default Profile;
