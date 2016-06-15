/*Created by mlacaud*/
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
Dash.dependencies.DescriptionController = function () {
    "use strict";
    var bufferState = [],
        retryRequests = [],
        estimatedThroughput = null,
        needTimeout = false,
        lastEstimatedTime = null;

    return {
        system: undefined,
        log: undefined,
        streamController: undefined,
        mdController: undefined,
        notify: undefined,
        subscribe: undefined,
        unsubscribe: undefined,

        setup: function() {
        },

        initialize: function(streamProcessor) {
            this.streamProcessor = streamProcessor;
        },

        getEstimatedThroughput: function(){
            return estimatedThroughput;
        },

        setEstimatedThroughput: function(value){
          estimatedThroughput = value;
        },

        timeoutIsNeeded: function(){
          return needTimeout;
        },

        setNeedTimeout: function(value){
            needTimeout = value;
        },

        getLastEstimatedTime : function(){
            return lastEstimatedTime;
        },

        setLastEstimatedTime: function(value){
            lastEstimatedTime = value;
        },

        getBufferState: function(level){
            if(level === undefined) return bufferState[1];
            return bufferState[level];
        },

        setBufferState: function(level, state) {
            if(level === undefined) {
                for(var i in bufferState){
                    bufferState[i] = state;
                }
            } else bufferState[level] = state;
        },

        setRetryRequests: function(level,request){
            retryRequests[level] = request;
        },

        deleteRetryRequests: function(id){
            delete retryRequests[id];
        },

        getRetryRequests: function(){
            return retryRequests;
        },

        getRetrySidx: function(){
            var retrySidx = [];
            for(var i in retryRequests) {
                if(retryRequests[i].action === "retry") retrySidx.push(retryRequests[i]);
            }
            return retrySidx;
        },

        getOkQualities: function(){
            //TODO
        },

        areAllSidxUnreachable: function(){
            for(var i in bufferState){
                if(bufferState[i] !== "errorSidx") return false;
            }
            return true;
        },

        areAllUnreachable: function(){
            for(var i in bufferState){
                if(bufferState[i] !== "errorSidx" && bufferState[i] !== "error") return false;
            }
            return true;
        },

        initializeTableIfNotDoneYet: function(availableRepresentations){
            for(var i in availableRepresentations){
                if(!bufferState.hasOwnProperty(availableRepresentations[i].descriptionDesLvl)) bufferState[availableRepresentations[i].descriptionDesLvl] = "ok";
            }
        },

        seeIfLowerLevelIsOk: function(level){
            var lowerOk = null;
            for(var i in bufferState){
                if(i < level && bufferState[i] === "ok"){
                    lowerOk = i;
                }
            }
            return lowerOk;
        },

        reset: function(){
            bufferState = [];
            retryRequests = [];
            estimatedThroughput = null;
            needTimeout = false;
            lastEstimatedTime = null;
        }

    };
};

Dash.dependencies.DescriptionController.prototype = {
    constructor: Dash.dependencies.DescriptionController
};

Dash.dependencies.DescriptionController.eventList = {

};
