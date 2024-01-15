import React, { useState, useEffect } from 'react';
import { db } from "../../firebase/FirebaseInit";
import './Profile.css';


function Profile({ user: authUser, username }) {
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        console.log("User prop:", authUser);

        if (!authUser) {
            // If userId is undefined, don't run the query
            return;
        }

        // Query to fetch only posts created by the specific user
        const unsubscribe = db.collection("posts")
            .where("userId", "==", authUser.uid)
            .onSnapshot(snapshot => {
                const fetchedPosts = snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data(),
                }));
                console.log("Snapshot data:", snapshot.docs);
                console.log(fetchedPosts);
                setUserPosts(fetchedPosts);
            });
        return () => unsubscribe();
    }, [authUser]);

    return (
        <div>
            <div className="both">
                <img className="profile-photo" src="/pictures/no_user.png" alt="No User Available" />
                <h1 className="profile-username">{username}</h1>
            </div>

            <div className="user-posts-grid">
                {userPosts.map(post => (
                    <div key={post.id} className="post">
                    <h3>{post.data.title}</h3>
                        {/* Check if the post has an imageUrl and render it */}
                        {post.data.imageUrl && (
                            <img src={post.data.imageUrl} alt={post.data.title} className="post-image" />
                        )}
                        {/* Add more post details */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Profile;

