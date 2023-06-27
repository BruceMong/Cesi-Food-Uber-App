import React, { useState } from "react";
import ReactDOM from "react-dom";
import CommonSection from "../components/UI/common-section/CommonSection";
import Helmet from "../components/Helmet/Helmet";
//import "../styles/cart-page.css";
import { useSelector } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

const Livreur = () => {
  const [livraisonRecuperee, setLivraisonRecuperee] = useState(false);
  const [livraisonLivree, setLivraisonLivree] = useState(false);
  const [accepterCommande, setAccepterCommande] = useState(false);

  const handleAccepterCommande = () => {
    setAccepterCommande(true);
  };

  const handleLivraisonRecupereeChange = () => {
    setLivraisonRecuperee(!livraisonRecuperee);
  };

  const handleLivraisonLivreeChange = () => {
    setLivraisonLivree(!livraisonLivree);
  };

  return (
    <Helmet title="Livraison">
      <CommonSection title="Livraison" />
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <h4 className="mb-3">Livraisons </h4>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Nom du produit</th>
                    <th>Quantité</th>
                    <th>Date de livraison</th>
                    <th>Adresse </th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Exemple de ligne de livraison */}
                  <tr>
                    <td>Image du produit</td>
                    <td>Nom du produit</td>
                    <td>Quantité</td>
                    <td>Date de livraison</td>
                    <td>Adresse</td>
                    <td>
                      {accepterCommande ? (
                        <>
                          <input
                            type="checkbox"
                            checked={livraisonRecuperee}
                            onChange={handleLivraisonRecupereeChange}
                            disabled={livraisonRecuperee}
                          />{" "}
                          Livraison récupérée
                          <br />
                          <input
                            type="checkbox"
                            checked={livraisonLivree}
                            onChange={handleLivraisonLivreeChange}
                            disabled={livraisonLivree}
                          />{" "}
                          Livré
                        </>
                      ) : (
                        <button onClick={handleAccepterCommande}>
                          Accepter la commande
                        </button>
                      )}
                    </td>
                  </tr>
                  {/* Fin de l'exemple de ligne de livraison */}
                </tbody>
              </table>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Livreur;
