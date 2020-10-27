<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-text-field label="タイトル" v-model="draft.title"></v-text-field>
        <v-textarea label="本文" v-model="draft.content"></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="$router.push('/dashboard')" text>キャンセル</v-btn>
        <v-btn
          :disabled="draft.title === '' || draft.content === ''"
          @click="save"
          text
          >保存する</v-btn
        >
      </v-card-actions>
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
      id: "",
      draft: {
        title: "",
        content: "",
      },
    };
  },
  mounted() {},
  methods: {
    save() {
      db.collection("drafts")
        .add({
          editor: firebase.auth().currentUser.uid,
          title: this.draft.title,
          content: this.draft.content,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          this.$router.push("/dashboard");
        });
    },
  },
};
</script>