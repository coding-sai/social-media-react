import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Favorite from '@material-ui/icons/Favorite';
import { db, fb } from "../../firebase/FirebaseInit";

function Post({ postId, user, username, caption, imageUrl, userId }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

    // Function to delete the post
  const deletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await db.collection("posts").doc(postId).delete();
    }
  };

  const deleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await db.collection("posts").doc(postId).collection("comments").doc(commentId).delete();
    }
  };
  

  useEffect(() => {
    let unsubscribe;
    let unsubscribeLikes;

    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }
        )))});


      unsubscribeLikes = db
        .collection("posts")
        .doc(postId)
        .collection("likes")
        .onSnapshot((snapshot) => {
          setLikesCount(snapshot.size);
          setLiked(snapshot.docs.some(doc => doc.id === user?.uid));
        });

    }

    return () => {
      if (unsubscribe) unsubscribe();
      if (unsubscribeLikes) unsubscribeLikes();
    };
  }, [postId, user]);

  const postComment = (e) => {
    e.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      userId: user.uid,
      timestamp: fb.firestore.FieldValue.serverTimestamp(),
    });

    setComment("");
  };

  const toggleLike = async () => {

    if (!user) {
        // If there is no logged-in user, you can alert the user or handle this case as needed.
        alert("You must be logged in to like a post!");
        return;
      }

    const likeRef = db.collection("posts").doc(postId).collection("likes").doc(user?.uid);
    
    const doc = await likeRef.get();
    if (doc.exists) {
      likeRef.delete();
    } else {
      likeRef.set({ timestamp: fb.firestore.FieldValue.serverTimestamp() });
    }
  };

  return (
    <div className="post">
        <div className="post__header">
            <Avatar className="post__avatar" alt={username} src="/static/images/avatar/1.jpg" />
            <h3>{username}</h3>

            {user && user.uid === userId && (
                <button className="deletePostButton" onClick={deletePost}>
                    <img src="/icon-trash.png" alt="Delete" />
                </button>
            )}
        </div>
      
        <img className="post__image" src={imageUrl} alt="" />

        <h4 className="post__text">
            <strong>{username}</strong> {caption}
        </h4>

        <div className="post__actions">
            <IconButton onClick={toggleLike}>
            {liked ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
            <span>{likesCount} likes</span>
        </div>

        <div className={comments.length > 0 ? "post__comments" : ""}>
            {comments.map((comment) => (
            <div key={comment.id} className="comment">
                <p>
                    <strong>{comment.username}</strong> {comment.text}
                </p>

                {user && user.uid === comment.userId && (
                    <button className="deleteCommentButton" onClick={() => deleteComment(comment.id)}>
                    <img src="/icon-trash.png" alt="Delete" />
                    </button>
                )}
            </div>
            ))}
        </div>

        {user && (
        <form className="comment__form" onSubmit={postComment}>
        <div className="comment__wrapper">
            <input
              className="comment__Input"
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="comment__button text__button"
              disabled={!comment}
              type="submit"
            >
              Post
            </button>
        </div>

        <div key={comment.id} className="comment">
            <p>
                <strong>{comment.username}</strong> {comment.text}
            </p>
                {user && user.uid === comment.userId && (
                    <button onClick={() => deleteComment(comment.id)}>
                    Delete
                    </button>)}
        </div>


        </form>
      )}
    </div>
  );
}

export default Post;
