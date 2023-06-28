import React, { useEffect, useState } from "react";

import CommonSection from "../components/UI/common-section/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";
import Cookies from 'js-cookie';
import axios from 'axios';


import "../styles/panel.css";

const Panel = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurantsData, setRestaurantsData] = useState([
  ]);
  const [usersData, setUsersData] = useState([
  ]);
  const [productsData, setProductsData] = useState([
  ]);
  const token = Cookies.get("token");

  const refresh = () => 
  {
  // Fetch restaurants data
  axios.get('http://localhost:3000/restaurants', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(response => {
    console.log("resto profile:", response.data);
    setRestaurantsData(response.data);
  })
  .catch(error => {
    console.error('Error fetching restaurants', error);
  });

  // Fetch users data
  axios.get('http://localhost:3000/users', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(response => {
    console.log("users profile:", response.data);
    setUsersData(response.data);
  })
  .catch(error => {
    console.error('Error fetching users', error);
  });

  // Fetch articles data
  axios.get('http://localhost:3000/articles', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(response => {
    console.log("articles:", response.data);
    setProductsData(response.data);
  })
  .catch(error => {
    console.error('Error fetching articles', error);
  });
}


  useEffect(() => {
  
    refresh()
  }, []);



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

  const handleRemoveUser = (user) => {

    axios.delete(`http://localhost:3000/users/${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }})
    .then(response => {
      // Suppression réussie, effectuez les actions nécessaires (par exemple, mise à jour de l'état)
      console.log('Utilisateur supprimé avec succès');
    })
    .catch(error => {
      // Gestion des erreurs lors de la suppression de l'utilisateur
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
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
      { Nom: "", Adresse: "" },
    ]);
  };

  const handleAddUser = () => {
    setUsersData((prevData) => [
      ...prevData,
      { fullName: "", email: "", role: "" },
    ]);
  };

  const handleAddProduct = () => {
    setProductsData((prevData) => [
      ...prevData,
      { Name: "", Description: "", Prix: 0, Type: "" },
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
                  Type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Rechercher par ID, Nom ou Adresse"
                />
                <button Type="submit">Rechercher</button>
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
                              Type="text"
                              value={restaurant.Nom}
                              onChange={(e) =>
                                handleRestaurantChange(index, "Nom", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              Type="text"
                              value={restaurant.Adresse}
                              onChange={(e) =>
                                handleRestaurantChange(index, "Adresse", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <button className="maj" Type="button" onClick={() => handleRestaurantChange(index, "Nom", "Nouveau Nom")}>
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
                        <th>fullName</th>
                        <th>Role</th>
                        <th>Action</th> {/* Ajout de la colonne pour les boutons */}
                      </tr>
                    </thead>
                    <tbody>
                      {usersData.map((user, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              Type="text"
                              value={user.fullName}
                              onChange={(e) =>
                                handleUserChange(index, "fullName", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              Type="text"
                              value={user.role}
                              onChange={(e) =>
                                handleUserChange(index, "role", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <button className="maj" Type="button" onClick={() => handleUserChange(index, "fullName", "new fullName")}>
                              Mettre à jour
                            </button>
                            <button className="sup" onClick={() => handleRemoveUser(user)}>
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
                        <th>Name</th>
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
                              Type="text"
                              value={product.Name}
                              onChange={(e) =>
                                handleProductChange(index, "Name", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              Type="text"
                              value={product.Description}
                              onChange={(e) =>
                                handleProductChange(index, "Description", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              Type="number"
                              value={product.Prix}
                              onChange={(e) =>
                                handleProductChange(index, "Prix", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              Type="text"
                              value={product.Type}
                              onChange={(e) =>
                                handleProductChange(index, "Type", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <button className="maj" Type="button" onClick={() => handleProductChange(index, "Name", "Nouveau Name")}>
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
