<template>
  <div>
    <button @click="doSomething()"></button>
    {{socketMsg}}
  </div>
</template>
<script>
var socketr = null;
const ioreceive = (window.io = require("socket.io-client"));
export default {
  data() {
    return {
      socketMsg: 1
    };
  },
  mounted() {
      socketr.on("nodered", data => {
        console.log("some msg", data);
      });
  },
  created: function() {
    socketr = ioreceive("ws://localhost:1880");
    console.log(socketr, "socketr pa");
  },
  methods: {
    doSomething() {
      socketr.emit("rascal", 12345);
    }
  }
};
</script>