import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "../styles/users.css";

const Users = () => {
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
          setUser(currentUser);
          const snapshot = await firebase.firestore().collection("users").doc(currentUser.uid).get();
          if (snapshot.exists) {
            const userData = snapshot.data();
            console.log("Données de l'utilisateur :", userData);
            setName(userData.fullName);
          } else {
            console.log("Aucun document trouvé pour cet utilisateur");
          }
        } else {
          console.log("Aucun utilisateur connecté");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
      }
    };

    const fetchCurrentPassword = async () => {
      try {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
          const methods = await firebase.auth().fetchSignInMethodsForEmail(currentUser.email);
          if (methods.includes("password")) {
            setCurrentPassword("********");
          } else {
            setCurrentPassword("N/A");
          }
        } else {
          console.log("Aucun utilisateur connecté");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du mot de passe actuel :", error);
      }
    };

    fetchUserData();
    fetchCurrentPassword();
  }, []);

  const handleNameSubmit = async (e) => {
    e.preventDefault();

    try {
      await firebase.firestore().collection("users").doc(user.uid).update({
        fullName: name,
      });
      console.log("Le nom a été mis à jour dans la base de données.");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du nom dans la base de données :", error);
    }

    setName("");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        const credentials = firebase.auth.EmailAuthProvider.credential(currentUser.email, oldPassword);
        await currentUser.reauthenticateWithCredential(credentials);

        if (newPassword !== confirmPassword) {
          console.log("Le nouveau mot de passe ne correspond pas à la confirmation du mot de passe");
          return;
        }

        await currentUser.updatePassword(newPassword);
        console.log("Le mot de passe a été mis à jour avec succès.");
      } else {
        console.log("Aucun utilisateur connecté");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe :", error);
    }

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        const credentials = firebase.auth.EmailAuthProvider.credential(currentUser.email, currentPassword);
        await currentUser.reauthenticateWithCredential(credentials);

        await currentUser.updateEmail(email);
        console.log("L'e-mail a été mis à jour avec succès.");
      } else {
        console.log("Aucun utilisateur connecté");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'e-mail :", error);
    }

    setCurrentPassword("");
    setEmail("");
  };

  return (
    <div>
      <form onSubmit={handleNameSubmit}>
        <label htmlFor="name">Nom :</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Mettre à jour le nom</button>
      </form>

      <form onSubmit={handlePasswordSubmit}>
        <label htmlFor="oldPassword">Ancien mot de passe :</label>
        <input
          type="password"
          id="oldPassword"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <label htmlFor="newPassword">Nouveau mot de passe :</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe :</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Mettre à jour le mot de passe</button>
      </form>

      <form onSubmit={handleEmailSubmit}>
        <label htmlFor="email">E-mail :</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="currentPassword">Mot de passe actuel :</label>
        <input
          type="password"
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <button type="submit">Mettre à jour l'e-mail</button>
      </form>
    </div>
  );
};

export default Users;
