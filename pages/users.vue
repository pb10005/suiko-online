<template>
  <section>
    <v-list two-line with-subheader>
      <v-subheader>ユーザー一覧</v-subheader>
      <v-list-item-group>
        <template v-for="(item, index) in users">
          <v-list-item :key="item.id">
            <template>
              <v-list-item-avatar size="36" v-if="item.data.photoURL">
                <img :src="item.data.photoURL" />
              </v-list-item-avatar>
              <v-list-item-avatar
                :color="item.data.theme.hexa"
                size="36"
                v-else
              >
                <span class="white--text headline">{{
                  item.data.screenName.substring(0, 1)
                }}</span>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  v-text="item.data.screenName"
                ></v-list-item-title>
                <v-list-item-subtitle>
                  <span>{{ item.data.username }}</span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-list-item>

          <v-divider v-if="index < users.length - 1" :key="index"></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
  </section>
</template>
<script>
export default {
  computed: {
    users() {
      return this.$store.getters["user/users"];
    },
  },
  mounted() {
    this.$store.dispatch("user/fetchUsers");
  },
};
</script>