/* jshint browser: true, esversion: 5, asi: true */
/*globals Vue, uibuilder */
'use strict'

// eslint-disable-next-line no-unused-vars
var app1 = new Vue({
    el: '#app',
    data: {
        url:"",
        screen:"image",
        timer:0,
        startMsg    : 'Vue has started, waiting for messages',
        feVersion   : '',
        counterBtn  : 0,
        inputText   : null,
        inputChkBox : false,
        socketConnectedState : false,
        serverTimeOffset     : '[unknown]',
        imgProps             : { width: 75, height: 75 },

        msgRecvd    : '[Nothing]',
        msgsReceived: 0,
        msgCtrl     : '[Nothing]',
        msgsControl : 0,

        msgSent     : '[Nothing]',
        msgsSent    : 0,
        msgCtrlSent : '[Nothing]',
        msgsCtrlSent: 0,
    }, // --- End of data --- //
    computed: {
        hLastRcvd: function() {
            var msgRecvd = this.msgRecvd
            if (typeof msgRecvd === 'string') return 'Last Message Received = ' + msgRecvd
            else return 'Last Message Received = ' + this.syntaxHighlight(msgRecvd)
        },
        hLastSent: function() {
            var msgSent = this.msgSent
            if (typeof msgSent === 'string') return 'Last Message Sent = ' + msgSent
            else return 'Last Message Sent = ' + this.syntaxHighlight(msgSent)
        },
        hLastCtrlRcvd: function() {
            var msgCtrl = this.msgCtrl
            if (typeof msgCtrl === 'string') return 'Last Control Message Received = ' + msgCtrl
            else return 'Last Control Message Received = ' + this.syntaxHighlight(msgCtrl)
        },
        hLastCtrlSent: function() {
            var msgCtrlSent = this.msgCtrlSent
            if (typeof msgCtrlSent === 'string') return 'Last Control Message Sent = ' + msgCtrlSent
            //else return 'Last Message Sent = ' + this.callMethod('syntaxHighlight', [msgCtrlSent])
            else return 'Last Control Message Sent = ' + this.syntaxHighlight(msgCtrlSent)
        },
    }, // --- End of computed --- //
    methods: {
        increment: function(event) {
            console.log('Button Pressed. Event DatA: ', event)

            // Increment the count by one
            this.counterBtn = this.counterBtn + 1
            var topic = this.msgRecvd.topic || 'uibuilder/vue'
            uibuilder.send( {
                'topic': topic,
                'payload': {
                    'type': 'counterBtn',
                    'btnCount': this.counterBtn,
                    'message': this.inputText,
                    'inputChkBox': this.inputChkBox
                }
            } )

        }, // --- End of increment --- //

        // return formatted HTML version of JSON object
        syntaxHighlight: function(json) {
            json = JSON.stringify(json, undefined, 4)
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                var cls = 'number'
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key'
                    } else {
                        cls = 'string'
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean'
                } else if (/null/.test(match)) {
                    cls = 'null'
                }
                return '<span class="' + cls + '">' + match + '</span>'
            })
            return json
        }, // --- End of syntaxHighlight --- //
    }, // --- End of methods --- //

    // Available hooks: init,mounted,updated,destroyed
    mounted: function(){
        //console.debug('[indexjs:Vue.mounted] app mounted - setting up uibuilder watchers')

        /** **REQUIRED** Start uibuilder comms with Node-RED @since v2.0.0-dev3
         * Pass the namespace and ioPath variables if hosting page is not in the instance root folder
         * The namespace is the "url" you put in uibuilder's configuration in the Editor.
         * e.g. If you get continual `uibuilderfe:ioSetup: SOCKET CONNECT ERROR` error messages.
         * e.g. uibuilder.start('uib', '/nr/uibuilder/vendor/socket.io') // change to use your paths/names
         */
        uibuilder.start()

        var vueApp = this

        // Example of retrieving data from uibuilder
        vueApp.feVersion = uibuilder.get('version')

        /** You can use the following to help trace how messages flow back and forth.
         * You can then amend this processing to suite your requirements.
         */

        //#region ---- Trace Received Messages ---- //
        // If msg changes - msg is updated when a standard msg is received from Node-RED over Socket.IO
        // newVal relates to the attribute being listened to.
        uibuilder.onChange('msg', function(newVal){
            //console.info('[indexjs:uibuilder.onChange] msg received from Node-RED server:', newVal)
            vueApp.msgRecvd = newVal
            if(newVal.topic == "screen"){
                vueApp.screen = newVal.payload;
                console.log("change screen comand",newVal.payload);
                  if(newVal.payload== "video"){
                      //---------------------
                      setTimeout(()=>{
                      //console.log('from video play function')
                      var playerId = 'the-player',
                      video = document.querySelector('#' + playerId + ' video');
                      if (Hls.isSupported()) {
        
                      var hls = new Hls();
                       //console.log('from video play function - 1',hls)
                     // hls.loadSource('http://localhost/raushan/4.m3u8');
                      hls.loadSource(newVal.url);
                      hls.attachMedia(video);
                      hls.on(Hls.Events.MANIFEST_PARSED, function () {
                      video.play();
                     });
                 }
            plyr.setup('#' + playerId);
                      },500)
                    //------------------------
                    setTimeout(()=>{$("#digi-click").click();console.log("video clicking")},3000);
            }
                   if(newVal.payload == "video" || newVal.payload == "image"){
                       vueApp.url = newVal.url;
                       console.log("the url i got is rascal",newVal.url)
                   }
            }
            if(newVal.topic == "cletimer"){
                vueApp.timer = 0;
            }
             if(newVal.topic == "inctimer"){
                vueApp.timer++;
            }
        })
        // As we receive new messages, we get an updated count as well
        uibuilder.onChange('msgsReceived', function(newVal){
            //console.info('[indexjs:uibuilder.onChange] Updated count of received msgs:', newVal)
            vueApp.msgsReceived = newVal
        })

        // If we receive a control message from Node-RED, we can get the new data here - we pass it to a Vue variable
        uibuilder.onChange('ctrlMsg', function(newVal){
            //console.info('[indexjs:uibuilder.onChange:ctrlMsg] CONTROL msg received from Node-RED server:', newVal)
            vueApp.msgCtrl = newVal
        })
        // Updated count of control messages received
        uibuilder.onChange('msgsCtrl', function(newVal){
            //console.info('[indexjs:uibuilder.onChange:msgsCtrl] Updated count of received CONTROL msgs:', newVal)
            vueApp.msgsControl = newVal
        })
        //#endregion ---- End of Trace Received Messages ---- //

        //#region ---- Trace Sent Messages ---- //
        // You probably only need these to help you understand the order of processing //
        // If a message is sent back to Node-RED, we can grab a copy here if we want to
        uibuilder.onChange('sentMsg', function(newVal){
            //console.info('[indexjs:uibuilder.onChange:sentMsg] msg sent to Node-RED server:', newVal)
            vueApp.msgSent = newVal
        })
        // Updated count of sent messages
        uibuilder.onChange('msgsSent', function(newVal){
            //console.info('[indexjs:uibuilder.onChange:msgsSent] Updated count of msgs sent:', newVal)
            vueApp.msgsSent = newVal
        })

        // If we send a control message to Node-RED, we can get a copy of it here
        uibuilder.onChange('sentCtrlMsg', function(newVal){
            //console.info('[indexjs:uibuilder.onChange:sentCtrlMsg] Control message sent to Node-RED server:', newVal)
            vueApp.msgCtrlSent = newVal
        })
        // And we can get an updated count
        uibuilder.onChange('msgsSentCtrl', function(newVal){
            //console.info('[indexjs:uibuilder.onChange:msgsSentCtrl] Updated count of CONTROL msgs sent:', newVal)
            vueApp.msgsCtrlSent = newVal
        })
        //#endregion ---- End of Trace Sent Messages ---- //

        // If Socket.IO connects/disconnects, we get true/false here
        uibuilder.onChange('ioConnected', function(newVal){
            //console.info('[indexjs:uibuilder.onChange:ioConnected] Socket.IO Connection Status Changed to:', newVal)
            vueApp.socketConnectedState = newVal
        })
        // If Server Time Offset changes
        uibuilder.onChange('serverTimeOffset', function(newVal){
            //console.info('[indexjs:uibuilder.onChange:serverTimeOffset] Offset of time between the browser and the server has changed to:', newVal)
            vueApp.serverTimeOffset = newVal
        })
        

    } // --- End of mounted hook --- //

}) // --- End of app1 --- //

// EOF