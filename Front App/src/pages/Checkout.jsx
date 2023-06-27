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
  cartItems.forEach(item => {
    
  });


  const handleClick = () => {
    fetch('http://localhost:3000/payment', {
      method: 'POST',
      headers: {
        'Authorization' : 'Bearer ' + Cookies.get('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key1: 'value1',
        key2: 'value2'
      })
    })
    .then(response => {
      console.log(response.json())
      dispatch(cartActions.reset());
      navigate("/status");
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
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Checkout;
