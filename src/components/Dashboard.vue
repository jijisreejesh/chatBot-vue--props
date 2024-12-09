<script setup>
import { ref, defineProps, onMounted } from "vue";
import { useRouter } from "vue-router";
import ChatSection from "./ChatSection.vue";
import { fa } from "vuetify/locale";

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
let welcome = "";
</script>

<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        expand-on-hover
        :rail="$vuetify.display.smAndDown"
        permanent
        color="blue-lighten-5"
      >
        <v-list class="text-deep-purple">
          <v-list-item-title class="text-h4 text-center text-uppercase"
            >Welcome</v-list-item-title
          >
          <v-list-item-title class="text-h4 text-center text-uppercase">{{
            loggedUser.name
          }}</v-list-item-title>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            v-for="i in usersArray"
            :key="i.id"
            class="text-indigo-darken-4 border-b-lg text-capitalize text-h6"
            @click="selectUser(i)"
            prepend-icon="mdi-account"
            :class="{
              selected: selectedUser && selectedUser.name === i.name,
            }"
          >
            {{ i.name }}
          </v-list-item>
        </v-list>
        <template v-slot:append>
          <v-dialog max-width="500">
            <template v-slot:activator="{ props: activatorProps }">
              <v-list density="compact" class="bg-primary" nav>
                <v-list-item
                  prepend-icon="mdi-logout"
                  v-bind="activatorProps"
                  class="text-red text-h5 line-height-0"
                >
                  <v-list-item-title
                    class="text-h4 font-weight-medium"
                    style="line-height: 1"
                    >Logout</v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </template>

            <template v-slot:default="{ isActive }">
              <v-card title="ALERT" class="text-red bg-red-lighten-5">
                <v-card-text> Do you want to Logout? </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn text="Yes" @click="handleLogout"> </v-btn>
                  <v-btn text="No" @click="isActive.value = false"></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </template>
      </v-navigation-drawer>

      <v-main style="height: 100vh">
        <v-sheet class="pa-2 mb-2 ma-2 h-100">
          <div
            v-if="selectedUser"
            class="d-flex flex-column justify-space-between h-100"
          >
            <div>
              <div class="d-flex">
                <h3 class="mb-4 mt-4 text-pink-darken-2 text-h5 flex-grow-1">
                  Chat with
                  <span
                    class="text-pink-darken-2 text-h4"
                    v-if="selectedUser"
                    >{{ selectedUser.name.toUpperCase() }}</span
                  >
                </h3>

                <v-dialog max-width="500">
                  <template v-slot:activator="{ props: activatorPropsClear }">
                    <v-list density="compact" nav>
                      <v-list-item>
                        <v-list-item-title
                          v-bind="activatorPropsClear"
                          class="text-orange-darken-4 float-right elevation-4 pa-2 text-h5"
                          style="line-height: 1; margin-bottom: 20px"
                          >ClearChat</v-list-item-title
                        >
                      </v-list-item>
                    </v-list>
                  </template>

                  <template v-slot:default="{ isActive }">
                    <v-card title="ALERT" class="text-red bg-red-lighten-5">
                      <v-card-text> Do you want to Clear? </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn text="Yes" @click="clearChat"> </v-btn>
                        <v-btn
                          text="No"
                          @click="isActive.value = false"
                        ></v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </div>

              <div @click.self="clearStyling">
                <div v-show="divStyling">
                  <p id="chatMessageSelection">{{ msgFromChatSection }}</p>
                </div>
              </div>

              <v-sheet
                v-if="msgsArray.length"
                class="overflow-auto elevation-0"
                style="max-height: 640px"
              >
                <ChatSection
                  v-for="(i, index) in msgsArray"
                  :key="index"
                  :msgData="i"
                  :index="index"
                  :loggedUser="loggedUser"
                  @styling="divStyle"
                />
              </v-sheet>
            </div>

            <div>
              <v-text-field
                class="mx-auto w-100 mt-3 rounded text-h4"
                v-model="msg"
                @keyup.enter="sendMessage"
                append-inner-icon="mdi-send curser-pointer"
                label="Type a Message"
                type="text"
                clearable
                variant="solo"
                @click:append-inner="sendMessage"
              ></v-text-field>
            </div>
          </div>
          <div
            v-else
            style="
              display: flex;
              color: red;
              font-size: x-large;
              justify-content: center;
              height: 75vh;
              align-items: center;
            "
          >
            <p>Select a user to start chatting.</p>
          </div>
        </v-sheet>
      </v-main>
    </v-layout>
  </v-card>

  <!-- </v-container> -->
</template>
