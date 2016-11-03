package com.nh.db.ml.simuservice.dockermgt.service.imp;

import java.util.ArrayList;
import java.util.List;

import com.github.dockerjava.api.model.Frame;
import com.github.dockerjava.core.command.LogContainerResultCallback;

public class LogContainerCallback extends LogContainerResultCallback {
    protected final StringBuffer log = new StringBuffer();

    List<Frame> collectedFrames = new ArrayList<Frame>();

    boolean collectFrames = false;



    @Override
    public void onNext(Frame frame) {
        if(collectFrames) collectedFrames.add(frame);
        log.append(new String(frame.getPayload()));
    }

    @Override
    public String toString() {
        return log.toString();
    }


    public List<Frame> getCollectedFrames() {
        return collectedFrames;
    }
}