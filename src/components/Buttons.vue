
<script setup>
const props = defineProps({
   text:{
      type:String,
      default:""
   },
   col:{
    type:String,
    default:""
   },
   classBtn:{
      type:String,
      default:''
   },
   disable:{
      type:Boolean,
      default:false
   }
})
</script>
<template>
    <button :style="{color:col}" :class="classBtn"
    :disabled="disable">
  {{text}} 
    </button>
</template>

<style scoped>
button{
 width: max-content;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 10px;
  font-size: large;
}
.btnStyle:hover{
   background-color:rgb(252, 161, 161);
   color:white;
}
.btnStyle{
 position: absolute;
  bottom: 0;
  margin-bottom: 20px;
  padding-top:5px;
  padding-bottom: 5px;
} 
.btnSend{
   font-size: xx-large;
}
.btnSend:hover{
background-color: rgb(151, 151, 204);
}
.btnSend:disabled{
   background-color: rgb(248, 244, 244);
   
}
</style>