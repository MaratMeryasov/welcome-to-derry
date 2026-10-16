document.addEventListener("DOMContentLoaded", () => {
  const dialog = document.querySelector(".trailer-dialog");
  const frame = dialog?.querySelector("iframe");
  const closeButton = dialog?.querySelector(".dialog-close");
  const openButtons = document.querySelectorAll("[data-trailer-open]");

  openButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!dialog || !frame) return;
      frame.src = frame.dataset.src;
      dialog.showModal();
    });
  });

  closeButton?.addEventListener("click", () => dialog?.close());
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog?.addEventListener("close", () => {
    if (frame) frame.src = "";
  });
});
