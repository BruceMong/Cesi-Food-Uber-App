import React, { useRef, useState,  useEffect } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import firebase from "firebase/compat/app";
import Cookies from 'js-cookie';
import "firebase/compat/auth";
import { userDataActions } from "../store/shopping-cart/userData"
import { useSelector, useDispatch } from "react-redux";



const firebaseConfig = {
  apiKey: "AIzaSyASyYNB1aOAUkpzlTjpKneKmmYDUQT84GU",
  authDomain: "test-5b8e2.firebaseapp.com",
  projectId: "test-5b8e2",
  storageBucket: "test-5b8e2.appspot.com",
  messagingSenderId: "574897607326",
  appId: "1:574897607326:web:f3eaa4f454e2614524218f"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Login = () => {
  const dispatch = useDispatch();

  const loginNameRef = useRef();
  const loginPasswordRef = useRef();
  const navigate = useNavigate();

  const [tokenUser, setTokenUser] = useState(Cookies.get("token"));


  const checkToken = () => {
    setTokenUser(Cookies.get("token"));

  }
  



  useEffect(() => {
    checkToken()
    console.log(Cookies.get("token"))
    console.log(tokenUser)

  }, []);


  const submitHandler = (e) => {
    e.preventDefault();

    const email = loginNameRef.current.value;
    const password = loginPasswordRef.current.value;


    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // User signed in successfully
        const user = userCredential.user;
        console.log("Signed in user:", user);
        // Get the ID token
        user.getIdToken().then((idToken) => {
          console.log("ID Token:", idToken);
          // You can now send the ID token to your server
          Cookies.set('token', idToken, { expires: 7 }); // The token will expire after 7 days

          // Fetch user profile data using the ID token
          fetch(`http://localhost:3000/users/${user.uid}`, {
            headers: {
              Authorization: `Bearer ${idToken}` 
            }
          })
            .then(response => {
              if (response.ok) {
                return response.json();
              } else {
                throw new Error('Error fetching user profile');
              }
            })
            .then(data => {
              // Handle the user profile data
              console.log("User profile:", data);
              // Extract the role from the user profile data
              Cookies.set('user', data.fullName, { expires: 7 }); // The token will expire after 7 days
              Cookies.set('role', data.role, { expires: 7 }); // The token will expire after 7 days
              dispatch(userDataActions.updateRole(data.role));
              const role = data.role;
              console.log("User role:", role);
              // Perform additional actions or redirect to another page
              navigate('/home');
            })
            .catch(error => {
              console.error('Error:', error);
            });
        });
      })
      .catch((error) => {
        // Handle sign-in errors
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Sign-in error:", errorCode, errorMessage);
      });
  }


  const logoutHandler = () => {
    Cookies.remove('token'); // Supprime le token
    Cookies.remove('user'); // Supprime le user
    Cookies.remove('role'); // Supprime le role
    dispatch(userDataActions.updateRole(null)); // Met à jour le rôle dans le state Redux
    checkToken()

    navigate('/login'); // Redirige vers la page de connexion
  }

  if(tokenUser) {
    return(
      <button onClick={logoutHandler} className="addTOCart__btn">
        Logout
      </button>
    )
  }
  return (
    <Helmet title="Login">
      <CommonSection title="Login" />
      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="12" className="m-auto text-center">
              <form className="form mb-5" onSubmit={submitHandler}>
                <div className="form__group">
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    ref={loginNameRef}
                  />
                </div>
                <div className="form__group">
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    ref={loginPasswordRef}
                  />
                </div>
                <button type="submit" className="addTOCart__btn">
                  Login
                </button>
              </form>
              <Link to="/register">
                Don't have an account? Create an account
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Login;
