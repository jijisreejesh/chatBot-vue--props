<script setup>
import { ref, defineProps } from "vue";
const props = defineProps({
  msgData: {
    type: Object,
  },
  loggedUser: {
    type: Object,
  },
  index: {
    type: Number,
  },
});
const emit = defineEmits(["styling"]);
const SelectedMessage = () => {
  emit("styling", props.index);
};
</script>

<template>
  <v-card
    class="position-relative mb-3 pa-5 w-66 elevation-2 text-h6"
    :class="msgData.from == loggedUser.id ? ' sender bg-primary' : 'bg-indigo-lighten-5'"
    @click="SelectedMessage"
  >
    <!-- :class="{
      sender: msgData.from == loggedUser.id,
      receiver: msgData.to != loggedUser.id,
    }" -->
    {{ msgData.message }}
    <span style="float: right">{{
      new Date(msgData.time).toLocaleTimeString([], {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    }}</span>
  </v-card>
</template>

<style scoped>
.sender {
  margin-left: auto;
  /* background-color: #007bff; */
}
.receiver {
  align-self: flex-start;
  text-align: left;
}
span {
  position: absolute;
  bottom: 5px;
  right: 10px;
  font-size: 10px;
}
</style>
