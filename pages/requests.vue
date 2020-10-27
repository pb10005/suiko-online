<template>
  <section>
    <v-card flat>
      <v-card-title class="headline">推敲依頼一覧</v-card-title>
      <v-card-text>
        <v-list two-line>
          <v-list-item-group>
            <template v-for="(item, index) in requests">
              <v-list-item :key="item.id">
                <template>
                  <v-list-item-content
                    @click="$router.push(`/request?id=${item.id}`)"
                  >
                    <v-list-item-title
                      v-text="item.summary"
                    ></v-list-item-title>
                    <v-list-item-subtitle>
                      <user-avatar :user="item.from" />
                      <span>{{ item.from.screenName }}</span>
                    </v-list-item-subtitle>
                    <v-chip-group>
                      <v-chip v-for="tag in item.tags" :key="tag">{{
                        tag
                      }}</v-chip>
                    </v-chip-group>
                  </v-list-item-content>
                </template>
              </v-list-item>

              <v-divider
                v-if="index < requests.length - 1"
                :key="index"
              ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </v-card-text>
    </v-card>
  </section>
</template>

<script>
import UserAvatar from "@/components/UserAvatar";
export default {
  components: {
    UserAvatar,
  },
  computed: {
    requests() {
      return this.$store.getters["requests/requests"];
    },
  },
  mounted() {
    this.$store.dispatch("requests/fetchRequests");
  },
};
</script>

<style scoped>
</style>
