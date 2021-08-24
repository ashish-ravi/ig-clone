import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import './App.css';
import Post from './Post';
import { db, auth } from "./firebase"
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts,setPost] = useState([]);
  const [open,setOpen] = useState(false);
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [username,setUsername] = useState("");
  const [user,setUser] = useState(null);
  const [openSignIn, setopenSignIn] = useState(false);

  useEffect(() => {
    const unsubscribe =  auth.onAuthStateChanged((authUser) => {
      if(authUser){
        console.log(authUser);
        setUser(authUser);

        
      }else{
        setUser(null);
      }
    })

    return () => {
      //performing some cleanup actions
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPost(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const signUp = (event) =>{
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false)
  }
  
  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email,password)
    .catch((error) => alert(error.message))

    setopenSignIn(false);
  }

  return (
    <div className="app">
     
      

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form>
            <div className="app__signup">
              <img 
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
                style={{width:"30%", paddingBottom: 15}}
              />
              <Input style={{padding: 10, marginBottom: 20}} placeholder="Enter Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
              <Input style={{padding: 10, marginBottom: 20}} placeholder="Enter Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input style={{padding: 10, marginBottom: 20}} placeholder="Enter Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              
              
              <Button style={{padding: 10, margin: 20, marginLeft: 80, marginRight: 80}} variant="outlined" type="submit" onClick={signUp}>Sign Up</Button>
            </div>
          </form>
          
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setopenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form>
            <div className="app__signup">
              <img 
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
                style={{width:"30%", paddingBottom: 15}}
              />
              
              <Input style={{padding: 10, marginBottom: 20}} placeholder="Enter Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input style={{padding: 10, marginBottom: 20}} placeholder="Enter Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              
              
              <Button style={{padding: 10, margin: 20, marginLeft: 80, marginRight: 80}} variant="outlined" type="submit" onClick={signIn}>Sign In</Button>
            </div>
          </form>
          
        </div>
      </Modal>

      <div className="app__header">
          <img 
            className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
          />

          {
              user? (
                <Button  onClick={() => auth.signOut()}>Logout</Button>
              ) : (
                <div className="app__loginContainer">
                  <Button onClick={() => setopenSignIn(true)}>Sign In</Button>
                  <Button onClick={() => setOpen(true)}>Sign up</Button>
                </div>
                
              )
          }
      </div>

      
      <div className="app__posts">
        <div className="app__postLeft">
          {
            posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
        
        
      </div>
      
      

      

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3 style={{display:"flex", justifyContent:"center", padding:30, fontSize:36}}>Login to upload</h3>
      )}
      
    </div>
  );
}

export default App;
