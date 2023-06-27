import React, { useState } from "react";
import "../styles/users.css";


const Users = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Effectuer la logique de mise à jour du profil avec les données name, password et email
    // ...
    // Réinitialiser les champs du formulaire
    setName("");
    setPassword("");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Nom :</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Mot de passe :</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="email">E-mail :</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button type="submit">Mettre à jour</button>
    </form>
  );
};

export default Users;