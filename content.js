(function () {
  let injectedStyle = null;

  function applyOverride(enable) {
    const existing = document.getElementById("theme-spoofer-style");
    if (existing) existing.remove();

    if (enable) {
      const style = document.createElement("style");
      style.id = "theme-spoofer-style";
      style.textContent = `
        @media (prefers-color-scheme: dark) {
          body {
            background-color: #EDE4CE !important;
            color: black !important;
          }
          ::selection {
            background: #F7B3A8 !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // check stored state for this domain on load
  let domain = window.location.hostname;
  browser.storage.local.get(domain).then((result) => {
    let enabled = result[domain] || false;
    applyOverride(enabled);
  });

  // listen for messages from the popup
  browser.runtime.onMessage.addListener((message) => {
    if (message.action === "toggleOverride") {
      applyOverride(message.enable);
    }
  });
})();
