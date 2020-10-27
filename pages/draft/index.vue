<template>
  <section>
    <v-card flat v-if="!loading">
      <v-card-title>{{ draftRef.data().title }}</v-card-title>
      <v-card-text>
        <span class="multiline">{{ draftRef.data().content }}</span>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="$router.push(`/draft/edit?id=${$route.query.id}`)" text
          >編集</v-btn
        >
        <v-btn @click="remove" text>削除</v-btn>
      </v-card-actions>
    </v-card>
    <v-container>
      <v-card class="ma-1">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>推敲依頼を出す</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card flat color="grey lighten-4">
                <v-card-text>
                  <v-form>
                    <v-text-field v-model="summary" label="概要"></v-text-field>
                    <v-select
                      v-model="tags"
                      chips
                      multiple
                      label="タグ"
                      :items="tagConstants"
                    ></v-select>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-btn :disabled="summary === ''" @click="request" text
                    >依頼</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </v-container>
  </section>
</template>
<script>
import firebase from "~/plugins/firebase";
const db = firebase.firestore();
export default {
  middleware: ["auth", "private"],
  data() {
    return {
      summary: "",
      tags: [],
      draftRef: null,
      loading: true,
    };
  },
  computed: {
    tagConstants() {
      return this.$store.getters["requests/tags"];
    },
  },
  mounted() {
    this.$store.dispatch("requests/fetchTags");
    db.collection("drafts")
      .doc(this.$route.query.id)
      .get()
      .then((doc) => {
        this.draftRef = doc;
        this.loading = false;
      });
  },
  methods: {
    request() {
      db.collection("requests")
        .add({
          draft: this.draftRef.ref,
          from: firebase.auth().currentUser.uid,
          tags: this.tags,
          summary: this.summary,
          status: "open",
        })
        .then(() => {
          this.$router.push("/dashboard");
        });
    },
    remove() {
      db.collection("drafts").doc(this.$route.query.id).delete();
    },
  },
};
</script>