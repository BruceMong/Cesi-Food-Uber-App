import React, { useState } from "react";
import CommonSection from "../components/UI/common-section/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import "../styles/cart-page.css";
import { useSelector } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
<<<<<<< Updated upstream
=======
import firebase from "../firebase/config";
import "firebase/firestore";
>>>>>>> Stashed changes

const Status = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [showDelivered, setShowDelivered] = useState(false);

  const handleShowDelivered = () => {
    setShowDelivered(!showDelivered);
  };

<<<<<<< Updated upstream
  const deliveredItems = cartItems.filter((item) => item.status === "livré");
  const inProgressItems = cartItems.filter((item) => item.status !== "livré");
=======
  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = firebase.firestore();
        const snapshot = await db
          .collection("Commandes")
          .where("Statut", "==", "Livrée")
          .get();
        const data = snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        if (data) {
          setDeliveries(data);
        }
      } catch (error) {
        console.log("Error fetching data from Firebase:", error);
      }
    };

    fetchData();
  }, []);
>>>>>>> Stashed changes

  return (
    <Helmet title="Statut de votre panier">
      <CommonSection title="Statut de votre panier" />
      <section>
        <Container>
          <Row>
            <Col lg="12">
<<<<<<< Updated upstream
              {cartItems.length === 0 ? (
                <h5 className="text-center">Pas de livraison en cours</h5>
              ) : (
                <>
                  <div className="text-right mb-3">
                    <button
                      className="btn btn-secondary"
                      onClick={handleShowDelivered}
                    >
                      {showDelivered ? "Afficher les livraisons en cours" : "Afficher les livraisons livrées"}
                    </button>
                  </div>
                  {showDelivered ? (
                    <>
                      <h4 className="mb-3">Livraisons livrées</h4>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Nom du produit</th>
                            <th>Quantité</th>
                            <th>Date de livraison</th>
                          </tr>
                        </thead>
                        <tbody>
                          {deliveredItems.map((item) => (
                            item.status && <Tr item={item} key={item.id} />
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
                            <th>Image</th>
                            <th>Nom du produit</th>
                            <th>Quantité</th>
                            <th>Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inProgressItems.map((item) => (
                            item.status && <Tr item={item} key={item.id} />
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
=======
              <div className="text-right mb-3">
                <button
                  className="btn btn-secondary"
                  onClick={handleShowDelivered}
                >
                  {showDelivered
                    ? "Afficher l'historique des commandes"
                    : "Afficher les livraisons en cours"}
                </button>
              </div>
              {showDelivered ? (
                <>
                  <h4 className="mb-3">Livraisons livrées</h4>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Nom du produit</th>
                        <th>Quantité</th>
                        <th>Date de livraison</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveries.map((delivery, index) => (
                        <Tr delivery={delivery} key={index} />
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
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
                      {deliveries.map((delivery, index) => (
                        <Tr delivery={delivery} key={index} />
                      ))}
                    </tbody>
                  </table>
>>>>>>> Stashed changes
                </>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

const Tr = (props) => {
<<<<<<< Updated upstream
  const { id, image01, title, price, quantity } = props.item;

  return (
    <tr>
      <td className="text-center cart__img-box">
        <img src={image01} alt="" />
      </td>
      <td className="text-center">{title}</td>
      <td className="text-center">{quantity}</td>
      {props.item.status === "livré" ? (
        <td className="text-center">{props.item.deliveryDate}</td>
      ) : (
        <td className="text-center cart__statut">en cours</td>
=======
  const { id, Date_Livraison, Id_Client, Id_Livreur, Statut } = props.delivery;
  const [clientData, setClientData] = useState(null);
  const [foodDataArray, setFoodDataArray] = useState([]);
  const [livreurData, setLivreurData] = useState(null);
  const [theClientData, setTheClientData] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const db = firebase.firestore();
        const snapshot2 = await db
          .collection("CommandesQuantitees")
          .where("Id_Commande", "==", id)
          .get();
        const data2 = snapshot2.docs.map((doc) => doc.data());

        if (data2.length > 0) {
          setClientData(data2);
        }
      } catch (error) {
        console.log("Error fetching CommandesQuantitées data from Firebase:", error);
      }
    };

    fetchClientData();
  }, []);

  useEffect(() => {
    const fetchClientData2 = async () => {
      try {
        if (clientData !== null && clientData.length > 0) {
          const db = firebase.firestore();
          const dataPromises = clientData.map(async (dataItem) => {
            const articleId = dataItem.Id_Article;
            const snapshot3 = await db
              .collection("Articles")
              .doc(articleId)
              .get();
            const data3 = snapshot3.data();
            return data3;
          });

          const articleDataArray = await Promise.all(dataPromises);
          setFoodDataArray(articleDataArray);
        }
      } catch (error) {
        console.log("Error fetching ARITCLES data from Firebase:", error);
      }
    };

    fetchClientData2();
  }, [clientData]);

  useEffect(() => {
    const fetchLivreurData3 = async () => {
      try {
        const db = firebase.firestore();
        const articleId = Id_Livreur;
        const snapshot4 = await db.collection("users").doc(articleId).get();
        const data4 = snapshot4.data();
        setLivreurData(data4);
      } catch (error) {
        console.log("Error fetching livreur data from Firebase:", error);
      }
    };

    fetchLivreurData3();
  }, [Id_Livreur]);

  useEffect(() => {
    const fetchClientData4 = async () => {
      try {
        const db = firebase.firestore();
        const articleId = Id_Client;
        const snapshot5 = await db.collection("users").doc(articleId).get();
        const data5 = snapshot5.data();
        setTheClientData(data5);
      } catch (error) {
        console.log("Error fetching client data from Firebase:", error);
      }
    };

    fetchClientData4();
  }, [Id_Client]);

  useEffect(() => {
    const calculateTotalPrice = () => {
      let totalPrice = 0;
      if (
        clientData &&
        clientData.length > 0 &&
        foodDataArray.length > 0
      ) {
        clientData.forEach((data, index) => {
          const foodData = foodDataArray[index];
          if (foodData) {
            const quantity = data.Quantitee;
            const price = foodData.Prix;
            totalPrice += quantity * price;
          }
        });
      }
      setTotalPrice(totalPrice);
    };

    calculateTotalPrice();
  }, [clientData, foodDataArray]);

  return (
    <>
      {clientData && clientData.length > 0 && (
        <tr>
          <td className="text-center">
            {theClientData ? theClientData.fullName : ""}
          </td>
          <td className="text-center">
            {livreurData ? livreurData.fullName : ""}
          </td>
          <td className="text-center">
            {clientData.map((data, index) => (
              <span key={index}>
                {foodDataArray[index] ? foodDataArray[index].Name : ""} (
                {data.Quantitee})
                {index !== clientData.length - 1 && ", "}
              </span>
            ))}
          </td>
          <td className="text-center">{totalPrice}</td>
          <td className="text-center">
            {Date_Livraison ? Date_Livraison.toDate().toLocaleString() : ""}
          </td>
        </tr>
>>>>>>> Stashed changes
      )}
    </tr>
  );
};

export default Status;
