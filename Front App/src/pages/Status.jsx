import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import firebase from "../firebase/config";
import axios from 'axios';
import Cookies from 'js-cookie';

import "firebase/firestore";

const Status = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [showDelivered, setShowDelivered] = useState(false);
  const [commandes, setCommandes] = useState([]);
  const [deliveries, setDeliveries] = useState([]);


  const token = Cookies.get("token");

  const handleShowDelivered = () => {
    setShowDelivered(!showDelivered);
  };


const refresh = () => {
  axios.get('http://localhost:3000/commandesClient/', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(response => {
    console.log("commandes COMMANDE :", response.data);
    // Ajouter la réponse à commandes
    setCommandes(prevCommandes => [...prevCommandes, ...response.data]);
    
  })
  .catch(error => {
    console.error('Error fetching commandes', error);
  });
}


  useEffect(() => {
    refresh();

  }, []);

  return (
    <div>
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <div className="text-right mb-3">
                <button
                  className="btn btn-secondary"
                  onClick={handleShowDelivered}
                >
                  {showDelivered
                    ? "Afficher les livraisons en cours"
                    : "Afficher l'historique des commandes"}
                </button>
              </div>
              {showDelivered ? (
                <>
                  <h4 className="mb-3">Historique des commandes</h4>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Livreur</th>
                        <th>Commandes</th>
                        <th>Prix Total</th>
                        <th>Date de livraison</th>
                      </tr>
                    </thead>
                    <tbody>
                    {commandes.filter(commande => commande.Statut === "Livrée").map((commande, index) => (
                          <Tr commande={commande} key={index} />
                    ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <>
                  <h4 className="mb-3">Livraisons en cours</h4>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Livreur</th>
                        <th>Commandes</th>
                        <th>Prix Total</th>
                        <th>Date de commande</th>
                      </tr>
                    </thead>
                    <tbody>
                    {commandes.filter(commande => commande.Statut !== "Livrée").map((commande, index) => (
                          <Tr commande={commande} key={index} />
                    ))}
                    </tbody>
                  </table>
                </>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

const Tr = ({commande, key}) => {
  const userName = Cookies.get("user");
console.log(userName)

  const { id, Date_Livraison, Id_Client, Id_Livreur, Statut, fullName, commandQuantities } = commande;


  let totalPrice = commandQuantities.reduce((total, article) => {
    return total + parseInt(article.article.Prix);
}, 0);


  return (
    <>
        <tr>
          <td className="text-center">
            {userName}
          </td>
          <td className="text-center">
            {fullName }
          </td>
          <td className="text-center">
            {commandQuantities.map((data, index) => (
              <span key={index}>
                {data.article.Name} 
                {" x" + data.Quantitee}
                {index !== commandQuantities.length - 1 && ", "}
              </span>
            ))}
          </td>
          <td className="text-center">{totalPrice}</td>
          <td className="text-center">
            { (new Date(Date_Livraison._seconds * 1000).toLocaleDateString())}
          </td>
        </tr>
    </>
  );
};

export default Status;