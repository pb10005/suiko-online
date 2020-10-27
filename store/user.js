import firebase from "~/plugins/firebase";
const db = firebase.firestore();

export const state = () => ({
  user: {
    screenName: "",
    photoURL: "",
    theme: {},
    bio: ""
  },
  users: []
});

export const mutations = {
  setUser(state, payload) {
    state.user = {
      screenName: payload.screenName,
      photoURL: payload.photoURL,
      theme: payload.theme,
      bio: payload.bio
    };
  },
  clearUsers(state, payload) {
    state.users = [];
  },
  pushUsers(state, payload) {
    state.users.push(payload);
  }
};

export const actions = {
  fetchUser(context, payload) {
    return new Promise((resolve) => {
      firebase.auth().onAuthStateChanged((user) => {
        db.collection("users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            const user = doc.data();
            context.commit("setUser", user);
            resolve();
          });
      });
    });
  },
  fetchUsers(context, payload) {
    db.collection("users")
      .get()
      .then((docs) => {
        context.commit("clearUsers");
        docs.forEach((doc) => {
          context.commit("pushUsers", {
            id: doc.id,
            data: doc.data()
          });
        });
      });
  }
};

export const getters = {
  user({ user }) {
    return user;
  },
  users({ users }) {
    return users;
  }
};
