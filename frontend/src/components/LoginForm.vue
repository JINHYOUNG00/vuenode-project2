<template>
    <div v-if="account">
        {{ account.userid }}
        <button type="button" @click="logoutHandler">로그아웃</button>
    </div>
    <div v-else>
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
            },
        }
    },
    computed : {
        account(){
            return this.$store.state.user.userid;
        }
    },
    created() {
        axios.get("/api/account")
            .then((result) => {
                // store의 함수 이용
                this.$store.commit('user', result.data); // 쿸
            })
            .catch((err)=> {
                console.log(err);
                console.log("로그인 필요");
            });
    },
    methods: {
        loginHandler(){
            axios.post('/api/login', this.form)
                .then((result) => {
                    alert('로그인 성공')
                    this.$store.commit('user', result.data);
        })                
                 .catch((err) => {
                    console.log(err)
                    alert('로그인실패')
        })
        },
        logoutHandler(){
            axios.post('/api/logout')
                .then(() => {
                    alert('로그아웃');
                    this.$store.commit('user', {});
                })
        }       
    }
}
</script>

<style>
</style>