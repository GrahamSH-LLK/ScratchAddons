export default function () {
  const themeStylePath = chrome.runtime.getURL("/webpages/dist/colors-light.css");
  const prerelease = chrome.runtime.getManifest().version_name.includes("-prerelease");
  if (prerelease) {
    const blue = getComputedStyle(document.documentElement).getPropertyValue("--blue");
    document.documentElement.style.setProperty("--brand-orange", blue);
    const favicon = document.getElementById("favicon");
    if (favicon) favicon.href = chrome.runtime.getURL("/images/icon-blue.png");
  }
  const lightThemeLink = document.createElement("link");
  lightThemeLink.setAttribute("rel", "stylesheet");
  lightThemeLink.setAttribute("href", themeStylePath);
  lightThemeLink.setAttribute("data-below-vue-components", "");

  return new Promise((resolve) => {
    chrome.storage.sync.get(["globalTheme"], ({ globalTheme = false }) => {
      // true = light, false = dark
      if (globalTheme === true && document.head.lastElementChild.href !== themeStylePath) {
        document.head.appendChild(lightThemeLink);
      }
      let theme = globalTheme;
      resolve({
        theme: globalTheme,
        setGlobalTheme(mode) {
          if (mode === theme) return;
          chrome.storage.sync.set({ globalTheme: mode }, () => {
            if (mode === true) {
              document.head.appendChild(lightThemeLink);
            } else {
              document.head.lastElementChild.remove();
            }
          });
          theme = mode;
        },
      });
    });
  });
}
