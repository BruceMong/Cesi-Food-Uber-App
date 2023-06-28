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
  console.log(Cookies.get('token'))
  console.log(cartItems)

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
        'Authorization' : 'Bearer ' + Cookies.get('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        articles: articles,
      })
    })
    .then(response => {
      console.log(response.json())
      if (response.status === 200 || response.status === 201) {
      dispatch(cartActions.reset());
      navigate("/status");
    }
  })
    .then(data => console.log(data))
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <Helmet title="Checkout">
      <CommonSection title="Checkout" />
      <section>
        <Container>
          <Row>
            <h6 className="mb-4">Shipping Address</h6>
            <div className="checkout__bill">
                <h6 className="d-flex align-items-center justify-content-between mb-3">
                  Subtotal: ${cartTotalAmount}
                </h6>
                <h6 className="d-flex align-items-center justify-content-between mb-3">
                  Shipping: ${shippingCost}
                </h6>
                <div className="checkout__total">
                  <h5 className="d-flex align-items-center justify-content-between">
                    Total: ${totalAmount}
                  </h5>
                </div>
              </div>
              <form className="checkout__form" onSubmit={handleClick}>
                <button type="submit" className="addTOCart__btn">
                  Payment
                </button>
              </form>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Checkout;
