document.addEventListener("DOMContentLoaded", async () => {
  let [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  let url = new URL(tab.url);
  let domain = url.hostname;

  // retrieve stored state for this domain
  browser.storage.local.get(domain).then((result) => {
    let enabled = result[domain] || false;
    document.getElementById("toggleSwitch").checked = enabled;
  });

  document.getElementById("toggleSwitch").addEventListener("change", async (e) => {
    let enabled = e.target.checked;
    let obj = {};
    obj[domain] = enabled;
    await browser.storage.local.set(obj);
    // send a message to the content script in the active tab
    browser.tabs.sendMessage(tab.id, { action: "toggleOverride", enable: enabled });
  });
});
