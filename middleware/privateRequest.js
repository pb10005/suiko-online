import firebase from "~/plugins/firebase";
const db = firebase.firestore();
export default function ({ store, route, redirect }) {
  return new Promise((resolve) => {
    db.collection("requests")
      .doc(route.query.id)
      .get()
      .then((doc) => {
        if (firebase.auth().currentUser.uid !== doc.data().from) {
          return redirect("/dashboard");
        } else {
          resolve();
        }
      });
  });
}
