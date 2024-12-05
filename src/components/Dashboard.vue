<script setup>
import { ref, defineProps, onMounted } from "vue";
import { useRouter } from "vue-router";
import ChatSection from "./ChatSection.vue";
import Buttons from "./Buttons.vue";
import { IconUserCircle } from "@tabler/icons-vue";

let msgFromChatSection = ref("");
const router1 = useRouter();
const usersArray = ref([]);
let loggedUser = ref({});
let divStyling = ref(false);
//msg from input box
const msg = ref("");
const chatArrayForLocalStorage = ref([]);
//object which push to chatArrayForLocalStorage
const chatDetailsObject = ref({
  messageId: "",
  clearChat: [],
  messages: [],
});
//current chat index in localstorage
const indexOfChat = ref(null);
//only insert chatMessage details  for display in chat window
const msgsArray = ref([]);

const chatMessage = ref({
  from: "",
  to: "",
  message: "",
  time: "",
});
let newChat = false;
const selectedUser = ref(null);
const localStore = () => {
  localStorage.setItem("chats", JSON.stringify(chatArrayForLocalStorage.value));
};
onMounted(() => {
  //retrieve loggedIn user from local storage
  loggedUser.value = JSON.parse(localStorage.getItem("loggedIn"));
  if (loggedUser.value) {
    chatMessage.value.from = loggedUser.value.id;
  }
  //Retrieve All Users who registered
  let retrievedData = localStorage.getItem("user");
  if (retrievedData) {
    usersArray.value = JSON.parse(retrievedData);

    //Filter array ,only contain receivers,,not contain login user
    const arrayFiltered = usersArray.value.filter((i) => {
      return i.id !== loggedUser.value.id;
    });
    usersArray.value = arrayFiltered;
  }
  clearStyling();
  retrieveChats();
});
const clearStyling = () => {
  msgFromChatSection.value = "";
  divStyling.value = false;
};
const retrieveChats = () => {
  const retrievedChats = localStorage.getItem("chats");
  chatArrayForLocalStorage.value = retrievedChats
    ? JSON.parse(retrievedChats)
    : [];
};

const selectUser = (i) => {
  selectedUser.value = i;
  clearStyling();
  chatMessage.value.to = selectedUser.value.id;
  chatDetailsObject.value.messageId =
    chatMessage.value.from + "-" + chatMessage.value.to;
  chatDetailsObject.value.clearChat = [];
  let msgFrom = chatDetailsObject.value.messageId.split("-");
  msgFrom = msgFrom.reverse();
  msgFrom = msgFrom.join("-");
  const chatFound = chatArrayForLocalStorage.value.find((i) => {
    return (
      i.messageId === chatDetailsObject.value.messageId ||
      i.messageId === msgFrom
    );
  });
  if (chatFound) {
    indexOfChat.value = chatArrayForLocalStorage.value.indexOf(chatFound);
    chatDetailsObject.value.messages = chatFound.messages;
    newChat = false;
    chatDetailsObject.value.clearChat = chatFound.clearChat;
    msgsArray.value = chatDetailsObject.value.messages;
    if (chatFound.clearChat.includes(loggedUser.value.id)) {
      let clearChatUserId = chatFound.clearChat.indexOf(loggedUser.value.id);
      //msgsArray.value = chatData.messages.slice(chatData.clearChat[clearChatIndex]);
      let fromIndexOfChatDisplay = chatFound.clearChat[clearChatUserId + 1];
      msgsArray.value = chatFound.messages.slice(fromIndexOfChatDisplay);
    }
  } else {
    chatDetailsObject.value.messages = [];
    chatDetailsObject.value.clearChat = [];
    newChat = true;
    msgsArray.value = chatDetailsObject.value.messages;
    indexOfChat.value = null;
  }

  msg.value = "";
};

const sendMessage = () => {
  clearStyling();
  if (msg.value) {
    const newMessage = {
      ...chatMessage.value,
      message: msg.value,
      time: new Date().toISOString(),
    };
    chatDetailsObject.value.messages.push(newMessage);

    if (newChat) {
      chatArrayForLocalStorage.value.push({ ...chatDetailsObject.value });
      newChat = false;
      localStore();
      indexOfChat.value = chatArrayForLocalStorage.value.length - 1;
    } else {
      chatArrayForLocalStorage.value[indexOfChat.value].messages = [
        ...chatDetailsObject.value.messages,
      ];
      localStore();
    }

    msg.value = "";
    msgsArray.value = [...chatDetailsObject.value.messages];
    if (
      chatArrayForLocalStorage.value[indexOfChat.value].clearChat.includes(
        loggedUser.value.id
      )
    ) {
      let clearChatUserId = chatArrayForLocalStorage.value[
        indexOfChat.value
      ].clearChat.indexOf(loggedUser.value.id);
      //msgsArray.value = chatData.messages.slice(chatData.clearChat[clearChatIndex]);
      let fromIndexOfChatDisplay =
        chatArrayForLocalStorage.value[indexOfChat.value].clearChat[
        clearChatUserId + 1
        ];
      msgsArray.value = chatArrayForLocalStorage.value[
        indexOfChat.value
      ].messages.slice(fromIndexOfChatDisplay);
      //console.log(chatArrayForLocalStorage.value[indexOfChat.value].messages.slice(fromIndexOfChatDisplay));
    }
  }
};
const clearChat = () => {
  clearStyling();
  console.log("Chat cleared");
  if (msgsArray.value) {
    if (
      chatArrayForLocalStorage.value[indexOfChat.value].clearChat.includes(
        loggedUser.value.id
      )
    ) {
      let clearChatIndexOfId = chatArrayForLocalStorage.value[
        indexOfChat.value
      ].clearChat.indexOf(loggedUser.value.id);
      chatArrayForLocalStorage.value[indexOfChat.value].clearChat[
        clearChatIndexOfId + 1
      ] += msgsArray.value.length;
    } else {
      chatDetailsObject.value.clearChat.push(
        loggedUser.value.id,
        msgsArray.value.length
      );
      chatArrayForLocalStorage.value[indexOfChat.value].clearChat = [
        ...chatDetailsObject.value.clearChat,
      ];
    }

    localStore();
    console.log(chatArrayForLocalStorage.value[indexOfChat.value]);
    msgsArray.value = [];
  }
};
const handleLogout = () => {
  localStorage.removeItem("loggedIn");
  router1.push("/");
};
//Taking Emit message from chatSection component
const divStyle = (i) => {
  divStyling.value = true;
  msgFromChatSection.value = msgsArray.value[i].message;
};
</script>

<template>
 
  <v-container fluid class="bg-surface-variant">
    <v-row style="height: 100vh">

      <v-col cols="3">
        <v-sheet class="d-flex flex-column justify-space-between pa-2 mb-2 ma-2 h-100">
          <div>
            <div class="text-h5 text-left text-green-darken-4 text-h4 pb-3">
              Welcome {{ loggedUser.name }}
            </div>

            <v-list>
              <v-list-item v-for="i in usersArray" :key="i.id" 
              class="bg-deep-purple-lighten-4 text-h6 text-indigo-darken-4"
              @click="selectUser(i)" :class="{
                selected: selectedUser && selectedUser.name === i.name,
              }">
                {{ i.name }}
              </v-list-item>
            </v-list>
          </div>
          <v-btn @click="handleLogout" class="text-red-darken-1 text-h5">Logout</v-btn>
        </v-sheet>
      </v-col>


      <v-col>

        <v-sheet class="pa-2 mb-2 ma-2 h-100 ">

          <div v-if="selectedUser">
            <h3>
              Chat with <span v-if="selectedUser">{{ selectedUser.name }}</span>
              <span @click="clearChat" style="float:right;color:red">Clear Chat</span>
            </h3>
            <div @click.self="clearStyling">
              <div v-show="divStyling">
                <p id="chatMessageSelection">{{ msgFromChatSection }}</p>
              </div>
              <div v-if="msgsArray.length">
                <ChatSection v-for="(i, index) in msgsArray" :key="index" :msgData="i" :index="index"
                  :loggedUser="loggedUser" @styling="divStyle" />
              </div>
            </div>
            <div class="position-fixed bottom-0 mx-auto w-66">
                <v-text-field 
                class="mx-auto w-75"
                v-model="msg" 
                @keyup.enter="sendMessage" 
                :append-inner-icon="mdi-send"
                  label="Type a Message" 
                  type="text" 
                  variant="filled" 
                  clearable
                  @click:append-inner="sendMessage"></v-text-field>
                <!-- <v-btn :disable="msg ? false : true" @click="sendMessage">send</v-btn> -->
            </div>
          </div>
          <div v-else >
            <p>Select a user to start chatting.</p>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
<style>
v-list-item:hover{
 background-color: rgb(18, 218, 158);
}
</style>