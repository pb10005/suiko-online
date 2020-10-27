import firebase from "~/plugins/firebase";
const db = firebase.firestore();

export const state = () => ({
  request: {
    id: "",
    from: {
      id: "",
      username: "",
      screenName: "",
      theme: {
        hexa: ""
      }
    },
    summary: "",
    tags: "",
    draft: {
      title: "",
      content: ""
    }
  },
  comments: [],
  requests: [],
  tags: [],
  userRequests: []
});

export const mutations = {
  setTags(state, payload) {
    state.tags = payload;
  },
  setRequest(state, payload) {
    state.request = payload;
  },
  clearRequestComments(state, payload) {
    state.comments = [];
  },
  pushRequestComments(state, payload) {
    state.comments.push(payload);
  },
  clearRequests(state) {
    state.requests = [];
  },
  pushRequests(state, payload) {
    state.requests.push(payload);
  },
  clearUserRequests(state) {
    state.userRequests = [];
  },
  pushUserRequests(state, payload) {
    state.userRequests.push(payload);
  }
};

export const actions = {
  fetchTags(context, payload) {
    db.collection("constants")
      .doc("tags")
      .get()
      .then((doc) => {
        context.commit("setTags", doc.data().value);
      });
  },
  fetchRequest(context, payload) {
    const requestRef = db.collection("requests").doc(payload.id);
    return requestRef.get().then((doc) => {
      const id = doc.id;
      const request = doc.data();
      request.draft.get().then((d) => {
        db.collection("users")
          .doc(request.from)
          .get()
          .then((u) => {
            context.commit("setRequest", {
              id: id,
              from: {
                id: u.id,
                username: u.data().username,
                screenName: u.data().screenName,
                photoURL: u.data().photoURL,
                theme: u.data().theme
              },
              summary: request.summary,
              tags: request.tags,
              status: request.status,
              draft: d.data()
            });
          });
      });
    });
  },
  fetchRequestComments(context, payload) {
    context.commit("clearRequestComments");
    const requestRef = db.collection("requests").doc(payload.id);
    return requestRef
      .collection("comments")
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          db.collection("users")
            .doc(doc.data().from)
            .get()
            .then((u) => {
              const data = {
                id: doc.id,
                from: {
                  id: doc.data().from,
                  screenName: u.data().screenName,
                  photoURL: u.data().photoURL,
                  theme: u.data().theme
                },
                content: doc.data().content,
                timestamp: doc.data().timestamp,
                deleted: doc.data().deleted
              };
              context.commit("pushRequestComments", data);
            });
        });
      });
  },
  fetchUserRequests(context, payload) {
    context.commit("clearUserRequests");
    return new Promise((resolve) => {
      firebase.auth().onAuthStateChanged((user) => {
        db.collection("requests")
          .where("from", "==", user.uid)
          .get()
          .then((docs) => {
            docs.forEach((doc) => {
              const id = doc.id;
              const request = doc.data();
              request.draft.get().then((d) => {
                context.commit("pushUserRequests", {
                  id: id,
                  summary: request.summary,
                  tags: request.tags,
                  status: request.status,
                  draft: d.data()
                });
                resolve();
              });
            });
          });
      });
    });
  },
  fetchRequests(context, payload) {
    context.commit("clearRequests");
    db.collection("requests")
      .where("status", "==", "open")
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          const id = doc.id;
          const request = doc.data();
          request.draft.get().then((d) => {
            db.collection("users")
              .doc(request.from)
              .get()
              .then((u) => {
                context.commit("pushRequests", {
                  id: id,
                  from: {
                    id: u.id,
                    username: u.data().username,
                    screenName: u.data().screenName,
                    photoURL: u.data().photoURL,
                    theme: u.data().theme
                  },
                  summary: request.summary,
                  tags: request.tags,
                  draft: d.data()
                });
              });
          });
        });
      });
  }
};

export const getters = {
  tags({ tags }) {
    return tags;
  },
  request({ request }) {
    return request;
  },
  comments({ comments }) {
    const list = Object.assign([], comments);
    list.sort((x, y) => {
      return x.timestamp.toDate() - y.timestamp.toDate();
    });
    return list;
  },
  requests({ requests }) {
    return requests;
  },
  userRequests({ userRequests }) {
    return userRequests;
  }
};
