document.addEventListener("DOMContentLoaded", () => {
  const dialog = document.querySelector(".trailer-dialog");
  const frame = dialog?.querySelector("iframe");
  const closeButton = dialog?.querySelector(".dialog-close");
  const openButtons = document.querySelectorAll("[data-trailer-open]");
  let lastTrigger;

  function closeTrailer() {
    if (!dialog?.open) return;
    frame?.removeAttribute("src");
    dialog.close();
    lastTrigger?.focus();
  }

  openButtons.forEach((button) => {
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
});
