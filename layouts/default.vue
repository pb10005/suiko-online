<template>
  <v-app>
    <v-app-bar color="#2c3e50" dark dense flat app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon size="32">mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item link @click="$router.push('/settings')">
            <v-list-item-title>アカウント設定</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="logout">
            <v-list-item-title>ログアウト</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app>
      <v-list nav dense>
        <v-list-item-group dense active-class="blue-grey--text text--accent-4">
          <v-list-item @click="$router.push('/')">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>HOME</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="$router.push('/dashboard')">
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item>

          <v-list-item @click="$router.push('/requests')">
            <v-list-item-icon>
              <v-icon>mdi-square-edit-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>推敲依頼一覧</v-list-item-title>
          </v-list-item>
          <v-list-item @click="$router.push('/users')">
            <v-list-item-icon>
              <v-icon>mdi-account-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-title>ユーザー一覧</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main class="blue-grey lighten-5">
      <Nuxt :nuxt-child-key="$route.fullPath" />
    </v-main>
  </v-app>
</template>
<script>
import firebase from "~/plugins/firebase";
const db = firebase.firestore();
export default {
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) this.photoURL = user.photoURL;
    });
  },
  data() {
    return {
      drawer: false,
      photoURL: "",
    };
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push("/login");
        });
    },
  },
};
</script>
<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.multiline {
  white-space: pre-wrap;
}
</style>
