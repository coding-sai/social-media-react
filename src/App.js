import React, { useState, useEffect } from "react";
import Post from "./components/post/Post";
import "./App.css";
import { db, auth } from "./firebase/FirebaseInit";
import { makeStyles } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import ImageUpload from "./components/imageUpload/ImageUpload";
import Profile from './components/profile/Profile';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(() => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: "rgba(255,255,255,1)",
    boxShadow: 24,
    padding: "30px 60px",
    borderRadius: "12px",
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [openSignup, setOpenSignup] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);



  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {

        setUser(null);
      }
    });
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signUp = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {


        db.collection("users").add({
          username,
          email
        });

        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((err) => alert(err.message));

    setOpenSignup(false);
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const login = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message));

    setOpenLogin(false);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="app">
      <Modal open={openSignup} onClose={() => setOpenSignup(false)}>
        <div style={modalStyle} className={classes.paper}>
            <div>
                <img className="Signerup" src="/Kwinkit name and slogan.png" alt="Kwinkit - Start a change" />
            </div>
          <form className="app__signUp">
            <input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              placeholder="Email address"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="primary__button" type="submit" onClick={signUp}>
              Sign up
            </button>
          </form>

          <center className="authFooter">
            <small>
              &copy; 2023 Social Media by{" "}
              <a href="mailto:support@yahoo.com"> Jake Silva</a>
            </small>
          </center>
        </div>
      </Modal>

      {/* Change modal open to be determined by openLogin */}
      <Modal open={openLogin} onClose={() => setOpenLogin(false)}>
        <div style={modalStyle} className={classes.paper}>
          
            <div>
                <img className="Signerup" src="/Kwinkit name and slogan.png" alt="Kwinkit - Start a change" />
            </div>

          <form className="app__signUp">
            <input
              placeholder="Email address"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="primary__button" type="submit" onClick={login}>
              Log in
            </button>
          </form>

          <center className="authFooter">
            <small>
              &copy; 2023 Social Media by{" "}
              <a href="mailto:support@yahoo.com"> Jake Silva</a>
            </small>
          </center>
        </div>
      </Modal>

      <div className="app__header">
        <div className="app__headerWrapper">
         <div>
            <img className="logo" src="/Kwinkit logo.png" alt="Kwinkit" />
        </div>

          {user ? (
            <button className="text__button" onClick={() => auth.signOut()}>
              Logout
            </button>
          ) : (
            <div className="app__headerButtons">
              <button
                className="primary__button"
                onClick={() => setOpenLogin(true) || setOpenSignup(false)}
              >
                Log in
              </button>
              <button
                className="text__button"
                onClick={() => setOpenSignup(true) || setOpenLogin(false)}
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    
      <button className="profile button" onClick={() => setShowProfile(!showProfile)}>
    <img className="profile icon" src="/pictures/profile.png" alt="Profile" />
    <span className="profile-text">Profile</span>
</button>
        
{showProfile ? ( 
    <div className="user-profile">
        {/* Render the Profile component with user data */}
        <Profile user={user} username={user?.displayName || 'No User'} />
    </div>
) : (
    <div className="timeline">
        {user && <ImageUpload user={user} />}

        {posts.map(({ id, post }) => (
            <Post
                key={id}
                postId={id}
                user={user}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
                userId={post.userId}
            />
        ))}
    </div>
)}

    </div>
  );
}

export default App;
