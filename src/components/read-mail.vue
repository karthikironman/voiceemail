<template>
    <div class="write-mail-data">
        <h3 v-if="!mails.length">EMAIL-ID (+@gmail.com)  - {{data.email}} </h3>
        <h3 v-if="!mails.length">PASSWORD   - {{data.password}} </h3>
        <p clas="mails" v-for="(item,index) in mails" :key="item">({{index}})-{{item}} </p>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    props:["data","mails"]
}
</script>
<style scoped>
.write-mail-data{
    width:fit-content;
    height:fit-content;
    margin:0 auto;

}
.mails{
    color:white;
    font-weight:900;
}
</style>