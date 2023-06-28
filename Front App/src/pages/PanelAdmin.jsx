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
  const [newRestaurant, setNewRestaurant] = useState([
  ]);
  const [newProduct, setNewProduct] = useState([
  ]);
  const [newUser, setNewUser] = useState([
  ]);

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



  const handleRestaurantInputChange = (index, key, value) => {
    let newData = [...restaurantsData];
    newData[index][key] = value;
    setRestaurantsData(newData);
  };

  const handleUserInputChange = (index, key, value) => {
    let newData = [...usersData];
    newData[index][key] = value;
    setUsersData(newData);
  };

  
  const handleArticleInputChange = (index, key, value) => {
    let newData = [...productsData];
    newData[index][key] = value;
    setProductsData(newData);
  };
  


  const handleRestaurantChange = (restaurant) => {  
    axios.put(`http://localhost:3000/restaurants/${restaurant.id}`, restaurant, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('Restaurant updated successfully');
      refresh()

    })
    .catch(error => {
      console.error('Error updating restaurant:', error);
    });
  };
  
  const handleUserChange = (user) => {

  
    axios.put(`http://localhost:3000/users/${user.id}`, user, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('User updated successfully');
      refresh()

    })
    .catch(error => {
      console.error('Error updating user:', error);
    });
  };
  
  const handleProductChange = (article) => {
  
    axios.put(`http://localhost:3000/articles/${article.id}`, article, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('Product updated successfully');
      refresh()

    })
    .catch(error => {
      console.error('Error updating product:', error);
    });
  };

  const handleRemoveRestaurant = (restaurant) => {
    axios.delete(`http://localhost:3000/restaurants/${restaurant.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }})
    .then(response => {
      // Suppression réussie, effectuez les actions nécessaires (par exemple, mise à jour de l'état)
      console.log('Utilisateur supprimé avec succès')
      refresh()
      ;
    })
    .catch(error => {
      // Gestion des erreurs lors de la suppression de l'utilisateur
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
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
      refresh()

    })
    .catch(error => {
      // Gestion des erreurs lors de la suppression de l'utilisateur
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    });
  };

  const handleRemoveProduct = (article) => {
    axios.delete(`http://localhost:3000/articles/${article.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }})
    .then(response => {
      // Suppression réussie, effectuez les actions nécessaires (par exemple, mise à jour de l'état)
      console.log('Utilisateur supprimé avec succès');
      refresh()

    })
    .catch(error => {
      // Gestion des erreurs lors de la suppression de l'utilisateur
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    });
  };

  const handleAddRestaurant = () => {
    
    axios.post('http://localhost:3000/restaurants', newRestaurant, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      refresh()

      console.log('restaurant added successfully');
    })
    .catch(error => {
      console.error('Error adding restaurant:', error);
    });
  };

  const handleAddUser = () => {
// ne pas faire
  };

  const handleAddProduct = () => {
    axios.post('http://localhost:3000/articles', newProduct, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('Product added successfully');
      refresh()
    })
    .catch(error => {
      console.error('Error adding product:', error);
    });
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
                                handleRestaurantInputChange(index, "Nom", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              Type="text"
                              value={restaurant.Adresse}
                              onChange={(e) =>
                                handleRestaurantInputChange(index, "Adresse", e.target.value)

                              }
                            />
                          </td>
                          <td>
                            <button className="maj" Type="button" onClick={() => handleRestaurantChange(restaurant)}>
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
            {/* Formulaire pour ajouter un restaurant */}
            <td>
              <input
                type="text"
                value={newRestaurant.Nom}
                onChange={(e) => setNewRestaurant({...newRestaurant, Nom: e.target.value})}
                placeholder="Nom"
                required
              />
              </td>
              <td>
              <input
                type="text"
                value={newRestaurant.Adresse}
                onChange={(e) => setNewRestaurant({...newRestaurant, Adresse: e.target.value})}
                placeholder="Adresse"
                required
              />
              </td>
              <td>
              <button  onClick={() => {handleAddRestaurant()}} className="add">Ajouter</button>
              </td>
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
                                handleUserInputChange(index, "fullName", e.target.value)

                              }
                            />
                          </td>
                          <td>
                            <input
                              Type="text"
                              value={user.role}
                              onChange={(e) =>
                                handleUserInputChange(index, "role", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <button className="maj" Type="button" onClick={() => handleUserChange(user)}>
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
                                handleArticleInputChange(index, "Name", e.target.value)

                              }
                            />
                          </td>
                          <td>
                            <input
                              Type="text"
                              value={product.Description}
                              onChange={(e) =>
                                handleArticleInputChange(index, "Description", e.target.value)

                              }
                            />
                          </td>
                          <td>
                            <input
                              Type="number"
                              value={product.Prix}
                              onChange={(e) =>
                                handleArticleInputChange(index, "Prix", e.target.value)

                              }
                            />
                          </td>
                          <td>
                            <input
                              Type="text"
                              value={product.Type}
                              onChange={(e) =>
                                handleArticleInputChange(index, "Type", e.target.value)

                              }
                            />
                          </td>
                          <td>
                            <button className="maj" Type="button" onClick={() => handleProductChange(product)}>
                              Mettre à jour
                            </button>
                            <button className="sup" onClick={() => handleRemoveProduct(index)}>
                              Supprimer
                            </button>
                          </td> {/* Déplacement des boutons à l'intérieur de chaque ligne */}
                        </tr>
                      ))}
                      <tr>
            {/* Formulaire pour ajouter un restaurant */}
            <td>
              <input
                type="text"
                value={newProduct.Name}
                onChange={(e) => setNewProduct({...newProduct, Nom: e.target.value})}
                placeholder="Name"
                required
              />
              </td>
              <td>
              <input
                type="text"
                value={newProduct.Description}
                onChange={(e) =>  setNewProduct({...newProduct, Adresse: e.target.value})}
                placeholder="Description"
                required
              />
              </td>
              <td>
              <input
                type="text"
                value={newProduct.Prix}
                onChange={(e) =>  setNewProduct({...newProduct, Adresse: e.target.value})}
                placeholder="Prix"
                required
              />
              </td>
              <td>
              <input
                type="text"
                value={newProduct.Type}
                onChange={(e) =>  setNewProduct({...newProduct, Adresse: e.target.value})}
                placeholder="Type"
                required
              />
              </td>
              <td>
              <button  onClick={() => {handleAddProduct()}} className="add">Ajouter</button>
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
