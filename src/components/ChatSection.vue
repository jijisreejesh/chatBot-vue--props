<script setup>
import {ref,defineProps} from 'vue'
const props=defineProps({
    msgData:{
        type:Object
    },
    loggedUser:{
        type:Object
    },
    index:{
      type:Number
    }

})
const emit=defineEmits(["styling"])
const SelectedMessage=()=>{
emit("styling",props.index);
}
</script>

<template>

<div class="message" :class="{sender:msgData.from==loggedUser.id , receiver: msgData.to !=loggedUser.id}" @click="SelectedMessage">
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
 
</div>

</template>

<style scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.message {
  position: relative;
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
  background: #ddd;
  color: black;
  text-align: left;
}
span{
position: absolute;
bottom:5px;
right:10px;
font-size: 10px;
color: rgb(86, 63, 63);

}
</style>