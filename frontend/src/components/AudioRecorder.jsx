import React, { useRef, useState } from 'react';
import { Mic, MicOff } from './Icons';

export default function AudioRecorder({ onRecordingComplete, onRecordingStatusChange }) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        onRecordingComplete(audioBlob);
      };

      mediaRecorder.start();
      setRecording(true);
      if (onRecordingStatusChange) onRecordingStatusChange(true);
    } catch (err) {
      console.error("Could not start recording", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (onRecordingStatusChange) onRecordingStatusChange(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <button
      className={`vaani-record-btn ${recording ? 'recording' : ''}`}
      onClick={recording ? stopRecording : startRecording}
      aria-label={recording ? 'Stop recording' : 'Start recording'}
    >
      {recording ? <MicOff size={36} /> : <Mic size={36} />}
      
      {recording && (
        <>
          <div className="ripple-effect ripple-1"></div>
          <div className="ripple-effect ripple-2"></div>
        </>
      )}
    </button>
  );
}
