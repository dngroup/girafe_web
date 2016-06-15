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
MediaPlayer.dependencies.FragmentLoader = function () {
    "use strict";

    var RETRY_ATTEMPTS = 3,
        RETRY_INTERVAL = 500,
        xhrs = [],
        newQuality = null,
        newRequest,

        doLoad = function (request, remainingAttempts) {
            var req = new XMLHttpRequest(),
                httpRequestMetrics = null,
                firstProgress = true,
                needFailureReport = true,
                lastTraceTime = null,
                self = this,
                estimatedThroughput,
                tableRange,
                requestlength,
                bestTimeout,
                handleLoaded = function(requestVO, succeeded) {
                    needFailureReport = false;

                    var currentTime = new Date(),
                        bytes = req.response,
                        bytesLoaded = requestVO.bytesLoaded,
                        latency,
                        download,
                        downloadTime,
                        throughput;

                    if (!requestVO.firstByteDate) {
                        requestVO.firstByteDate = requestVO.requestStartDate;
                    }
                    requestVO.requestEndDate = currentTime;

                    latency = (requestVO.firstByteDate.getTime() - requestVO.requestStartDate.getTime());
                    download = (requestVO.requestEndDate.getTime() - requestVO.firstByteDate.getTime());

                    self.log((succeeded ? "loaded " : "failed ") + requestVO.mediaType + ":" + requestVO.type + ":" + requestVO.startTime + " (" + req.status + ", " + latency + "ms, " + download + "ms)");

                    httpRequestMetrics.tresponse = requestVO.requestStartDate;
                    httpRequestMetrics.tfinish = requestVO.requestEndDate;
                    httpRequestMetrics.responsecode = req.status;
                    httpRequestMetrics.responseHeaders = req.getAllResponseHeaders();

                    self.metricsModel.appendHttpTrace(httpRequestMetrics,
                        currentTime,
                        currentTime.getTime() - lastTraceTime.getTime(),
                        [bytes ? bytes.byteLength : 0]);
                    lastTraceTime = currentTime;

                    if(bytes && !isNaN(requestVO.duration)) {
                        downloadTime = (httpRequestMetrics.tfinish.getTime() - httpRequestMetrics.tresponse.getTime()) / 1000;
                        throughput = Math.round((bytes.byteLength * 8 ) / downloadTime);
                        this.mdController.setEstimatedThroughput(this.streamProcessor.id, throughput);
                    }
                    if(!bytes && !isNaN(requestVO.duration) && bytesLoaded) {
                        downloadTime = (httpRequestMetrics.tfinish.getTime() - httpRequestMetrics.tresponse.getTime()) / 1000;
                        throughput = Math.round((bytesLoaded * 8 ) / downloadTime);
                        this.mdController.setEstimatedThroughput(this.streamProcessor.id, throughput);
                    }

                },

                //mlacaud
                retryRequest = function(){
                    self.notify(MediaPlayer.dependencies.FragmentLoader.eventList.ENAME_RETRY_SIDX, {
                        request: request,
                        response: ["errorSidx"]
                    });
                    self.indexHandler.updateRepresentation(request.representation, true);
                };

            //mlacaud
            if(request.action === "retry"){
                if(self.mdController.getState(request.mdcId, request.level) === "errorSidx") {
                    self.mdController.requestMissed(request.mdcId, request, request.level);
                    retryRequest();

                }
                return;
            } else {
                self.mdController.setSyncTime(request.startTime + request.duration);
            }

            estimatedThroughput = this.streamProcessor.getDescriptionController().getEstimatedThroughput();
            if(estimatedThroughput){
                //TODO case ok
               // tableRange = request.range.split('-');
                //requestlength = tableRange[1] - tableRange[0];
                var throughputMpd =this.streamProcessor.getABRController().getBitrateList(this.streamProcessor.getMediaInfo())[0].bitrate;
                bestTimeout = Math.round((request.duration*(throughputMpd/estimatedThroughput))*100)/100;

                if(!isNaN(request.duration)) {
                    if (bestTimeout >= request.duration) {
                        this.streamProcessor.getDescriptionController().setNeedTimeout(true);
                        this.streamProcessor.getDescriptionController().setLastEstimatedTime(bestTimeout);
                        this.mdController.areAllTimeoutNeeded();
                            //this.mdController.setTimeout((bestTimeout + 1) * 1000);

                    } else {
                        this.streamProcessor.getDescriptionController().setNeedTimeout(false);
                        this.mdController.setTimeout(Math.round((request.duration - request.duration*10/100)*100)/100 * 1000);
                    }
                }

            } else {
                //TODO case firstsegment
                this.mdController.setTimeout(Math.round((request.duration - request.duration*10/100)*100)/100 * 1000);
            }
                xhrs.push(req);
                request.requestStartDate = new Date();

                httpRequestMetrics = self.metricsModel.addHttpRequest(request.mediaType,
                                                                      null,
                                                                      request.type,
                                                                      request.url,
                                                                      null,
                                                                      request.range,
                                                                      request.requestStartDate,
                                                                      null,
                                                                      null,
                                                                      null,
                                                                      null,
                                                                      request.duration,
                                                                      null);

                self.metricsModel.appendHttpTrace(httpRequestMetrics,
                                                  request.requestStartDate,
                                                  request.requestStartDate.getTime() - request.requestStartDate.getTime(),
                                                  [0]);
                lastTraceTime = request.requestStartDate;

                req.open("GET", self.requestModifierExt.modifyRequestURL(request.url), true);
                req.responseType = "arraybuffer";
                req = self.requestModifierExt.modifyRequestHeader(req);
                req.timeout = self.mdController.getTimeout();
/*
                req.setRequestHeader("Cache-Control", "no-cache");
                req.setRequestHeader("Pragma", "no-cache");
                req.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
*/
                if (request.range) {
                    req.setRequestHeader("Range", "bytes=" + request.range);
                }

                req.ontimeout = function(){
                    req.onloadend();

                };
                req.onprogress = function (event) {
                    var currentTime = new Date();
                    if (firstProgress) {
                        firstProgress = false;
                        if (!event.lengthComputable || (event.lengthComputable && event.total != event.loaded)) {
                            request.firstByteDate = currentTime;
                            httpRequestMetrics.tresponse = currentTime;
                        }
                    }

                    if (event.lengthComputable) {
                        request.bytesLoaded = event.loaded;
                        request.bytesTotal = event.total;
                    }

                    self.metricsModel.appendHttpTrace(httpRequestMetrics,
                                                      currentTime,
                                                      currentTime.getTime() - lastTraceTime.getTime(),
                                                      [req.response ? req.response.byteLength : 0]);
                    lastTraceTime = currentTime;
                    self.notify(MediaPlayer.dependencies.FragmentLoader.eventList.ENAME_LOADING_PROGRESS, {request: request});
                };

                req.onload = function () {
                    if (req.status < 200 || req.status > 299) return;

                    handleLoaded.call(self, request, true);

                    //mlacaud

                    self.mdController.updateState(request.mdcId, "ok", request.level);

                    self.notify(MediaPlayer.dependencies.FragmentLoader.eventList.ENAME_LOADING_COMPLETED, {request: request, response: req.response});
                };

                req.onloadend = req.onerror = function () {
                    if (xhrs.indexOf(req) === -1) {
                        return;
                    } else {
                        xhrs.splice(xhrs.indexOf(req), 1);
                    }

                    if (!needFailureReport) return;
                    newQuality = self.streamProcessor.getDescriptionController().seeIfLowerLevelIsOk(request.quality + 1);
                    if(newQuality){
                        newRequest = self.streamProcessor.getScheduleController().replaceRequest(request, +newQuality - 1);
                        doLoad.call(self,newRequest, RETRY_ATTEMPTS);
                    }

                    /*if(self.mdController.isEndTemplate(self.id, request)){
                        self.mdController.setCompleted();
                        return;
                    }*/

                    handleLoaded.call(self, request, true);
                    self.mdController.updateState(request.mdcId, "error", request.level);
                    self.mdController.requestMissed(request.mdcId, request, request.level);
                    if(self.mdController.areAllUnreachable(request.index)) return;

                    self.notify(MediaPlayer.dependencies.FragmentLoader.eventList.ENAME_LOADING_COMPLETED, {request: request, response: null});
                    /*handleLoaded(request, false);

                    if (remainingAttempts > 0) {
                        self.log("Failed loading fragment: " + request.mediaType + ":" + request.type + ":" + request.startTime + ", retry in " + RETRY_INTERVAL + "ms" + " attempts: " + remainingAttempts);
                        remainingAttempts--;
                        setTimeout(function() {
                            doLoad.call(self, request, remainingAttempts);
                        }, RETRY_INTERVAL);
                    } else {
                        self.log("Failed loading fragment: " + request.mediaType + ":" + request.type + ":" + request.startTime + " no retry attempts left");
                        self.errHandler.downloadError("content", request.url, req);
                        self.notify(MediaPlayer.dependencies.FragmentLoader.eventList.ENAME_LOADING_COMPLETED, {request: request, bytes: null}, new MediaPlayer.vo.Error(null, "failed loading fragment", null));
                    }*/
                };

                req.send();
        },

        checkForExistence = function(request) {
            var self = this,
                req = new XMLHttpRequest(),
                isSuccessful = false;

            req.open("HEAD", request.url, true);

            req.onload = function () {
                if (req.status < 200 || req.status > 299) return;

                isSuccessful = true;

                self.notify(MediaPlayer.dependencies.FragmentLoader.eventList.ENAME_CHECK_FOR_EXISTENCE_COMPLETED, {request: request, exists: true});
            };

            req.onloadend = req.onerror = function () {
                if (isSuccessful) return;

                self.notify(MediaPlayer.dependencies.FragmentLoader.eventList.ENAME_CHECK_FOR_EXISTENCE_COMPLETED, {request: request, exists: false});
            };

            req.send();
        };

    return {
        metricsModel: undefined,
        errHandler: undefined,
        indexHandler: undefined,
        log: undefined,
        requestModifierExt:undefined,
        notify: undefined,
        subscribe: undefined,
        unsubscribe: undefined,
        mdController: undefined, //mlacaud
        id : undefined,

        initialize: function(streamProcessor){
            this.streamProcessor = streamProcessor;
        },

        load: function (req) {

            if (!req) {
                this.notify(MediaPlayer.dependencies.FragmentLoader.eventList.ENAME_LOADING_COMPLETED, {request: req, bytes: null}, new MediaPlayer.vo.Error(null, "request is null", null));
            } else {
                doLoad.call(this, req, RETRY_ATTEMPTS);
            }
        },

        checkForExistence: function(req) {
            if (!req) {
                this.notify(MediaPlayer.dependencies.FragmentLoader.eventList.ENAME_CHECK_FOR_EXISTENCE_COMPLETED, {request: req, exists: false});
                return;
            }

            checkForExistence.call(this, req);
        },

        abort: function() {
            var i,
                req,
                ln = xhrs.length;

            for (i = 0; i < ln; i +=1) {
                req = xhrs[i];
                xhrs[i] = null;
                req.abort();
                req = null;
            }

            xhrs = [];
        }
    };
};

MediaPlayer.dependencies.FragmentLoader.prototype = {
    constructor: MediaPlayer.dependencies.FragmentLoader
};

MediaPlayer.dependencies.FragmentLoader.eventList = {
    ENAME_LOADING_COMPLETED: "loadingCompleted",
    ENAME_LOADING_PROGRESS: "loadingProgress",
    ENAME_CHECK_FOR_EXISTENCE_COMPLETED: "checkForExistenceCompleted",
    ENAME_RETRY_SIDX: "retrySidx"
};
