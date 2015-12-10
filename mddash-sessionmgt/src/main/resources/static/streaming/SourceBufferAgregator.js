/**
 * Created by mlacaud on 07/07/15.
 */
/**
 * The copyright in this software is being made available under the BSD License,
 * included below. This software may be subject to other third party and contributor
 * rights, including patent rights, and no such rights are granted under this license.
 *
 * Copyright (c) 2013, Dash Industry Forum.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *  * Redistributions of source code must retain the above copyright notice, this
 *  list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright notice,
 *  this list of conditions and the following disclaimer in the documentation and/or
 *  other materials provided with the distribution.
 *  * Neither the name of Dash Industry Forum nor the names of its
 *  contributors may be used to endorse or promote products derived from this software
 *  without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS AS IS AND ANY
 *  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 *  IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 *  INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 *  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 *  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 *  WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 *  POSSIBILITY OF SUCH DAMAGE.
 */

MediaPlayer.dependencies.SourceBufferAgregator = function () {
    "use strict";
    var buffer_created,
        ourChunk = null,
        ourBuffer = null,
        descriptionNbr = 1,
        useDescriptionAggregator = true,
        sourceExt = undefined,
        descriptionDesNumPerLvl = null,
        isFirstLink = true,
        lastIndexSent = null,
        bufferSaved = [],
        errorIndex = null,

        areBuffersReady = function(){
            //TODO : manage cases
            var table;
            for(var i in bufferSaved){
                table = bufferSaved[i].filter(filterBufferByLastIndexAndRetry);
                if (table.length < 1) return false;
            }
            return true;
        },

        filterBufferByLastIndexAndRetry = function(element){
            return ((lastIndexSent === null && element.index === 0) ||
            (lastIndexSent !== null && !isNaN(lastIndexSent) && element.index === lastIndexSent + 1) ||
            (element.index === -1));
        },

        eraseChunkSent = function(id, chunk){
            var idx = bufferSaved[id].indexOf(chunk);

            if(idx >= 0) bufferSaved[id].splice(idx,1);
        },

        eraseChunkByIndex = function(id, index){
            for(var i in bufferSaved[id]){
                if(bufferSaved[id][i].index === index) bufferSaved[id].splice(i,1);
            }
        },

        oldEraseChunkSent = function(){
            for (var i in bufferSaved){
                bufferSaved[i].splice(0,1);
            }
        },

        initializeBuffers = function(){
          for(var i = 1; i <= descriptionDesNumPerLvl; i++) {
              bufferSaved[i] = new Array();
          }
        },

        sendAllGoodBuffers = function(){
            var chunk,
                table,
                indexSent,
                obj,
                numberFalse = 0,
                test = true;
            for(var i in bufferSaved) {
                table = bufferSaved[i].filter(filterBufferByLastIndexAndRetry);
                obj = {};
                table = table.filter(function(elem,index,array){
                    return obj[elem.id]?0:obj[elem.id]=1;
                });
                chunk = table[0];
                if (typeof chunk.bytes[0] !== "string") {

                } else {
                    numberFalse += 1;
                }
            }

            if(numberFalse === descriptionDesNumPerLvl - 1) test=false;
            for(var i in bufferSaved) {
                table = bufferSaved[i].filter(filterBufferByLastIndexAndRetry);
                obj = {};
                table = table.filter(function(elem,index,array){
                    return obj[elem.id]?0:obj[elem.id]=1;
                });
                chunk = table[0]; // TODO : manage case UC1 with a description coming back.
                if (typeof chunk.bytes[0] !== "string") {
                    if(test) {
                        send2DescriptionAgr(+i, chunk);
                        indexSent = chunk.index; // When we have the answer ?
                        eraseChunkSent(i, chunk); // same
                    } else {
                        indexSent = chunk.index;
                        this.sourceBufferExt.append(ourBuffer, chunk);
                        eraseChunkSent(i, chunk);
                    }
                } else {
                    eraseChunkSent(i, chunk);
                }
            }
            if(test) mergeIfOk();
            lastIndexSent = indexSent;
        },

        send2DescriptionAgr = function (MDId, chunk){
            var buf =  new ArrayBuffer(chunk.bytes.length),
                self = this;
            buf= chunk.bytes.buffer;

            var dictionary = {
                command: "appendBuffer",
                buffer: buf,
                bufferId: MDId,
                bufferSize: chunk.bytes.length
            };
            console.log("size : " + dictionary.bufferSize + "| ID : " + dictionary.bufferId);
            var DescriptionAggregatorModule = document.getElementById('description_aggregator');
            DescriptionAggregatorModule.postMessage(dictionary);
        },

        sendDescriptionsInfo = function(MDId, descriptionInfoForDA){
            var dictionary = {
                command: "initDAContext",
                bufferId: MDId,
                changeFrameRate: descriptionInfoForDA.descriptionFrameRate,
                mdType : descriptionInfoForDA.descriptionMDType
            };
            console.log("Send description info");
            var DescriptionAggregatorModule = document.getElementById('description_aggregator');
            DescriptionAggregatorModule.postMessage(dictionary);
        },

        mergeIfOk = function (){
            var self = this;
                var merge_dictionary = {
                    command: "mergeBuffers",
                };
                var DescriptionAggregatorModule = document.getElementById('description_aggregator');
                DescriptionAggregatorModule.postMessage(merge_dictionary);
        },

        cleanDABuffers = function() {
            var cleanCall = {
                command: "mergeBuffers",
            };
            var DescriptionAggregatorModule = document.getElementById('description_aggregator');
            DescriptionAggregatorModule.postMessage(cleanCall);
        },
        Uint8ToString= function(u8a){
        var CHUNK_SZ = 0x8000;
        var c = [];
        for (var i=0; i < u8a.length; i+=CHUNK_SZ) {
            c.push(String.fromCharCode.apply(null, u8a.subarray(i, i+CHUNK_SZ)));
        }
        return c.join("");
    },

        NaClresponse = function(result){
            var message = result;
            var self = this;
            var keys = Object.keys(result.data);
            if (keys[0] === "mergedBuffer") {
                console.log("GOT THE CALLBACK FROM NACL MERGE");
                var size = message.data["size"];
                var newData = message.data["mergedBuffer"];
                var uInt8Bytes = new Uint8Array (newData);
                ourChunk.bytes = undefined;
                ourChunk.bytes = uInt8Bytes;


                // Appending to the SBE
                sourceExt.append(ourBuffer, ourChunk);

                // Logs
                console.log("Merge done, buffer passed to SBE");
                //console.log("Content size is " + uInt8Bytes.length + " long ");

                // Cleaning buffers in DA
                var cleanCall = {
                    command: "cleanBuffers",
                };
                var DescriptionAggregatorModule = document.getElementById('description_aggregator');
                DescriptionAggregatorModule.postMessage(cleanCall);
                console.log("CleanBuffers call sent");


            } else {
                console.log("MESSAGE HANDLER : " + message.data);
            }

        };

    return {
        system: undefined,
        notify: undefined,
        sourceBufferExt: undefined,
        mdController: undefined,
        Mylistener: document.getElementById('listener').addEventListener('message', NaClresponse, true),

        link2SourceBuffer: function (mediaSource, mediaInfo, mdcId, descriptionInfoForDA) {
            "use strict";
            var self = this,
                codec = mediaInfo.codec,
                buffer = null;
                sourceExt = this.sourceBufferExt;

            if (isFirstLink) {
                isFirstLink = false;
                descriptionDesNumPerLvl = descriptionInfoForDA.descriptionDesNumPerLvl;
                initializeBuffers();
                try {
                    buffer = mediaSource.addSourceBuffer(codec);
                    this.buffer_created = buffer;
                } catch (ex) {
                    if ((mediaInfo.isText) || (codec.indexOf('codecs="stpp"') != -1)) {
                        buffer = self.system.getObject("textSourceBuffer");
                    } else {
                        throw ex;
                    }
                }
                return buffer;
            } else {
                return this.buffer_created;
            }
        },

        append: function (buffer, chunk, MDId, descriptionInfoForDA) {
            var self = this;

            if(chunk.segmentType === "Initialization Segment" && typeof chunk.bytes[0] !== "string") {
                this.mdController.notAppending();
                sendDescriptionsInfo(MDId, descriptionInfoForDA);
                this.sourceBufferExt.append(buffer, chunk);
                return;
            }
            if(chunk.segmentType === "Initialization Segment" && typeof chunk.bytes[0] === "string") {
                this.mdController.notAppending();
                sendDescriptionsInfo(MDId, descriptionInfoForDA);
                this.sourceBufferExt.append(buffer, chunk); //TODO find another way to declare the append of the init with an error
                return;
            }
           this.mdController.notAppending();

            bufferSaved[MDId].push(chunk);
            if(areBuffersReady()){
                if (!useDescriptionAggregator) {
                    if (typeof bufferSaved[descriptionNbr][0].bytes[0] !== "string") {
                        self.sourceBufferExt.append(buffer, bufferSaved[descriptionNbr][0]);

                        lastIndexSent = bufferSaved[descriptionNbr][0].index;
                    }
                    oldEraseChunkSent();
                    return;
                }

                ourChunk = undefined;
                ourBuffer = undefined;
                ourChunk = chunk;
                ourBuffer = buffer;
                sendAllGoodBuffers.call(this);
                console.log("SENDING TO MERGE");
                //mergeIfOk();
            }
        },

        /*handleMessage: function(message_event) {
            console.log(message_event.data);
        },*/

        unreachableIndex: function(index){
            for(var i in bufferSaved){
                eraseChunkByIndex(i, index);
            }
            this.mdController.notAppending();
        },

        reset : function(){
            buffer_created = null;
            ourChunk = null;
            ourBuffer = null;
            sourceExt = undefined;
            descriptionDesNumPerLvl = null;
            isFirstLink = true;
            lastIndexSent = null;
            bufferSaved = [];
            errorIndex = null;
        }

    };
};

MediaPlayer.dependencies.SourceBufferAgregator.prototype = {

    constructor: MediaPlayer.dependencies.SourceBufferAgregator,

};

MediaPlayer.dependencies.SourceBufferAgregator.eventList = {

};
