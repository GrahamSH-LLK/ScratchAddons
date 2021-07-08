// borrows from project-info/projectstats.js
import downloadBlob from '/libraries/common/cs/download-blob.js'
export default async function ({ addon, console, msg }) {

  const vm = addon.tab.traps.vm;
  

  console.log(vm);
  const getProjectFilename = (curTitle, defaultTitle) => {
      let filenameTitle = curTitle;
      if (!filenameTitle || filenameTitle.length === 0) {
          filenameTitle = defaultTitle;
      }
      return `${filenameTitle.substring(0, 100)}.sb3`;
  };


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
    downloadButton.addEventListener('click', (e) => {
      let filename = getProjectFilename(addon.tab.redux.state.scratchGui.projectTitle, '');
      let blob = await vm.saveProjectSb3();
      downloadBlob(filename, blob);
    });
    buttons.insertBefore(downloadButton, buttons.firstChild);
  }

  vm.runtime.on("PROJECT_LOADED", async () => insertDownloadButton());
  addon.tab.addEventListener("urlChange", (e) => insertDownloadButton());
}
  
