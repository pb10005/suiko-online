<template>
  <span>
    <v-avatar size="36" v-if="user.photoURL">
      <img :src="user.photoURL" />
    </v-avatar>
    <v-avatar :color="user.theme.hexa" size="36" v-else>
      <span class="white--text headline">{{
        user.screenName.substring(0, 1)
      }}</span>
    </v-avatar>
  </span>
</template>
<script>
export default {
  props: {
    user: {
      screenName: String,
      photoURL: String,
      theme: {
        hexa: String,
      },
    },
  },
};
</script>
