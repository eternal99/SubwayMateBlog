import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "@firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTrash,
    faPencilAlt,
    faHeart,
    faComment,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { async } from "@firebase/util";

const Nweet = ({ nweetObj, isOwner }) => {
    const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
    const desertRef = ref(storageService, nweetObj.attachmentUrl);
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    // const [like, setLike] = useState(false);

    const onDeleteClick = async () => {
        const ok = window.confirm("정말 이 게시물을 삭제하시겠어요?");
        if (ok) {
            try {
                await deleteDoc(NweetTextRef);
                if (nweetObj.attachmentUrl !== "") {
                    await deleteObject(desertRef);
                }
            } catch (error) {
                window.alert("트윗을 삭제하는데 실패했습니다.");
            }
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await updateDoc(NweetTextRef, {
            text: newNweet,
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewNweet(value);
    };

    // const onLikeClick = async () => {
    //     if (like === true) {
    //         setLike(false);
    //     } else {
    //         setLike(true);
    //     }
    // };
    return (
        <div className="nweet">
            {editing ? (
                <>
                    {isOwner && (
                        <>
                            <form
                                onSubmit={onSubmit}
                                className="container nweetEdit"
                            >
                                <input
                                    type="text"
                                    placeholder="새로운 내용을 입력하세요"
                                    value={newNweet}
                                    required
                                    onChange={onChange}
                                />
                                <input
                                    type="submit"
                                    value="게시물 수정하기"
                                    className="formBtn"
                                />
                            </form>
                            <button onClick={toggleEditing}>취소</button>
                        </>
                    )}
                </>
            ) : (
                <>
                    <h4>{nweetObj.text}</h4>
                    {nweetObj.attachmentUrl && (
                        <img src={nweetObj.attachmentUrl} />
                    )}
                    {/* <div className="nweet_reaction">
                        <span onClick={onLikeClick}>
                            <FontAwesomeIcon
                                icon={like ? faHeart : emptyHeart}
                            />
                        </span>
                        <span onClick={onLikeClick}>
                            <FontAwesomeIcon icon={faComment} />
                        </span>
                    </div> */}
                    {isOwner && (
                        <div className="nweet__actions">
                            <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                            <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
export default Nweet;
