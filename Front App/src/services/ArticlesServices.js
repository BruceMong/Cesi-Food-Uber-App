import firebase from "../firebase/config";
import "firebase/firestore";

class ArticlesServices {
    constructor() {
        this.db = firebase.firestore();
    }

    async getArticles() {

        const querySnapshot = await this.db.collection("Articles").get();
        const docs = [];
        querySnapshot.forEach((doc) => {
            docs.push({ id: doc.id, ...doc.data() });
        });
        return docs;
    }

    async getArticleById(id) {
        const doc = await this.db.collection("Articles").doc(id).get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        } else {
            throw new Error(`No article found with id: ${id}`);
        }
    }

}

const articlesServicesInstance = new ArticlesServices();
export default articlesServicesInstance;