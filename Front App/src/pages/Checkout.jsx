import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import CommonSection from "../components/UI/common-section/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import Cookies from 'js-cookie';
import { cartActions } from "../store/shopping-cart/cartSlice";
import { useNavigate } from "react-router-dom";

import "../styles/checkout.css";

const Checkout = () => {

  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const shippingCost = 10;


  const totalAmount = cartTotalAmount + Number(shippingCost);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const articles = []



  cartItems.forEach(item => {
    articles.push({Id_Article:item.id, Quantitee:item.quantity})
  });


  const handleClick = () => {
    fetch('http://localhost:3000/payment', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + Cookies.get('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        articles: articles,
      })
    })
      .then(response => {
        if (response.ok) {
          // Résoudre la promesse de réponse JSON
          return response.json();
        } else {
          throw new Error('Erreur lors de la requête');
        }
      })
      .then(data => {
        console.log(data); // Afficher les données JSON de la réponse
        // Autres actions à effectuer après avoir obtenu les données
        dispatch(cartActions.reset());
        navigate("/status");
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };



  return (
    <Helmet title="Checkout">
      <CommonSection title="Checkout" />
      <section>
        <Container>
          <Row>
            <Col lg="8" md="6">
                <button onClick={handleClick} type="submit" className="addTOCart__btn">
                  Payment
                </button>
            </Col>

            <Col lg="4" md="6">
              <div className="checkout__bill">
                <h6 className="d-flex align-items-center justify-content-between mb-3">
                  Subtotal: <span>${cartTotalAmount}</span>
                </h6>
                <h6 className="d-flex align-items-center justify-content-between mb-3">
                  Shipping: <span>${shippingCost}</span>
                </h6>
                <div className="checkout__total">
                  <h5 className="d-flex align-items-center justify-content-between">
                    Total: <span>${totalAmount}</span>
                  </h5>
                </div>
              </div>
              <form className="checkout__form" onSubmit={handleClick}>
                <button type="submit" className="addTOCart__btn">
                  Payment
                </button>
              </form>
              </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Checkout;
