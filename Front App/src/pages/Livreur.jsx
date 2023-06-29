import React, { useState, useEffect } from "react";
import CommonSection from "../components/UI/common-section/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "../styles/livreur.css";
import Cookies from 'js-cookie';
import axios from 'axios';

const Livreur = () => {
  const [livraisonRecuperee, setLivraisonRecuperee] = useState([]);
  const [livraisonLivree, setLivraisonLivree] = useState([]);
  const [accepterCommande, setAccepterCommande] = useState([]);
  const [isRecupererModalOpen, setRecupererModalOpen] = useState([]);
  const [isLivrerModalOpen, setLivrerModalOpen] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const token = Cookies.get("token");

  useEffect(() => {
    axios.get('http://localhost:3000/commandes-with-fullname/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log("commandes :", response.data);
      setCommandes(response.data);
      setLivraisonRecuperee(Array(response.data.length).fill(false));
      setLivraisonLivree(Array(response.data.length).fill(false));
      setAccepterCommande(Array(response.data.length).fill(false));
      setRecupererModalOpen(Array(response.data.length).fill(false));
      setLivrerModalOpen(Array(response.data.length).fill(false));
    })
    .catch(error => {
      console.error('Error fetching commandes', error);
    });
  }, []);

  const toggleRecupererModal = (index) => {
    const updatedRecupererModalOpen = [...isRecupererModalOpen];
    updatedRecupererModalOpen[index] = !isRecupererModalOpen[index];
    setRecupererModalOpen(updatedRecupererModalOpen);
  };

  const toggleLivrerModal = (index) => {
    const updatedLivrerModalOpen = [...isLivrerModalOpen];
    updatedLivrerModalOpen[index] = !isLivrerModalOpen[index];
    setLivrerModalOpen(updatedLivrerModalOpen);
  };

  const handleAccepterCommande = (index) => {
    const updatedAccepterCommande = [...accepterCommande];
    updatedAccepterCommande[index] = true;
    setAccepterCommande(updatedAccepterCommande);
  };

  const handleLivraisonRecupereeChange = (index) => {
    if (!livraisonRecuperee[index]) {
      toggleRecupererModal(index);
    }
  };

  const handleLivraisonLivreeChange = (index) => {
    if (livraisonRecuperee[index] && !livraisonLivree[index]) {
      toggleLivrerModal(index);
    }
  };

  const handleConfirmationRecuperer = (index) => {
    const updatedLivraisonRecuperee = [...livraisonRecuperee];
    updatedLivraisonRecuperee[index] = true;
    setLivraisonRecuperee(updatedLivraisonRecuperee);
    toggleRecupererModal(index);
  };

  const handleConfirmationLivrer = (index) => {
    const updatedLivraisonLivree = [...livraisonLivree];
    updatedLivraisonLivree[index] = true;
    setLivraisonLivree(updatedLivraisonLivree);
    toggleLivrerModal(index);
  };

  return (
    <Helmet title="Livraison">
      <CommonSection title="Livraison" />
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <h4 className="mb-3">Livraisons</h4>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Commande</th>
                    <th>Date de livraison</th>
                    <th>Nom client</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {commandes.map((commande, index) => (
                    <tr key={index}>
                      <td>{commande.id}</td>
                      <td>{(new Date(commande.Date_Livraison._seconds * 1000).toLocaleDateString())}</td>
                      <td>{commande.fullName}</td>
                      <td>
                        {accepterCommande[index] ? (
                          <>
                            {!livraisonRecuperee[index] && (
                              <button className={`btn${index} btn-primary`} onClick={() => handleLivraisonRecupereeChange(index)}>
                                Récupérer la livraison
                              </button>
                            )}
                            {livraisonRecuperee[index] && !livraisonLivree[index] && (
                              <button className={`btn${index} btn-primary`} onClick={() => handleLivraisonLivreeChange(index)}>
                                Marquer comme livrée
                              </button>
                            )}
                          </>
                        ) : (
                          <button className={`btn${index} btn-primary`} onClick={() => handleAccepterCommande(index)}>
                            Accepter la commande
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Modal de récupération de la commande */}
      {commandes.map((_, index) => (
        <Modal key={index} isOpen={isRecupererModalOpen[index]} toggle={() => toggleRecupererModal(index)}>
          <ModalHeader toggle={() => toggleRecupererModal(index)}>Confirmation</ModalHeader>
          <ModalBody>Êtes-vous sûr de vouloir récupérer cette commande ?</ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={() => handleConfirmationRecuperer(index)}>
              Confirmer
            </button>
            <button className="btn btn-secondary" onClick={() => toggleRecupererModal(index)}>
              Annuler
            </button>
          </ModalFooter>
        </Modal>
      ))}

      {/* Modal de marquage de la commande comme livrée */}
      {commandes.map((_, index) => (
        <Modal key={index} isOpen={isLivrerModalOpen[index]} toggle={() => toggleLivrerModal(index)}>
          <ModalHeader toggle={() => toggleLivrerModal(index)}>Confirmation</ModalHeader>
          <ModalBody>Êtes-vous sûr de vouloir marquer cette commande comme livrée ?</ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={() => handleConfirmationLivrer(index)}>
              Confirmer
            </button>
            <button className="btn btn-secondary" onClick={() => toggleLivrerModal(index)}>
              Annuler
            </button>
          </ModalFooter>
        </Modal>
      ))}
    </Helmet>
  );
};

export default Livreur;
