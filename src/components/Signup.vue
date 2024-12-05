<script setup>
import { ref, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";

const usersArray = ref([]);
const checkedState = ref(false);
const router=useRouter();
// Form state
const formRef = ref(null);
const isFormValid = ref(false);

onMounted(() => {
  let retrievedData = localStorage.getItem("user");
  usersArray.value = retrievedData ? JSON.parse(retrievedData) : [];
  console.log(usersArray.value);
});

const user = ref({
  id: "",
  name: "",
  email: "",
  password: "",
});
const localStore = () => {
  localStorage.setItem("user", JSON.stringify(usersArray.value));
};

const handleSignup = () => {
  if (isFormValid.value) {
    if (usersArray.value.length === 0) {
      const getRandomNumber = (min, max) => {
        return Math.random() * (max - min) + min;
      };

      user.value.id = getRandomNumber(0, 10000);
      usersArray.value.push(user.value);
      localStore();
      alert("Registration Successful");
      user.value.name = "";
      user.value.email = "";
      user.value.password = "";
      checkedState.value = false;
    } else {
      let checkEmailExist = usersArray.value.some((i) => {
        return i.email === user.value.email;
      });
      if (checkEmailExist) {
        console.log("Exists", checkEmailExist);
        alert("User Already Exists");
      } else {
        const getRandomNumber = (min, max) => {
          return Math.random() * (max - min) + min;
        };

        user.value.id = getRandomNumber(0, 10000);
        let checkId = usersArray.value.some((i) => {
          return i.id === user.id;
        });
        if (checkId) {
          user.id = getRandomNumber(0, 10000);
        }
        usersArray.value.push(user.value);
        localStore();
        alert("Registration Successful");
        window.location.reload(); // Reloads the current page
        user.value.name = "";
        user.value.email = "";
        user.value.password = "";
        checkedState.value = false;
      }
    }
  }
};
const myPassword = () => {
  checkedState.value = !checkedState.value;
};

// Validation rules
const nameRules = [
  (v) => !!v || "Name is required",
  (v) => (v && v.length >= 3) || "Name must be at least 3 characters long",
];

const emailRules = [
  (v) => !!v || "Email is required",
  (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
];
// Validation rules
const passwordRules = [
  (v) => !!v || "Password is required",
  (v) => v.length >= 8 || "Password must be at least 8 characters long",
  (v) =>
    /[A-Z]/.test(v) || "Password must contain at least one uppercase letter",
  (v) =>
    /[a-z]/.test(v) || "Password must contain at least one lowercase letter",
  (v) => /\d/.test(v) || "Password must contain at least one number",
];

// Form methods
const validateForm = () => {
  if (formRef.value) {
    formRef.value.validate();
    console.log(isFormValid.value);
  }
};
const handleCancel=()=>{
    router.push('/')
}
</script>

<template>
  <v-sheet
    class="position-absolute d-flex align-center bg-primary justify-center w-100 h-100"
    rounded
  >
    <v-card class="mx-auto px-6 py-8" width="450">
      <div class="text-h3 text-center pb-3 pt-3 mb-5 bg-purple">SignUp</div>
      <v-form
        @submit.prevent="handleSignup"
        ref="formRef"
        v-model="isFormValid"
      >
        <v-text-field
          v-model.trim="user.name"
          label="Name"
          :rules="nameRules"
          required
        ></v-text-field>

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
          <v-btn @click="validateForm" class="mx-3" type="submit">Submit</v-btn>
          <v-btn type="reset" class="mx-3">Reset</v-btn>
          <v-btn @click="handleCancel">Cancel</v-btn>
        </v-col>
      </v-form>
    </v-card>
  </v-sheet>
</template>
