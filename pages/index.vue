<template>
  <section>
    <v-card flat color="#2c3e50" dark>
      <v-card-text class="d-flex justify-center">
        <Logo />
      </v-card-text>
      <v-card-text class="d-flex justify-center">
        <p>
          推敲オンラインはカタチになる前のアイデアにアドバイスや意見を持ち寄り、カタチになるまでを応援するサイトです。
        </p>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn outlined large @click="$router.push('/login')"
          >ログイン・新規登録</v-btn
        >
        <v-btn outlined large @click="$router.push('/requests')"
          >推敲依頼一覧</v-btn
        >
      </v-card-actions>
    </v-card>
  </section>
</template>

<script>
import Logo from "@/components/Logo";
export default {
  components: {
    Logo,
  },
};
</script>

<style scoped>
</style>
