<template>
    <div class="write-mail-data">
        <h3>EMAIL-ID (+@gmail.com)  - {{data.email}} </h3>
        <h3>PASSWORD   - {{data.password}} </h3>
        <h3>TO MAIL(+@gmail.com)  - {{data.tomail}} </h3>
        <h3>SUBJECT    - {{data.subject}} </h3>
        <h3>BODY      - {{data.body}} </h3>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    props:["data"]
}
</script>
<style scoped>
.write-mail-data{
    width:fit-content;
    height:fit-content;
    margin:0 auto;

}
</style>