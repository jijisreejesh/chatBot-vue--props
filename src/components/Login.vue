<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
const usersArray = ref([]);
const router = useRouter();
const checkedState = ref(false);
const user = ref({
  id: "",
  email: "",
  password: "",
});
const formRef = ref(null);
const isFormValid = ref(false);

onMounted(() => {
  let retrievedData = localStorage.getItem("user");
  usersArray.value = retrievedData ? JSON.parse(retrievedData) : [];
  console.log(usersArray.value);
});
const handleCancel = () => {
  router.push("/");
};

const handleLogin = () => {
  if (formRef.value!==null) {
    formRef.value.validate();
    console.log(isFormValid.value);
    if (usersArray.value.length) {
      let userDetails = usersArray.value.find((i) => {
        return i.email === user.value.email;
      });
      if (!userDetails) {
        alert("UserName or password mismatch");
      } else {
        user.value.id = userDetails.id;
        let checkUserFound = usersArray.value.find((i) => {
          return i.id === user.value.id;
        });
        //console.log(checkUseFound);
        if (
          checkUserFound.email === user.value.email &&
          checkUserFound.password === user.value.password
        ) {
          localStorage.setItem("loggedIn", JSON.stringify(checkUserFound));
          router.push(`/dashboard`);
        } else {
          alert("UserName or password mismatch");
        }
      }
    } else {
      alert("No User exists");
    }
   // router.go(); // Reloads the current route
  }
};
const myPassword = () => {
  checkedState.value = !checkedState.value;
};

const emailRules = [
  (v) => !!v || "Email is required",
  (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
];
// Validation rules
const passwordRules = [(v) => !!v || "Password is required"];
</script>

<template>
  <v-sheet
    class="position-absolute d-flex align-center bg-primary justify-center w-100 h-100"
    rounded
  >
    <v-card class="mx-auto px-6 py-8" width="450">
      <div class="text-h3 text-center pb-3 pt-3 mb-5 bg-purple">Login</div>
      <v-form @submit.prevent="handleLogin" ref="formRef" v-model="isFormValid">
        <v-text-field
          v-model.trim="user.email"
          label="E-mail"
          :rules="emailRules"
          required
        ></v-text-field>

        <v-text-field
          v-model.trim="user.password"
          :rules="passwordRules"
          :append-inner-icon="checkedState ? 'mdi mdi-eye' : 'mdi mdi-eye-off'"
          :type="checkedState ? 'text' : 'password'"
          label="Enter your password"
          type="password"
          required
          @click="myPassword"
        ></v-text-field>

        <v-col class="text-center">
          <v-btn class="mx-3" type="submit">Login</v-btn>
          <v-btn type="reset" class="mx-3">Reset</v-btn>
          <v-btn @click="handleCancel">Cancel</v-btn>
        </v-col>
      </v-form>
    </v-card>
  </v-sheet>
</template>
