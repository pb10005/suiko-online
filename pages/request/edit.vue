<template>
  <v-container fluid>
    <v-card>
      <v-card-title>推敲依頼を編集</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field v-model="request.summary" label="概要"></v-text-field>
          <v-select
            label="タグ"
            v-model="request.tags"
            chips
            multiple
            :items="tagConstants"
          ></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="$router.push('/dashboard')" text>キャンセル</v-btn>
        <v-btn :disabled="request.summary === ''" @click="save" text
          >保存</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import firebase from "~/plugins/firebase";
const db = firebase.firestore();
export default {
  middleware: ["auth", "privateRequest"],
  computed: {
    tagConstants() {
      return this.$store.getters["requests/tags"];
    },
  },
  data() {
    return {
      request: {
        tags: [],
        summary: "",
      },
    };
  },
  mounted() {
    this.$store.dispatch("requests/fetchTags");
    db.collection("requests")
      .doc(this.$route.query.id)
      .get()
      .then((doc) => {
        const request = doc.data();
        this.request = {
          tags: request.tags,
          summary: request.summary,
        };
      });
  },
  methods: {
    save() {
      db.collection("requests")
        .doc(this.$route.query.id)
        .update(this.request)
        .then(() => {
          this.$router.push("/dashboard");
        });
    },
  },
};
</script>

<style scoped>
</style>
