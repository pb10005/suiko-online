<template>
  <section>
    <v-card v-if="!loading" flat>
      <v-card-title>{{ request.summary }}</v-card-title>
      <v-card-subtitle>
        <user-avatar :user="request.from" />
        <span>{{ request.from.screenName }}</span></v-card-subtitle
      >
      <v-card-text>
        <v-alert type="info" v-if="request.status === 'closed'">
          推敲依頼はクローズされました
        </v-alert>
        <v-chip-group>
          <v-chip v-for="tag in request.tags" :key="tag">{{ tag }}</v-chip>
        </v-chip-group>
        <v-card class="grey lighten-4" flat>
          <v-card-title>{{ request.draft.title }}</v-card-title>
          <v-card-text>
            <span
              class="multiline"
              v-html="$md.render(request.draft.content)"
            ></span>
          </v-card-text>
        </v-card>
      </v-card-text>
      <v-card-actions v-if="isAuthor & (request.status === 'open')">
        <v-btn text @click="$router.push(`/request/edit?id=${$route.query.id}`)"
          >編集</v-btn
        >
        <v-btn text @click="close">クローズ</v-btn>
      </v-card-actions>
    </v-card>
    <v-container>
      <v-card class="ma-1" v-if="request.status === 'open'">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>推敲する</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card flat color="grey lighten-4">
                <v-card-text>
                  <v-form ref="form">
                    <v-textarea v-model="comment" label="コメント"></v-textarea>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-btn :disabled="comment === ''" @click="send" text
                    >送信</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
      <v-card class="ma-1">
        <v-list subheader two-line v-if="!loading && comments.length > 0">
          <v-subheader>コメント</v-subheader>
          <v-list-item
            v-for="item in comments"
            :key="item.id"
            :class="item.deleted ? 'grey lighten-2' : ''"
          >
            <v-list-item-avatar v-if="item.from.photoURL">
              <img :src="item.from.photoURL" />
            </v-list-item-avatar>
            <v-list-item-avatar :color="item.from.theme.hexa" v-else>
              <span class="white--text headline">{{
                item.from.screenName.substring(0, 1)
              }}</span>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ item.from.screenName }}</v-list-item-title>

              <v-list-item-subtitle
                ><v-row
                  ><v-col>{{
                    item.deleted ? "コメントは削除されました" : item.content
                  }}</v-col>
                  <v-col class="text-right">
                    {{ item.timestamp.toDate().toLocaleString() }}
                  </v-col></v-row
                ></v-list-item-subtitle
              >
            </v-list-item-content>

            <v-list-item-action>
              <v-btn
                icon
                v-if="currentUser === item.from.id && !item.deleted"
                @click="remove(item.id)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </v-container>
  </section>
</template>

<script>
import firebase from "~/plugins/firebase";
import UserAvatar from "~/components/UserAvatar";
const db = firebase.firestore();
export default {
  middleware: ["auth"],
  components: {
    UserAvatar,
  },
  computed: {
    request() {
      return this.$store.getters["requests/request"];
    },
    comments() {
      return this.$store.getters["requests/comments"];
    },
    isAuthor() {
      return this.request.from.id === this.currentUser;
    },
  },
  data() {
    return {
      comment: "",
      loading: true,
      currentUser: "",
      sendButtonActive: false,
    };
  },
  mounted() {
    this.loading = true;
    firebase.auth().onAuthStateChanged((user) => {
      this.currentUser = user.uid;
      this.$store
        .dispatch("requests/fetchRequest", { id: this.$route.query.id })
        .then(() => {
          this.$store
            .dispatch("requests/fetchRequestComments", {
              id: this.$route.query.id,
            })
            .then(() => {
              this.loading = false;
            });
        });
    });
  },
  methods: {
    send() {
      db.collection("requests")
        .doc(this.$route.query.id)
        .collection("comments")
        .add({
          from: this.currentUser.uid,
          content: this.comment,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          this.loading = true;
          this.$store
            .dispatch("requests/fetchRequestComments", {
              id: this.$route.query.id,
            })
            .then(() => {
              this.loading = false;
            });
        });
    },
    close() {
      db.collection("requests")
        .doc(this.$route.query.id)
        .update({
          status: "closed",
        })
        .then(() => {
          this.$router.push("/dashboard");
        });
    },
    remove(id) {
      db.collection("requests")
        .doc(this.$route.query.id)
        .collection("comments")
        .doc(id)
        .update({
          deleted: true,
        })
        .then(() => {
          this.loading = true;
          this.$store
            .dispatch("requests/fetchRequestComments", {
              id: this.$route.query.id,
            })
            .then(() => {
              this.loading = false;
            });
        });
    },
  },
};
</script>

<style scoped>
</style>
