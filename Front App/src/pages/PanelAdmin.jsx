import React, { useState } from "react";

import CommonSection from "../components/UI/common-section/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";
import "../styles/panel.css";

const Panel = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurantsData, setRestaurantsData] = useState([
    { nom: "Restaurant 1", adresse: "Adresse 1" },
    { nom: "Restaurant 2", adresse: "Adresse 2" },
    { nom: "Restaurant 3", adresse: "Adresse 3" },
  ]);
  const [usersData, setUsersData] = useState([
    { nom: "Utilisateur 1", email: "email1@example.com", role: "Role 1" },
    { nom: "Utilisateur 2", email: "email2@example.com", role: "Role 2" },
    { nom: "Utilisateur 3", email: "email3@example.com", role: "Role 3" },
  ]);
  const [productsData, setProductsData] = useState([
    { titre: "Produit 1", description: "Description 1", prix: 10, type: "Type 1" },
    { titre: "Produit 2", description: "Description 2", prix: 20, type: "Type 2" },
    { titre: "Produit 3", description: "Description 3", prix: 30, type: "Type 3" },
  ]);

  const toggleTab = (tab) => {
    if (activeTab === tab) {
      setActiveTab(null);
    } else {
      setActiveTab(tab);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Effectuer la recherche en utilisant la valeur de searchQuery
    console.log("Recherche soumise :", searchQuery);
  };

  const handleRestaurantChange = (index, key, value) => {
    const newData = [...restaurantsData];
    newData[index][key] = value;
    setRestaurantsData(newData);
  };

  const handleUserChange = (index, key, value) => {
    const newData = [...usersData];
    newData[index][key] = value;
    setUsersData(newData);
  };

  const handleProductChange = (index, key, value) => {
    const newData = [...productsData];
    newData[index][key] = value;
    setProductsData(newData);
  };

  const handleRemoveRestaurant = (index) => {
    setRestaurantsData((prevData) => {
      const newData = [...prevData];
      newData.splice(index, 1);
      return newData;
    });
  };

  const handleRemoveUser = (index) => {
    setUsersData((prevData) => {
      const newData = [...prevData];
      newData.splice(index, 1);
      return newData;
    });
  };

  const handleRemoveProduct = (index) => {
    setProductsData((prevData) => {
      const newData = [...prevData];
      newData.splice(index, 1);
      return newData;
    });
  };

  const handleAddRestaurant = () => {
    setRestaurantsData((prevData) => [
      ...prevData,
      { nom: "", adresse: "" },
    ]);
  };

  const handleAddUser = () => {
    setUsersData((prevData) => [
      ...prevData,
      { nom: "", email: "", role: "" },
    ]);
  };

  const handleAddProduct = () => {
    setProductsData((prevData) => [
      ...prevData,
      { titre: "", description: "", prix: 0, type: "" },
    ]);
  };

  return (
    <Helmet title="Panel">
      <CommonSection title="Panel" />
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <div className="button-row">
                <button onClick={() => toggleTab("restaurants")}>
                  Restaurants
                </button>
                <button onClick={() => toggleTab("users")}>Utilisateurs</button>
                <button onClick={() => toggleTab("products")}>Produits</button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg="12">
              <form className="search-form" onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Rechercher par ID, nom ou adresse"
                />
                <button type="submit">Rechercher</button>
              </form>
            </Col>
          </Row>
          <Row>
            <Col lg="12">
              {activeTab === "restaurants" && (
                <div>
                  {/* Contenu du tableau des restaurants */}
                  <table className="table table-bordered table-borderless">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Adresse</th>
                        <th>Action</th> {/* Ajout de la colonne pour les boutons */}
                      </tr>
                    </thead>
                    <tbody>
                      {restaurantsData.map((restaurant, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              value={restaurant.nom}
                              onChange={(e) =>
                                handleRestaurantChange(index, "nom", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={restaurant.adresse}
                              onChange={(e) =>
                                handleRestaurantChange(index, "adresse", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <button className="maj" type="button" onClick={() => handleRestaurantChange(index, "nom", "Nouveau nom")}>
                              Mettre à jour
                            </button>
                            <button className="sup" onClick={() => handleRemoveRestaurant(index)}>
                              Supprimer
                            </button>
                          </td> {/* Déplacement des boutons à l'intérieur de chaque ligne */}
                        </tr>
                      ))}
                      <tr>
                        <td>
                          <button className="add" onClick={handleAddRestaurant}>Ajouter</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "users" && (
                <div>
                  {/* Contenu du tableau des utilisateurs */}
                  <table className="table table-bordered table-borderless">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th> {/* Ajout de la colonne pour les boutons */}
                      </tr>
                    </thead>
                    <tbody>
                      {usersData.map((user, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              value={user.nom}
                              onChange={(e) =>
                                handleUserChange(index, "nom", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="email"
                              value={user.email}
                              onChange={(e) =>
                                handleUserChange(index, "email", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={user.role}
                              onChange={(e) =>
                                handleUserChange(index, "role", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <button className="maj" type="button" onClick={() => handleUserChange(index, "nom", "Nouveau nom")}>
                              Mettre à jour
                            </button>
                            <button className="sup" onClick={() => handleRemoveUser(index)}>
                              Supprimer
                            </button>
                          </td> {/* Déplacement des boutons à l'intérieur de chaque ligne */}
                        </tr>
                      ))}
                      <tr>
                        <td>
                          <button className="add" onClick={handleAddUser}>Ajouter</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "products" && (
                <div>
                  {/* Contenu du tableau des produits */}
                  <table className="table table-bordered table-borderless">
                    <thead>
                      <tr>
                        <th>Titre</th>
                        <th>Description</th>
                        <th>Prix</th>
                        <th>Type</th>
                        <th>Action</th> {/* Ajout de la colonne pour les boutons */}
                      </tr>
                    </thead>
                    <tbody>
                      {productsData.map((product, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              value={product.titre}
                              onChange={(e) =>
                                handleProductChange(index, "titre", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={product.description}
                              onChange={(e) =>
                                handleProductChange(index, "description", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={product.prix}
                              onChange={(e) =>
                                handleProductChange(index, "prix", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={product.type}
                              onChange={(e) =>
                                handleProductChange(index, "type", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <button className="maj" type="button" onClick={() => handleProductChange(index, "titre", "Nouveau titre")}>
                              Mettre à jour
                            </button>
                            <button className="sup" onClick={() => handleRemoveProduct(index)}>
                              Supprimer
                            </button>
                          </td> {/* Déplacement des boutons à l'intérieur de chaque ligne */}
                        </tr>
                      ))}
                      <tr>
                        <td>
                          <button className="add" onClick={handleAddProduct}>Ajouter</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Panel;
