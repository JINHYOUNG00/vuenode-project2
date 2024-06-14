<template>
    <div>
        <input v-model="form.userid">
        <input v-model="form.userpw">
        <button type="button" @click="loginHandler">로그인</button>
    </div>
</template>

<script>
import axios from "axios";
export default { 
    data() { 
        return {
            form: {
                userid: '',
                userpw: ''
            }
        }
    },
    created() {
        
    },
    methods: {
        loginHandler(){
            axios.post('/api/login', this.form)
                .then(json => console.log(json.data));                
        }
    }
}
</script>

<style>
</style>