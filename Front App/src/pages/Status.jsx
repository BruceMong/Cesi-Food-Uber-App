import React, { useState } from "react";
import CommonSection from "../components/UI/common-section/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import "../styles/cart-page.css";
import { useSelector } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

const Status = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [showDelivered, setShowDelivered] = useState(false);

  const handleShowDelivered = () => {
    setShowDelivered(!showDelivered);
  };

  const deliveredItems = cartItems.filter((item) => item.status === "livré");
  const inProgressItems = cartItems.filter((item) => item.status !== "livré");

  return (
    <Helmet title="Statut de votre panier">
      <CommonSection title="Statut de votre panier" />
      <section>
        <Container>
          <Row>
            <Col lg="12">
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
      )}
    </tr>
  );
};

export default Status;
