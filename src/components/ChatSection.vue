<script setup>
import {ref,defineProps} from 'vue'
const props=defineProps({
    msgData:{
        type:Object
    },
    loggedUser:{
        type:Object
    }

})
</script>

<template>

<div class="message" :class="{sender:msgData.from==loggedUser.id , receiver: msgData.to !=loggedUser.id}">
    {{ msgData.message }}
            <sub style="float: right">{{
              new Date(msgData.time).toLocaleTimeString([], {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            }}</sub>
 
</div>

</template>

<style scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.message {
  color: whitesmoke;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: #007bff;
  overflow: hidden;
  max-width: 70%;
  word-wrap: break-word; /* Allow words to break */
  overflow: hidden; /* Hide overflowing content */
  text-overflow: ellipsis; /* Add "..." for overflowing text */
  white-space: wrap; /* Prevent text wrapping */
}
.sender {

  margin-left: auto;

}
.receiver {
  align-self: flex-start;
  background-color: #05c4b4;
  color: black;
  text-align: left;
}
</style>