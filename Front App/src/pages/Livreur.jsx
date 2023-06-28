import React, { useState } from "react";
import CommonSection from "../components/UI/common-section/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "../styles/livreur.css";

const Livreur = () => {
  const [livraisonRecuperee, setLivraisonRecuperee] = useState(false);
  const [livraisonLivree, setLivraisonLivree] = useState(false);
  const [accepterCommande, setAccepterCommande] = useState(false);
  const [isRecupererModalOpen, setRecupererModalOpen] = useState(false);
  const [isLivrerModalOpen, setLivrerModalOpen] = useState(false);

  const toggleRecupererModal = () => {
    setRecupererModalOpen(!isRecupererModalOpen);
  };

  const toggleLivrerModal = () => {
    setLivrerModalOpen(!isLivrerModalOpen);
  };

  const handleAccepterCommande = () => {
    setAccepterCommande(true);
  };

  const handleLivraisonRecupereeChange = () => {
    if (!livraisonRecuperee) {
      toggleRecupererModal();
    }
  };

  const handleLivraisonLivreeChange = () => {
    if (livraisonRecuperee && !livraisonLivree) {
      toggleLivrerModal();
    }
  };

  const handleConfirmationRecuperer = () => {
    setRecupererModalOpen(false);
    setLivraisonRecuperee(true);
  };

  const handleConfirmationLivrer = () => {
    setLivrerModalOpen(false);
    setLivraisonLivree(true);
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
                  {/* Exemple de ligne de livraison */}
                  <tr>
                    <td>Commande</td>
                    <td>Date de livraison</td>
                    <td>Nom client</td>
                    <td>
                      {accepterCommande ? (
                        <>
                          <input
                            type="checkbox"
                            checked={livraisonRecuperee}
                            onChange={handleLivraisonRecupereeChange}
                            disabled={livraisonRecuperee}
                          />{" "}
                          Livraison récupérée
                          <br />
                          <input
                            type="checkbox"
                            checked={livraisonLivree}
                            onChange={handleLivraisonLivreeChange}
                            disabled={!livraisonRecuperee || livraisonLivree}
                          />{" "}
                          Livrée
                        </>
                      ) : (
                        <button className="btna" onClick={handleAccepterCommande}>
                          Accepter la commande
                        </button>
                      )}
                    </td>
                  </tr>
                  {/* Fin de l'exemple de ligne de livraison */}
                </tbody>
              </table>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Modal de récupération de la commande */}
      <Modal isOpen={isRecupererModalOpen} toggle={toggleRecupererModal}>
        <ModalHeader toggle={toggleRecupererModal}>Confirmation</ModalHeader>
        <ModalBody>Êtes-vous sûr de vouloir récupérer cette commande ?</ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={handleConfirmationRecuperer}>
            Confirmer
          </button>
          <button className="btn btn-secondary" onClick={toggleRecupererModal}>
            Annuler
          </button>
        </ModalFooter>
      </Modal>

      {/* Modal de marquage de la commande comme livrée */}
      <Modal isOpen={isLivrerModalOpen} toggle={toggleLivrerModal}>
        <ModalHeader toggle={toggleLivrerModal}>Confirmation</ModalHeader>
        <ModalBody>Êtes-vous sûr de vouloir marquer cette commande comme livrée ?</ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={handleConfirmationLivrer}>
            Confirmer
          </button>
          <button className="btn btn-secondary" onClick={toggleLivrerModal}>
            Annuler
          </button>
        </ModalFooter>
      </Modal>
    </Helmet>
  );
};

export default Livreur;
