import React, { useState, useEffect } from "react";


import "../../../styles/product-card.css";

import { Link } from "react-router-dom";

import { useDispatch } from "react-redux";
import { cartActions } from "../../../store/shopping-cart/cartSlice";

import {getStorage, ref , getDownloadURL} from 'firebase/storage'

const ProductCard = ({ article}) => {
  const {id, Name, Photo, Prix } = article;
  const [url, SetUrl ] = useState()
  const dispatch = useDispatch();

  const storage = getStorage();
  const reference = ref(storage, "/images/" + Photo)

  useEffect(() => {
    const func = async ()=> {
      await getDownloadURL(reference).then((x) => {
        SetUrl(x)
      });
    }
  func()

  }, []);



  const addToCart = () => {
    dispatch(
      cartActions.addItem({
        id,
        Name,
        Prix,
        Photo,
      })
    );
  };

  return (
    <div className="product__item">
      <div className="product__img">
        <img src={url} alt="product-img" className="w-50" />
      </div>

      <div className="product__content">
        <h5>
          <Link to={`/foods/${id}`}>{Name}</Link>
        </h5>
        <div className=" d-flex align-items-center justify-content-between ">
          <span className="product__price">${Prix}</span>
          <button className="addTOCart__btn" onClick={addToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
