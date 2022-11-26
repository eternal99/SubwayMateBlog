import { dbService } from "fbase";
import React, { useEffect, useReducer, useState } from "react";
import {
    addDoc,
    collection,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import Nweet from "components/Nweet";

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);

    useEffect(() => {
        const q = query(collection(dbService, "nweets"), orderBy("createdAt"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const nweetArray = querySnapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                };
            });
            setNweets(nweetArray);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            const docRef = await addDoc(collection(dbService, "nweets"), {
                text: nweet,
                createdAt: Date.now(),
                creatorId: userObj.uid,
            });
        } catch (event) {
            console.log("Error adding document: ", event);
        }
        setNweet("");
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNweet(value);
    };
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    value={nweet}
                    onChange={onChange}
                    type="text"
                    placeholder="what's on your mind?"
                    maxLength={120}
                />
                <input type="submit" value="submit" />
            </form>
            <div>
                {nweets.map((nweet) => (
                    <Nweet
                        key={nweet.id}
                        nweetObj={nweet}
                        isOwner={nweet.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;
