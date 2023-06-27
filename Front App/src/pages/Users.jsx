import React, { useState } from "react";
import "../styles/users.css";

const Users = () => {
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleNameSubmit = (e) => {
    e.preventDefault();
    // Logique de mise à jour du nom
    console.log("Mise à jour du nom :", name);
    // Réinitialiser le champ du nom
    setName("");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Vérification de l'ancien mot de passe
    if (oldPassword !== "ancienMotDePasse") {
      console.log("Ancien mot de passe incorrect");
      return;
    }

    // Vérification de la correspondance entre le nouveau mot de passe et la confirmation du mot de passe
    if (newPassword !== confirmPassword) {
      console.log("Le nouveau mot de passe ne correspond pas à la confirmation du mot de passe");
      return;
    }

    // Logique de mise à jour du mot de passe
    console.log("Mise à jour du mot de passe :", newPassword);
    // Réinitialiser les champs du mot de passe
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Logique de mise à jour de l'e-mail
    console.log("Mise à jour de l'e-mail :", email);
    // Réinitialiser le champ de l'e-mail
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
        <button type="submit">Mettre à jour l'e-mail</button>
      </form>
    </div>
  );
};

export default Users;
