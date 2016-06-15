/**
 * Created by mlacaud on 25/07/2015.
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

/* This class saves informations about the states of the servers, and the
* time for the next request. It is also used to synchronize the buffers.
*/

MediaPlayer.dependencies.MdController = function () {
    "use strict";
    var syncTime = 0,
        delay = 3000,
        lastBUE = null,
        sidxWereUnreachable = false,
        timeout = 2000,
        streamProcessors = [],

        getMissedRequests = function(){
            var missedRequests = [];
            for(var i in streamProcessors) {
                missedRequests[i] = streamProcessors[i].getDescriptionController().getRetryRequests();
            }
            return missedRequests;
        };

    return {
        system: undefined,
        notify: undefined,
        subscribe: undefined,
        unsubscribe: undefined,

        setStreamProcessors: function(stream){
            streamProcessors[stream.id] = stream;
        },

        getSyncTime : function() {
            return syncTime;
        },

        setSyncTime : function(value){
            syncTime = value;
        },

        updateState : function(mdId, state, level){ //TODO : modify call in SameTimeRequestRule
            streamProcessors[mdId].getDescriptionController().setBufferState(level, state);
        },

        getState : function(mdId, level){ //TODO : modify call in SameTimeRequestRule
            return  streamProcessors[mdId].getDescriptionController().getBufferState(level);
         },

        getSidxWereUnreachable : function(){
            return sidxWereUnreachable;
         },

        getDelay : function(){
          return delay;
        },

        getTimeout : function(){
          return timeout;
        },

        setTimeout : function(value){
            timeout = value;
        },

        getLastBUE : function(){
          return lastBUE;
        },

        setLastBUE : function(value){
          lastBUE = value;
        },

        requestMissed : function(mdId , request, level){
            streamProcessors[mdId].getDescriptionController().setRetryRequests(level, request);
        },

        deleteMissedRequest : function(mdId, level){
            streamProcessors[mdId].getDescriptionController().deleteRetryRequests(level);
        },

        setEstimatedThroughput: function(mdId, value){
            streamProcessors[mdId].getDescriptionController().setEstimatedThroughput(value);
        },

        setCompleted : function(){
            this.notify(MediaPlayer.dependencies.MdController.eventList.ENAME_ONE_IS_COMPLETED);
        },

        areAllUnreachable : function(index){
            for(var i in streamProcessors) {
                    if (!streamProcessors[i].getDescriptionController().areAllUnreachable()) return false;
            }

            this.notify(MediaPlayer.dependencies.MdController.eventList.ENAME_ALL_UNREACHABLE, {index : index});
            this.notify(MediaPlayer.dependencies.MdController.eventList.ENAME_ALL_RETRY, {missedRequests : getMissedRequests()});
            sidxWereUnreachable = true;
            return true;
        },

        areAllSidxUnreachable : function(){
            for(var i in streamProcessors){
                    if(!streamProcessors[i].getDescriptionController().areAllSidxUnreachable()) return false;
            }
            this.notify(MediaPlayer.dependencies.MdController.eventList.ENAME_ALL_RETRY, {missedRequests : getMissedRequests()});
            return true;
        },

        areAllTimeoutNeeded: function(){
            var timeouts = [];
            for(var i in streamProcessors){
                if(!streamProcessors[i].getDescriptionController().timeoutIsNeeded()) {
                    return false;
                } else {
                    timeouts.push(streamProcessors[i].getDescriptionController().getLastEstimatedTime());
                }
            }

            this.setTimeout(0/*(Math.min.apply(Math, timeouts) + 20) * 1000*/);
            return true;
        },

        notAppending : function(){
            this.notify(MediaPlayer.dependencies.MdController.eventList.ENAME_NOT_APPENDING);
        },

        deleteRetry: function(){
            this.notify(MediaPlayer.dependencies.MdController.eventList.ENAME_DELETE_RETRY);
        },

        isEndTemplate : function(mdId, request){
            var streamProcessor = streamProcessors[mdId],
                duration = streamProcessor.getMediaInfo().duration;
            return (request.startTime + 0.5 > duration);
        },

        reset : function(){
            syncTime = 0;
            lastBUE = null;
            sidxWereUnreachable = false;
            streamProcessors = [];
            timeout = 2000;
        }
    };
};

MediaPlayer.dependencies.MdController.prototype = {

    constructor: MediaPlayer.dependencies.MdController,

};

MediaPlayer.dependencies.MdController.eventList = {
    ENAME_ONE_IS_COMPLETED: "oneIsCompleted",
    ENAME_ALL_UNREACHABLE : "allUnreachable",
    ENAME_ALL_RETRY : "allRetry",
    ENAME_NOT_APPENDING : "notAppending",
    ENAME_DELETE_RETRY : "deleteRetry"
};
