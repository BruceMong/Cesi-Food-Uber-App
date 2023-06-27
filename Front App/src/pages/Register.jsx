import React, { useRef } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore"; // Import the Firestore module

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

const Register = () => {
  const signupNameRef = useRef();
  const signupPasswordRef = useRef();
  const signupEmailRef = useRef();
  const roleRef = useRef();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    const fullName = signupNameRef.current.value;
    const email = signupEmailRef.current.value;
    const password = signupPasswordRef.current.value;
    const selectedRole = roleRef.current.value;

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // User registered successfully
        const user = userCredential.user;
        console.log("Registered user:", user);

        // Store the full name in Firestore database
        const userId = user.uid;
        firebase.firestore().collection("users").doc(userId).set({
          fullName: fullName,
          role: selectedRole
        });
        // Perform additional actions or redirect to another page
        navigate('/login')
      })
        
      .catch((error) => {
        // Handle registration errors
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Registration error:", errorCode, errorMessage);
      });
  };

  return (
    <Helmet title="Signup">
      <CommonSection title="Signup" />
      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="12" className="m-auto text-center">
              <form className="form mb-5" onSubmit={submitHandler}>
                <div className="form__group">
                  <input
                    type="text"
                    placeholder="Full name"
                    required
                    ref={signupNameRef}
                  />
                </div>
                <div className="form__group">
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    ref={signupEmailRef}
                  />
                </div>
                <div className="form__group">
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    ref={signupPasswordRef}
                  />
                </div>
                <div className="form__group">
                  <select
                    type="role"
                    placeholder="role"
                    required
                    ref={roleRef}>
                    <option value="">choisir votre rôle</option>
                    <option value="Client">Client</option>
                    <option value="Livreur">Livreur</option>
                </select>
                </div>
                <button type="submit" className="addTOCart__btn">
                  Sign Up
                </button>
              </form>
              <Link to="/login">Already have an account? Login</Link>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Register;
