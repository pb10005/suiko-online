<template>
  <v-container>
    <v-card>
      <v-card-title>アカウント設定</v-card-title>
      <v-card-text>
        <v-text-field
          label="ユーザー名"
          v-model="profile.screenName"
        ></v-text-field>
        <v-text-field
          label="プロフィール画像URL"
          v-model="profile.photoURL"
        ></v-text-field>
        <v-btn text @click="useAccountPhoto">アカウント画像を使用</v-btn><br />
        <label>テーマカラー</label>
        <v-color-picker
          class="ma-2"
          dot-size="30"
          v-model="profile.theme"
        ></v-color-picker>
        <v-textarea label="プロフィール" v-model="profile.bio"></v-textarea>
        <v-btn @click="$router.push('/dashboard')" text>キャンセル</v-btn>
        <v-btn @click="save" text>保存する</v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import firebase from "~/plugins/firebase";
const db = firebase.firestore();
export default {
  middleware: ["auth"],
  data() {
    return {
      profile: {
        screenName: "",
        photoURL: "",
        theme: {},
        bio: "",
      },
    };
  },
  mounted() {
    this.$store.dispatch("user/fetchUser").then(() => {
      this.profile = Object.assign({}, this.$store.getters["user/user"]);
    });
  },
  methods: {
    useAccountPhoto() {
      firebase.auth().onAuthStateChanged((user) => {
        this.profile.photoURL = user.photoURL;
      });
    },
    save() {
      firebase.auth().onAuthStateChanged((user) => {
        db.collection("users")
          .doc(user.uid)
          .set(this.profile, { merge: true })
          .then(() => {
            this.$router.push("/dashboard");
          });
      });
    },
  },
};
</script>