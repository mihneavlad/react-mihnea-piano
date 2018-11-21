import React from "react";

const Recorder = () => {
  const recordAudio = () =>
    new Promise(async resolve => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const recording = [];

      mediaRecorder.addEventListener("dataavailable", event => {
        recording.push(event.data);

        console.log(event.data);
      });

      const start = () => mediaRecorder.start();

      const stop = () =>
        new Promise(resolve => {
          mediaRecorder.addEventListener("stop", () => {
            const recordingBlob = new Blob(recording);
            const audioUrl = URL.createObjectURL(recordingBlob);
            const audio = new Audio(audioUrl);
            const play = () => audio.play();
            resolve({ recordingBlob, audioUrl, play });
          });

          mediaRecorder.stop();
        });

      resolve({ start, stop });
    });

  const sleep = time => new Promise(resolve => setTimeout(resolve, time));

  const handleAction = async () => {
    const recorder = await recordAudio();
    const actionButton = document.getElementById("action");
    actionButton.disabled = true;
    recorder.start();
    await sleep(6000);
    const audio = await recorder.stop();
    audio.play();
    await sleep(6000);
    actionButton.disabled = false;
  };
};

export default Recorder;
