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
MediaPlayer.dependencies.AbrController = function () {
    "use strict";

    var autoSwitchBitrate = true,
        topQualities = {},
        qualityDict = {},
        confidenceDict = {},
        bitrateDict = {},
        streamProcessorDict={},
        abandonmentStateDict = {},
        abandonmentTimeout,

        getInternalQuality = function (type, id, mdId) {
            var quality;
            if(mdId === undefined) {
                qualityDict[id] = qualityDict[id] || {};

                if (!qualityDict[id].hasOwnProperty(type)) {
                    qualityDict[id][type] = 0;
                  //  qualityDict[id][type][0] = 0;
                }
                for(var i in qualityDict[id][type]) {
                    quality = qualityDict[id][type][i];
                    break;
                }
            } else {
                qualityDict[id] = qualityDict[id] || {};

                if (!qualityDict[id].hasOwnProperty(type)) {
                    qualityDict[id][type] = {};
                    qualityDict[id][type][mdId] = 0;
                }
                if (!qualityDict[id][type].hasOwnProperty(mdId)){
                    qualityDict[id][type][mdId] = 0;
                }
                quality = qualityDict[id][type][mdId];
            }
            return quality;
        },

        setInternalQuality = function (type, id, value, mdId) {
            if(mdId === undefined) {
                qualityDict[id] = qualityDict[id] || {};
                for(var i in quality[id][type]) {
                    qualityDict[id][type][i] = value;
                }
            } else {
                qualityDict[id] = qualityDict[id] || {};
                if(!qualityDict[id].hasOwnProperty(type)){
                    qualityDict[id][type]= {};
                }
                qualityDict[id][type][mdId] = value;
            }
        },

        getInternalConfidence = function (type, id, mdId) {
            var confidence;
            if(mdId === undefined) {
                confidenceDict[id] = confidenceDict[id] || {};

                if (!confidenceDict[id].hasOwnProperty(type)) {
                    confidenceDict[id][type] = 0;
                    confidenceDict[id][type][0] = 0;
                }
                for(var i in confidenceDict[id][type]) {
                    confidence = confidenceDict[id][type];
                    break;
                }
            } else {
                confidenceDict[id] = confidenceDict[id] || {};

                if (!confidenceDict[id].hasOwnProperty(type)) {
                    confidenceDict[id][type] = {};
                    confidenceDict[id][type][mdId] = 0;
                }
                if (!confidenceDict[id][type].hasOwnProperty(mdId)) {
                    confidenceDict[id][type][mdId] = 0;
                }

                confidence = confidenceDict[id][type][mdId];
            }
            return confidence;
        },

        setInternalConfidence = function (type, id, value, mdId) {
            if(mdId === undefined) {
                confidenceDict[id] = confidenceDict[id] || {};
                for(var i in confidenceDict[id][type]) {
                    confidenceDict[id][type][i] = value;
                }
            } else {
                confidenceDict[id] = confidenceDict[id] || {};
                if(!confidenceDict[id].hasOwnProperty(type)){
                    confidenceDict[id][type]= {};
                }
                confidenceDict[id][type][mdId] = value;
            }
        },

        setTopQualityIndex = function (type, id, value, mdId) {
            if(mdId === undefined) {
                topQualities[id] = topQualities[id] || {};
                for(var i in topQualities[id][type]) {
                    topQualities[id][type][i] = value;
                }
            } else {
                topQualities[id] = topQualities[id] || {};
                if(!topQualities[id].hasOwnProperty(type)){
                    topQualities[id][type]= {};
                }
                topQualities[id][type][mdId] = value;
            }
        },

        getInitialBitrate = function(type, mdId) {
            if(!mdId) mdId = 0;
            if(!bitrateDict.hasOwnProperty(type))bitrateDict[type]={};
            return bitrateDict[type][mdId];
        },

        setInitialBitrate = function(type, value, mdId) {
            if(!mdId) mdId = 0;

            if(!bitrateDict.hasOwnProperty(type)) bitrateDict[type]={};

            bitrateDict[type][mdId] = value;
        },

        getMaxBitrate = function(type, mdId) {
            if (bitrateDict.hasOwnProperty("max") && bitrateDict.max.hasOwnProperty(type)){
                return bitrateDict.max[type];
            }
            return NaN;
        },

        //TODO  change bitrateDict structure to hold one object for video and audio with initial and max values internal.
        // This means you need to update all the logic around intial bitrate DOMStorage, RebController etc...
        setMaxBitrate = function(type, value, mdId) {
            bitrateDict.max = bitrateDict.max || {};
            bitrateDict.max[type] = value;
        },

        getTopQualityIndex = function(type, id, mdId) { //TODO manage calls
            var idx;
            if(mdId === undefined) {
                topQualities[id] = topQualities[id] || {};

                if (!topQualities[id].hasOwnProperty(type)) {
                    topQualities[id][type] = 0;
                 //   topQualities[id][type][0] = 0;
                }
                for(var i in topQualities[id][type]) {
                    idx = checkMaxBitrate.call(this, topQualities[id][type][i], type);
                    break;
                }
            } else {
                topQualities[id] = topQualities[id] || {};

                if (!topQualities[id].hasOwnProperty(type)) {
                    topQualities[id][type] = {};
                    topQualities[id][type][mdId] = 0;
                }
                if (!topQualities[id][type].hasOwnProperty(mdId)) {
                    topQualities[id][type][mdId] = 0;
                }
                idx = checkMaxBitrate.call(this, topQualities[id][type][mdId], type);
            }
            return idx;
        },

        checkMaxBitrate = function(idx, type, mdId){
            var maxBitrate = getMaxBitrate(type, mdId);
            if (isNaN(maxBitrate)) {
                return idx;
            }
            var maxIdx = this.getQualityForBitrate(streamProcessorDict[type].getMediaInfo(), maxBitrate);
            return Math.min (idx , maxIdx);
        },

        onFragmentLoadProgress = function(evt) {

            if (MediaPlayer.dependencies.ScheduleController.LOADING_REQUEST_THRESHOLD === 0) { //check to see if there are parallel request or just one at a time.

                var self = this,
                    type = evt.data.request.mediaType,
                    mdId = evt.data.request.mdcId,
                    rules = self.abrRulesCollection.getRules(MediaPlayer.rules.ABRRulesCollection.prototype.ABANDON_FRAGMENT_RULES),
                    schduleController = streamProcessorDict[type][mdId].getScheduleController(),
                    fragmentModel = schduleController.getFragmentModel(),
                    callback = function (switchRequest) {

                        function setupTimeout(type){
                            abandonmentTimeout = setTimeout(function () {
                                self.setAbandonmentStateFor(type, MediaPlayer.dependencies.AbrController.ALLOW_LOAD);
                            }, MediaPlayer.dependencies.AbrController.ABANDON_TIMEOUT);
                        }

                        if (switchRequest.confidence === MediaPlayer.rules.SwitchRequest.prototype.STRONG) {

                            var requests = fragmentModel.getRequests({state:MediaPlayer.dependencies.FragmentModel.states.LOADING}),
                                newQuality = switchRequest.value,
                                currentQuality = self.getQualityFor(type, self.streamController.getActiveStreamInfo(), mdId);

                            if (newQuality < currentQuality){

                                fragmentModel.abortRequests();
                                self.setAbandonmentStateFor(type, MediaPlayer.dependencies.AbrController.ABANDON_LOAD);
                                self.setPlaybackQuality(type, self.streamController.getActiveStreamInfo() , newQuality, mdId);
                                schduleController.replaceCanceledRequests(requests);
                                setupTimeout(type);
                            }
                        }
                    };

                self.rulesController.applyRules(rules, streamProcessorDict[type][mdId], callback, evt, function(currentValue, newValue) {
                    return newValue;
                });
            }
        };

    return {
        log: undefined,
        abrRulesCollection: undefined,
        rulesController: undefined,
        notify: undefined,
        subscribe: undefined,
        unsubscribe: undefined,
        streamController:undefined,

        setup: function() {
            this[MediaPlayer.dependencies.FragmentLoader.eventList.ENAME_LOADING_PROGRESS] = onFragmentLoadProgress;
        },

        initialize: function(type, streamProcessor, mdId) {
            streamProcessorDict[type] = streamProcessorDict[type] || {};
            streamProcessorDict[type][mdId] = streamProcessor;
            abandonmentStateDict[type] = abandonmentStateDict[type] || {};
            abandonmentStateDict[type][mdId] = abandonmentStateDict[type][mdId] || {};
            abandonmentStateDict[type][mdId].state = MediaPlayer.dependencies.AbrController.ALLOW_LOAD;
        },

        getAutoSwitchBitrate: function () {
            return autoSwitchBitrate;
        },

        setAutoSwitchBitrate: function (value) {
            autoSwitchBitrate = value;
        },

        getPlaybackQuality: function (streamProcessor) {
            var self = this,
                type = streamProcessor.getType(),
                streamId = streamProcessor.getStreamInfo().id,
                mdId = streamProcessor.id,
                quality,
                oldQuality,
                rules,
                confidence,

                callback = function(res) {
                    var topQualityIdx = getTopQualityIndex.call(self, type, streamId, mdId);

                    quality = res.value;
                    confidence = res.confidence;

                    // be sure the quality valid!
                    if (quality < 0) {
                        quality = 0;
                    }
                    // zero based
                    if (quality > topQualityIdx) {
                        quality = topQualityIdx;
                    }

                    oldQuality = getInternalQuality(type, streamId, mdId);

                    if (quality === oldQuality || (abandonmentStateDict[type].state === MediaPlayer.dependencies.AbrController.ABANDON_LOAD &&  quality > oldQuality)) return;

                    setInternalQuality(type, streamId, quality, mdId);
                    //self.log("New quality of " + quality);
                    setInternalConfidence(type, streamId, confidence, mdId);
                    //self.log("New confidence of " + confidence);

                    self.notify(MediaPlayer.dependencies.AbrController.eventList.ENAME_QUALITY_CHANGED, {mediaType: type, streamInfo: streamProcessor.getStreamInfo(), oldQuality: oldQuality, newQuality: quality, id : mdId});
                };

            quality = getInternalQuality(type, streamId, mdId);
            confidence = getInternalConfidence(type, streamId, mdId);


            //self.log("ABR enabled? (" + autoSwitchBitrate + ")");
            if (!autoSwitchBitrate) return;

            //self.log("Check ABR rules.");
            rules = self.abrRulesCollection.getRules(MediaPlayer.rules.ABRRulesCollection.prototype.QUALITY_SWITCH_RULES);
            self.rulesController.applyRules(rules, streamProcessor, callback.bind(self), quality, function(currentValue, newValue) {
                currentValue = currentValue === MediaPlayer.rules.SwitchRequest.prototype.NO_CHANGE ? 0 : currentValue;
                return Math.max(currentValue, newValue);
            });
        },

        setPlaybackQuality: function (type, streamInfo, newPlaybackQuality, mdId) {

            var id = streamInfo.id,
                quality = getInternalQuality(type, id, mdId),
                isInt = newPlaybackQuality !== null && !isNaN(newPlaybackQuality) && (newPlaybackQuality % 1 === 0);

            if (!isInt) throw "argument is not an integer";

            if (newPlaybackQuality !== quality && newPlaybackQuality >= 0 && newPlaybackQuality <= getTopQualityIndex.call(this, type, id, mdId)) {
                setInternalQuality(type, streamInfo.id, newPlaybackQuality, mdId);
                this.notify(MediaPlayer.dependencies.AbrController.eventList.ENAME_QUALITY_CHANGED, {mediaType: type, streamInfo: streamInfo, oldQuality: quality, newQuality: newPlaybackQuality, id : mdId});
            }
        },

        setAbandonmentStateFor: function (type, state) {
            abandonmentStateDict[type].state = state;
        },

        getAbandonmentStateFor: function (type) {
            return abandonmentStateDict[type].state;
        },

        getQualityFor: function (type, streamInfo, mdId) { //TODO manage calls
            return getInternalQuality(type, streamInfo.id, mdId);
        },

        getConfidenceFor: function(type, streamInfo, mdId) { //TODO manage calls
            return getInternalConfidence(type, streamInfo.id, mdId);
        },

        /**
         * @param type
         * @param {number} value A value of the initial bitrate, kbps
         * @memberof AbrController#
         */
        setInitialBitrateFor: function(type, value, mdId){
            setInitialBitrate(type, value, mdId);
        },

        /**
         * @param type
         * @returns {number} A value of the initial bitrate, kbps
         * @memberof AbrController#
         */
        getInitialBitrateFor: function(type, mdId){
            return getInitialBitrate(type, mdId);
        },


        setMaxAllowedBitrateFor:function(type, value) {
            setMaxBitrate(type, value);
        },
        getMaxAllowedBitrateFor:function(type) {
            return getMaxBitrate(type);
        },

        /**
         * @param mediaInfo
         * @param bitrate A bitrate value, kbps
         * @returns {number} A quality index <= for the given bitrate
         * @memberof AbrController#
         */
        getQualityForBitrate: function(mediaInfo, bitrate) {
            var bitrateList = this.getBitrateList(mediaInfo),
                ln = bitrateList.length,
                bitrateInfo;

            for (var i = 0; i < ln; i +=1) {
                bitrateInfo = bitrateList[i];

                if (bitrate*1000 <= bitrateInfo.bitrate) {
                    return Math.max(i-1, 0);
                }
            }

            return (ln-1);
        },

        /**
         * @param mediaInfo
         * @returns {Array} A list of {@link MediaPlayer.vo.BitrateInfo} objects
         * @memberof AbrController#
         */
        getBitrateList: function(mediaInfo) {
            if (!mediaInfo || !mediaInfo.bitrateList) return null;

            var bitrateList = mediaInfo.bitrateList,
                type = mediaInfo.type,
                infoList = [],
                bitrateInfo;

            for (var i = 0, ln = bitrateList.length; i < ln; i += 1) {
                bitrateInfo = new MediaPlayer.vo.BitrateInfo();
                bitrateInfo.mediaType = type;
                bitrateInfo.qualityIndex = i;
                bitrateInfo.bitrate = bitrateList[i];
                infoList.push(bitrateInfo);
            }

            return infoList;
        },

        updateTopQualityIndex: function(mediaInfo) {
            var type = mediaInfo.type,
                streamId = mediaInfo.streamInfo.id,
                max,
                mdId = mediaInfo.id;

            max = mediaInfo.trackCount - 1;
            setTopQualityIndex(type, streamId, max, mdId);

            return max;
        },

        isPlayingAtTopQuality: function(streamInfo, mdId) {
            var self = this,
                isAtTop,
                streamId = streamInfo.id,
                audioQuality = self.getQualityFor("audio", streamInfo),
                videoQuality = self.getQualityFor("video", streamInfo, mdId);

            isAtTop = (audioQuality === getTopQualityIndex.call(this, "audio", streamId)) &&
                (videoQuality === getTopQualityIndex.call(this, "video", streamId), mdId);

            return isAtTop;
        },

        getTopQualityIndexFor:getTopQualityIndex,

        reset: function() {
            autoSwitchBitrate = true;
            topQualities = {};
            qualityDict = {};
            confidenceDict = {};
            streamProcessorDict = {};
            abandonmentStateDict = {};
            clearTimeout(abandonmentTimeout);
            abandonmentTimeout = null;
        }
    };
};

MediaPlayer.dependencies.AbrController.prototype = {
    constructor: MediaPlayer.dependencies.AbrController
};

MediaPlayer.dependencies.AbrController.eventList = {
    ENAME_QUALITY_CHANGED: "qualityChanged"
};

// Default initial video bitrate, kbps
MediaPlayer.dependencies.AbrController.DEFAULT_VIDEO_BITRATE = 1000;
// Default initial audio bitrate, kbps
MediaPlayer.dependencies.AbrController.DEFAULT_AUDIO_BITRATE = 100;
MediaPlayer.dependencies.AbrController.ABANDON_LOAD = "abandonload";
MediaPlayer.dependencies.AbrController.ALLOW_LOAD = "allowload";
MediaPlayer.dependencies.AbrController.ABANDON_TIMEOUT = 10000;
MediaPlayer.dependencies.AbrController.BANDWIDTH_SAFETY = 0.9;
