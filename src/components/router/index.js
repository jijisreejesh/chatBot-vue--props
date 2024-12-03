import { createWebHistory,createRouter } from "vue-router";
import Home from "../Home.vue";
import Login from "../Login.vue";
import Signup from "../Signup.vue";
import Dashboard from "../Dashboard.vue";

const routes=[
   {
    path: "/",
    name: "home",
    component: Home,
    meta: { requiresAuth: true } 
   },
   {
    path:'/login',
    name:"login",
    component:Login,
    meta:{requiresAuth:true} 
   },
   {
    path:'/signup',
    name:'signup',
    component:Signup,
    meta:{requiresAuth:true} 
   },
   {
    path:'/dashboard',
    name:'dashboard',
    component:Dashboard,
    meta:{requiresAuth:true} 
   }
]

const router=createRouter({history:createWebHistory(),routes});

const routingNames=["login","signup","home"]

router.beforeEach((to,from,next)=>{
  const isAuthenticated = JSON.parse(localStorage.getItem("loggedIn"));
   
   if((isAuthenticated===null) && to.name === "dashboard"){
      next({name:'login'})
}
   else if(isAuthenticated && (routingNames.includes(to.name))){
    
       next({name:'dashboard'});
   }
   else{
      next(); //If no conditions match, allows navigation to the requested route.
   }
})


export default router;