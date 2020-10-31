<template>
  <v-container>
    <div id="firebaseui-auth-container"></div>
  </v-container>
</template>
<script>
import firebase from "~/plugins/firebase";
import * as firebaseui from "firebaseui-ja";
import "firebaseui-ja/dist/firebaseui.css";
const db = firebase.firestore();

export default {
  mounted() {
    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          db.collection("users")
            .doc(authResult.user.uid)
            .get()
            .then((doc) => {
              if (doc.exists) {
                this.$router.push("/dashboard");
              } else {
                db.collection("users")
                  .doc(authResult.user.uid)
                  .set(
                    {
                      theme: {
                        hexa: "#616161FF",
                      },
                      screenName: "名称未設定",
                      bio: "",
                      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    },
                    { merge: true }
                  )
                  .then(() => {
                    this.$router.push("/dashboard");
                  });
              }
            });
          return false;
        },
      },
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
      ],
    };
    const ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebase.auth());
    ui.start("#firebaseui-auth-container", uiConfig);
  },
};
</script>