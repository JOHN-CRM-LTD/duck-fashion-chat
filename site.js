"use strict";

const copyButton = document.getElementById("copy-request");
const copyStatus = document.getElementById("copy-status");
copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(document.getElementById("test-request").textContent.trim());
    copyStatus.textContent = "Copied. Paste it into the chat.";
  } catch {
    copyStatus.textContent = "Select and copy the request above, then paste it into the chat.";
  }
});
