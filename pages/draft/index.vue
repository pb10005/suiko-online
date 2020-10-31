<template>
  <section>
    <v-card flat v-if="!loading">
      <v-card-title>{{ draftRef.data().title }}</v-card-title>
      <v-card-text>
        <span
          class="multiline"
          v-html="$md.render(draftRef.data().content)"
        ></span>
        <ul>
          <li v-for="rev in revisions" :key="rev.id">
            <v-btn text @click="$router.push(`/draft?id=${rev.id}`)">{{
              rev.title
            }}</v-btn>
          </li>
        </ul>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="$router.push(`/draft/edit?id=${$route.query.id}`)" text
          >編集</v-btn
        >
        <v-btn @click="createRevision" text>リビジョンを作成</v-btn>
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
      revisions: [],
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
    this.load();
  },
  methods: {
    load() {
      this.$store.dispatch("requests/fetchTags");
      db.collection("drafts")
        .doc(this.$route.query.id)
        .get()
        .then((doc) => {
          this.draftRef = doc;
          return db
            .collection("drafts")
            .where("derived_from", "==", doc.id)
            .get();
        })
        .then((docs) => {
          if (docs) {
            this.revisions = [];
            docs.forEach((rev) => {
              this.revisions.push({
                id: rev.id,
                title: rev.data().title,
              });
            });
          }
          this.loading = false;
        });
    },
    request() {
      db.collection("requests")
        .add({
          draft: this.draftRef.ref,
          from: firebase.auth().currentUser.uid,
          tags: this.tags,
          summary: this.summary,
          status: "open",
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          this.$router.push("/dashboard");
        });
    },
    createRevision() {
      const revNum = this.draftRef.data().revisionNum;
      if (revNum) {
        db.collection("drafts")
          .add({
            editor: firebase.auth().currentUser.uid,
            title: this.draftRef.data().title + "_" + (revNum + 1),
            content: this.draftRef.data().content,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            derived_from: this.$route.query.id,
          })
          .then((doc) => {
            return db
              .collection("drafts")
              .doc(this.draftRef.id)
              .set(
                {
                  revisionNum: revNum + 1,
                },
                { merge: true }
              );
          })
          .then(() => {
            this.load();
          });
      } else {
        db.collection("drafts")
          .add({
            editor: firebase.auth().currentUser.uid,
            title: this.draftRef.data().title + "_1",
            content: this.draftRef.data().content,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            derived_from: this.$route.query.id,
          })
          .then((doc) => {
            return db.collection("drafts").doc(this.draftRef.id).set(
              {
                revisionNum: 1,
              },
              { merge: true }
            );
          })
          .then(() => {
            this.load();
          });
      }
    },
    remove() {
      db.collection("drafts").doc(this.$route.query.id).delete();
    },
  },
};
</script>