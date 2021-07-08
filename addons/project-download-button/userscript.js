// borrows from project-info/projectstats.js

export default async function ({ addon, console, msg }) {

  const vm = addon.tab.traps.vm;

  console.log(vm);

  async function insertDownloadButton() {

    console.log("hello, world?");

    const buttons = await addon.tab.waitForElement(".preview .project-buttons", {
      markAsSeen: true,
      reduxEvents: [
        "scratch-gui/mode/SET_PLAYER",
        "fontsLoaded/SET_FONTS_LOADED",
        "scratch-gui/locales/SELECT_LOCALE",
      ],
      reduxCondition: (state) => state.scratchGui.mode.isPlayerOnly,
    });

    let downloadButton = document.createElement('button');
    downloadButton.className = "button remix-button download-button"; // include remix-button class to inherit icon styling
    downloadButton.innerText = msg('download');

    buttons.insertBefore(downloadButton, buttons.firstChild);
  }

  vm.runtime.on("PROJECT_LOADED", async () => insertDownloadButton());
  addon.tab.addEventListener("urlChange", (e) => insertDownloadButton());
}
  