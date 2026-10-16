document.addEventListener("DOMContentLoaded", () => {
  const dialog = document.querySelector(".trailer-dialog");
  const frame = dialog?.querySelector("iframe");
  const closeButton = dialog?.querySelector(".dialog-close");
  const trailerButtons = document.querySelectorAll("[data-trailer-open]");
  const soundButton = document.querySelector(".sound-button");
  let lastTrigger;
  let audioContext;
  let rainNodes = [];

  function stopRain() {
    rainNodes.forEach((node) => {
      try {
        node.stop();
      } catch (error) {
        if (error.name !== "InvalidStateError") throw error;
      }
    });
    rainNodes = [];
    soundButton?.setAttribute("aria-pressed", "false");
    const label = soundButton?.querySelector(".sound-label");
    if (label) label.textContent = "ЗВУК ВЫКЛ.";
  }

  async function toggleRain() {
    if (!soundButton) return;
    if (soundButton.getAttribute("aria-pressed") === "true") {
      stopRain();
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      soundButton.disabled = true;
      soundButton.setAttribute("aria-label", "Звук дождя недоступен в этом браузере");
      return;
    }

    audioContext ??= new AudioContextClass();
    if (audioContext.state === "suspended") await audioContext.resume();

    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let index = 0; index < channel.length; index += 1) {
      channel[index] = (Math.random() * 2 - 1) * 0.28;
    }

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 520;
    const volume = audioContext.createGain();
    volume.gain.value = 0.055;
    source.connect(filter).connect(volume).connect(audioContext.destination);
    source.start();
    rainNodes = [source];
    soundButton.setAttribute("aria-pressed", "true");
    const label = soundButton.querySelector(".sound-label");
    if (label) label.textContent = "ЗВУК ВКЛ.";
  }

  function closeTrailer() {
    if (!dialog?.open) return;
    frame?.removeAttribute("src");
    dialog.close();
    lastTrigger?.focus();
  }

  trailerButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!dialog || !frame) return;
      lastTrigger = button;
      frame.src = frame.dataset.src;
      dialog.showModal();
      closeButton?.focus();
    });
  });

  closeButton?.addEventListener("click", closeTrailer);
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) closeTrailer();
  });
  dialog?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeTrailer();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dialog?.open) closeTrailer();
  });
  soundButton?.addEventListener("click", () => {
    toggleRain().catch((error) => {
      soundButton.setAttribute("aria-pressed", "false");
      console.error("Не удалось включить звук дождя:", error);
    });
  });
  window.addEventListener("pagehide", stopRain);
});
