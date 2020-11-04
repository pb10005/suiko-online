import firebase from "~/plugins/firebase";
import "firebase/firestore";

const db = firebase.firestore();
export default function ({ store, route, redirect }) {
  return new Promise((resolve) => {
    db.collection("drafts")
      .doc(route.query.id)
      .get()
      .then((doc) => {
        if (firebase.auth().currentUser.uid !== doc.data().editor) {
          return redirect("/dashboard");
        } else {
          resolve();
        }
      });
  });
}
