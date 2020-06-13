<template>
  <div class="virtual-body" @click="toggle()">
    <div class="recording-status" :class="{backred:status}">{{recordingStatus}}</div>
    <vue-particles class="particles" color="#dedede"></vue-particles>
    <h1
      class="headings"
      style="margin-top:4rem;"
    >VOICE BASED EMAIL SYSTEM FOR VISUALLY IMPAIRED PEOPLE</h1>
    <h2 class="headings">The software is triggered by a mouse click</h2>
    <h3 class="headings result" v-if="result.length">{{result}}</h3>
    <div>
      <img class="click-me" v-if=" !result.length" src="@/assets/click.png" />
      <teamPic v-if="showTeam" />
      <write-mail v-if="writeMail" :data="sendmail" />
      <readMail v-if="readMail" :data="readmail" :mails="mails" />
    </div>
  </div>
</template>
<script>
var recognition;
import teamPic from "@/components/members.vue";
import writeMail from "@/components/write-mail.vue";
import readMail from "@/components/read-mail.vue";
import axios from "axios";
export default {
  components: {
    teamPic,
    writeMail,
    readMail
  },
  data() {
    return {
      mails: [],
      mailsend: 0,
      mailsendmsg: [
        "What is your email id",
        "what is your password",
        "what is to mail address",
        "what is subject",
        "what is body"
      ],
      sendmail: {
        email: "spell and skip @gmail.com",
        password: "spell",
        tomail: "spell and skip @gmail.com",
        subject: "",
        body: ""
      },
      mailread: 0,
      mailreadmsg: ["What is your email id", "what is your password"],
      readmail: {
        email: "spell and skip @gmail.com",
        password: "spell"
      },
      status: false,
      result: "",
      recordingStatus: "NOT RECORDING",
      showTeam: false,
      writeMail: false,
      readMail: false
    };
  },
  created() {
    // var msg = new SpeechSynthesisUtterance("welcome to voice based system");
    // window.speechSynthesis.speak(msg);
  },
  mounted() {
    this.sendmail.email = "spell and skip @gmail.com";
    this.sendmail.password = "spell";
    this.sendmail.tomail = "spell and skip @gmail.com";
    this.sendmail.subject = "";
    this.sendmail.body = "";

    //  this.speak("Click on the screen anywhere and start the conversation")
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    // this.speak("Welcome to voice based email system ")
    recognition.onresult = event => {
      //console.log(event,"rascal")
      this.write(event.results[0][0].transcript);
      this.magic(this.result);
      this.stop();
    };
  },
  methods: {
    sendMail() {},
    start() {
      this.recordingStatus = "recording";
      this.status = true;
      this.result = "";
      this.speak("Im listening");
      setTimeout(() => recognition.start(), 1000);
    },
    stop() {
      recognition.stop();
      this.recordingStatus = "not recording";
      this.status = false;
    },
    write(data) {
      if (!this.mailsend && !this.mailread) this.result = data;
      else if (this.mailsend) {
        switch (this.mailsend) {
          case 1:
            this.sendmail.email =
              data.toLowerCase().replace(/\s/g, "") + "@gmail.com";
            break;
          case 2:
            this.sendmail.password = data.replace(/\s/g, "");
            break;
          case 3:
            this.sendmail.tomail =
              data.toLowerCase().replace(/\s/g, "") + "@gmail.com";
            break;
          case 4:
            this.sendmail.subject = data;
            break;
          case 5:
            this.sendmail.body = data;
            break;
        }
        if (this.mailsend == 5) {
          console.log("received mail information", this.sendmail);
          this.mailsend = 0;
          this.speak("im sending mail");
          let sendemail = this.sendmail.email.toLowerCase().replace(/\s/g, "");
          let sendpassword = this.sendmail.password
            .toLowerCase()
            .replace(/\s/g, "");
          ////////////////////////////////////////////////
          axios
            .post(
              `http://localhost:1880/sendmail?emailid=${sendemail}*${sendpassword}`,
              this.sendmail
            )
            .then(data => {
              if (data.data == "wrong") {
                this.speak("your email or password is wrong please retry!");
                 setTimeout(() => {
                   location.reload();
                  }, 8000);
              } else {
                this.speak("message successfully sent");
                setTimeout(() => {
                   location.reload();
                  }, 8000);
              }
            })
            .catch(function() {
              this.speak("some problem , please retry");
            })
            .finally(function() {
              this.writeMail = false;
            });
          ///////////////////////////////////////////
        } else this.mailsend++;
      }
      //************************
      else if (this.mailread) {
        switch (this.mailread) {
          case 1:
            this.readmail.email =
              data.toLowerCase().replace(/\s/g, "") + "@gmail.com";
            break;
          case 2:
            this.readmail.password = data.replace(/\s/g, "");
            break;
        }
        if (this.mailread == 2) {
          console.log("received mail information", this.readmail);
          this.mailread = 0;
          this.speak("im receiving mail");
          ////////////////////////////////////////////////
          let reademail = this.readmail.email.toLowerCase().replace(/\s/g, "");
          let readpassword = this.readmail.password
            .toLowerCase()
            .replace(/\s/g, "");
          axios
            .get(
              `http://localhost:1880/inbox?emailid=${reademail}*${readpassword}`,
              this.readmail
            )
            .then(data => {
              console.log("mails received", data.data);
              if (!data.data.length) {
                this.speak("no mails in inbox");
                setTimeout(() => {
                   location.reload();
                  }, 8000);
          
              } else {
                if (data.data == "wrong") {
                  this.speak("your email or password is wrong please retry!");
                   setTimeout(() => {
                   location.reload();
                  }, 8000);
                } else {
                  this.speak("there are some mails");
                  for (var a = 0; a < data.data.length; a++) {
                    this.mails.push(data.data[a]);
                  }
                  for (a = 0; a < data.data.length; a++) {
                    this.speak(data.data[a]);
                  }
                  setTimeout(() => {
                    this.readMail = false;
                    this.mails = [];
                  }, 8000);
                }
              }
            })
            .catch(() => {
              this.speak("some problem , please retry");
              setTimeout(() => {
                   location.reload();
                  }, 8000);
            })
            .finally(() => {});
          ///////////////////////////////////////////
        } else this.mailread++;
      }
      //********************** */
      this.speak(`you told ${data}`);
    },
    speak(data) {
      var msg = new SpeechSynthesisUtterance(data);
      window.speechSynthesis.speak(msg);
    },
    magic(data) {
      if (this.mailsend == 0 && this.mailread == 0) {
        if (data == "show team members") {
          this.showTeam = true;
          this.speak(
            " Project is done by Alisha Minhaj, Bhoomika J V, Pallavi Bibhuti, Rachana A Ndf"
          );
          setTimeout(() => {
            this.showTeam = false;
            this.result = "";
          }, 10000);
        } else if (data == "send mail") {
          this.writeMail = true;
          this.mailsend = 1;
          this.speak("what is your email address");
        } else if (data == "read mail") {
          this.readMail = true;
          this.mailread = 1;
          this.speak("what is your email address");
        }
      } else if (this.mailsend) {
        this.speak(this.mailsendmsg[this.mailsend - 1]);
      } else if (this.mailread) {
        this.speak(this.mailreadmsg[this.mailread - 1]);
      }
    },
    toggle() {
      if (this.status) {
        this.status = false;
        this.stop();
      } else {
        this.status = true;
        this.start();
      }
    }
  }
};
</script>
<style scoped>
.click-me {
  width: 10rem;
  margin-top: 10rem;
}
.backred {
  background: red;
}
.result {
  font-family: "Comfortaa", cursive;
  font-size: 60px;
  border: 2px dotted white;
  padding: 1rem;
}
.headings {
  color: white;
  font-family: "Comfortaa", cursive;
}
.recording-status {
  padding: 1rem;
  color: white;
  position: absolute;
  top: 0;
  right: 0;
  text-transform: UPPERCASE;
  font-weight: 900;
  transition: 1s all ease-out;
  border: 1px solid white;
  margin-top: 7rem;
  margin-right: 2rem;
}
.virtual-body {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: black;
  cursor: pointer;
}
.particles {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}
</style>