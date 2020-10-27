<template>
  <section>
    <v-card flat color="grey lighten-3">
      <v-card-title>
        <user-avatar :user="user" />
        <span>{{ user.screenName }}</span>
      </v-card-title>
      <v-card-text class="multiline">{{ user.bio }}</v-card-text>
    </v-card>
    <v-tabs v-model="tab" centered>
      <v-tab> 叩き台 </v-tab>
      <v-tab> 推敲依頼 </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card flat>
          <v-card-title class="headline"> あなたの叩き台 </v-card-title>
          <v-card-text>
            <v-btn
              icon
              depressed
              color="primary"
              @click="$router.push('/draft/create')"
              ><v-icon>mdi-text-box-plus</v-icon></v-btn
            >
            <v-list two-line>
              <v-list-item-group>
                <template v-for="(item, index) in drafts">
                  <v-divider
                    v-if="index < drafts.length"
                    :key="index"
                  ></v-divider>
                  <v-list-item
                    :key="item.id"
                    @click="$router.push(`/draft?id=${item.id}`)"
                  >
                    <template>
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="item.data.title"
                        ></v-list-item-title>
                      </v-list-item-content>
                    </template>
                  </v-list-item>
                </template>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-title class="headline">推敲依頼</v-card-title>
          <v-card-text>
            <v-list two-line>
              <v-list-item-group>
                <template v-for="(item, index) in userRequests">
                  <v-list-item
                    :key="item.id"
                    @click="$router.push(`/request?id=${item.id}`)"
                    :class="item.status === 'closed' ? 'grey lighten-2' : ''"
                  >
                    <template>
                      <v-list-item-content>
                        <v-list-item-title>{{
                          item.summary
                        }}</v-list-item-title>
                        <v-chip-group>
                          <v-chip v-for="tag in item.tags" :key="tag">{{
                            tag
                          }}</v-chip>
                        </v-chip-group>
                      </v-list-item-content>
                    </template>
                  </v-list-item>
                  <v-divider
                    v-if="index < userRequests.length - 1"
                    :key="index"
                  ></v-divider>
                </template>
              </v-list-item-group> </v-list
          ></v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
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
  data() {
    return {
      tab: null,
      drafts: [],
    };
  },
  computed: {
    user() {
      return this.$store.getters["user/user"];
    },
    userRequests() {
      let requests = Object.assign(
        [],
        this.$store.getters["requests/userRequests"]
      );
      return requests.sort((x, y) => {
        return x.status > y.status ? -1 : 1;
      });
    },
  },
  mounted() {
    this.$store.dispatch("user/fetchUser");
    this.$store.dispatch("requests/fetchUserRequests");

    firebase.auth().onAuthStateChanged((user) => {
      db.collection("drafts")
        .where("editor", "==", user.uid)
        .get()
        .then((docs) => {
          docs.forEach((doc) => {
            const record = {
              id: doc.id,
              data: doc.data(),
            };
            this.drafts.push(record);
          });
        });
    });
  },
  methods: {},
};
</script>