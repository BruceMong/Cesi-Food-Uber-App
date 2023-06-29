import React, { useRef, useEffect, useState } from "react";

import { Container } from "reactstrap";
import logo from "../../assets/images/res-logo.png";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { cartUiActions } from "../../store/shopping-cart/cartUiSlice";
import Cookies from 'js-cookie';

import "../../styles/header.css";

const nav__links = [
  {
    display: "Home",
    path: "/home",
  },
  {
    display: "Menu",
    path: "/foods",
  },
  {
    display: "Panier",
    path: "/cart",
  },
  {
  display: "Historique",
  path: "/status",
},
{
  display: "Profil",
  path: "/users",
},
{
  display: "Admin",
  path: "/panel",
},
{
  display: "Livreur",
  path: "/livreur",
}
];

const Header = () => {
  const menuRef = useRef(null);
  const headerRef = useRef(null);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const role = useSelector((state) => state.userData.role);
  const dispatch = useDispatch();
console.log(role)
  const toggleMenu = () => menuRef.current.classList.toggle("show__menu");

  const toggleCart = () => {
    dispatch(cartUiActions.toggle());
  };
  const [filteredNavLinks, setFilteredNavLinks] = useState(nav__links);

  


  useEffect(() => {
    console.log("changeeeeeeeee")
     setFilteredNavLinks(  nav__links.filter((navLink) => {
      if (role === "admin") {
        return true; // Afficher toutes les routes pour le rôle "admin"
      } else if (role === "Livreur") {
        return (
          navLink.display !== "Panier" &&
          navLink.display !== "Historique" &&
          navLink.display !== "Admin"
        ); // Exclure les routes "Panier", "Historique" et "Admin" pour le rôle "livreur"
      } else if (role === "Client") {
        return (
          navLink.display !== "Admin" &&
          navLink.display !== "Livreur"
        ); // Exclure les routes "Admin" et "Livreur" pour le rôle "client"
      }
      else 
      {
        return (
          navLink.display !== "Admin" &&
          navLink.display !== "Livreur"        && 
          navLink.display !== "Panier" &&
          navLink.display !== "Historique"  &&
          navLink.display !== "Profil"

        ); 
      }
    }))
  }, [role]);




  return (
    <header className="header" ref={headerRef}>
      <Container>
        <div className="nav__wrapper d-flex align-items-center justify-content-between">
          <div className="logo">
            <img src={logo} alt="logo" />
            <h5>Cesi Food</h5>
          </div>

          {/* ======= menu ======= */}
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <div className="menu d-flex align-items-center gap-5">
              {filteredNavLinks.map((item, index) => (
                <NavLink
                  to={item.path}
                  key={index}
                  className={(navClass) =>
                    navClass.isActive ? "active__menu" : ""
                  }
                >
                  {item.display}
                </NavLink>
              ))}
            </div>
          </div>

          {/* ======== nav right icons ========= */}
          <div className="nav__right d-flex align-items-center gap-4">
            <span className="cart__icon" onClick={toggleCart}>
              <i class="ri-shopping-basket-line"></i>
              <span className="cart__badge">{totalQuantity}</span>
            </span>

            <span className="user">
              <Link to="/login">
                <i class="ri-user-line"></i>
              </Link>
            </span>

            <span className="mobile__menu" onClick={toggleMenu}>
              <i class="ri-menu-line"></i>
            </span>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
