import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CommonSection from "../components/UI/common-section/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "../styles/livreur.css";
import firebase from "../firebase/config";
import "firebase/firestore";

const Tr = ({ deliveries, client }) => {
  return (
    <>
      {deliveries.map((delivery) => (
        <tr key={delivery.id}>
          {/* Render the client and livreur data */}
          <td className="text-center">{client.find((c) => c.id === delivery.Id_Client)?.fullName || ""}</td>
          <td className="text-center">{delivery.Statut ? delivery.Statut : ""}</td>
          <td className="text-center">
            {delivery.Date_Livraison ? delivery.Date_Livraison.toDate().toLocaleString() : ""}
          </td>
        </tr>
      ))}
    </>
  );
};

const Livreur = () => {
  const [livraisonRecuperee, setLivraisonRecuperee] = useState(false);
  const [livraisonLivree, setLivraisonLivree] = useState(false);
  const [accepterCommande, setAccepterCommande] = useState(false);
  const [isRecupererModalOpen, setRecupererModalOpen] = useState(false);
  const [isLivrerModalOpen, setLivrerModalOpen] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [client, setClient] = useState([]);
  const [commandesquanti, setCommandesQuantiees] = useState([]);
  const [foodDataArray, setFoodDataArray] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = firebase.firestore();
        const snapshot = await db.collection("Commandes").where("Statut", "==", "En attente").get();

        const data = snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        if (data) {
          setDeliveries(data);
        }
      } catch (error) {
        console.log("Error fetching data from Firebase:", error);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    const fetCommandesQuantités = async () => {
      try {
        const db = firebase.firestore();
        const CommandePromise = deliveries.map(async (delivery) => {
          const snapshot2 = await db
            .collection("CommandesQuantitees")
            .where("Id_Commande", "==", delivery.id)
            .get();
    
          const commandData = snapshot2.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
    
          return commandData;
        });
    
        const commandesQuantiteesData = await Promise.all(CommandePromise);
    
        if (commandesQuantiteesData.length > 0) {
          setCommandesQuantiees(commandesQuantiteesData);
        }
      } catch (error) {
        console.log("Error fetching CommandesQuantitées data from Firebase:", error);
      }
    };
      fetCommandesQuantités();
      
    },[deliveries]);


    useEffect(() => {
      const fetchClientData2 = async () => {
        try {
          if (commandesquanti !== null && commandesquanti.length > 0) {
            const db = firebase.firestore();
            
            const dataPromises = commandesquanti.map(async (innerArray) => {
              const [{ Id_Article }] = innerArray; // Destructure the inner array to get the Id_Article
              console.log(Id_Article)
              if (Id_Article) {
        
                const snapshot3 = await db.collection("Articles").doc(Id_Article).get();
        
        
                const data3 = snapshot3.data();
                
                return data3;
              }
              return null; // Or handle the case where Id_Article is missing or falsy
            });
            
            const articleDataArray = await Promise.all(dataPromises);
            console.log("ArticleDataArray:", articleDataArray);
        
            setFoodDataArray(articleDataArray);
          }
        } catch (error) {
          console.error("Error fetching ARTICLES data from Firebase:", error);
        }
      };
      
      fetchClientData2();
    }, [commandesquanti]);
    
    
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const db = firebase.firestore();
        const clientPromises = deliveries.map(async (delivery) => {
          const snapshot = await db.collection("users").doc(delivery.Id_Client).get();
          return { id: snapshot.id, ...snapshot.data() };
        });
  
        const clientData = await Promise.all(clientPromises);
  
        if (clientData) {
          setClient(clientData);
        }
      } catch (error) {
        console.log("Error fetching client data from Firebase:", error);
      }
    };
  
    if (deliveries.length > 0) {
      fetchClient();
    }
  }, [deliveries]);
  
  
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
                    <th>Full Name</th>
                    <th>Statut</th>
                    <th>Delivery Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>

                  <Tr deliveries={deliveries} client={client} />

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
