import { UIPanel, UIRow, UISelect, UIInput, UILabel, UINumber, UIText, UIBox, UIDiv } from "../ui.js";

export class SpeechPanel extends UIPanel {

	constructor(reader) {

		super();
		super.setId("speech");

		const strings = reader.strings;
		const keys = [
			"sidebar/texttospeech",
      "sidebar/texttospeech/play",
      "sidebar/texttospeech/pause",
      "sidebar/texttospeech/stop",
		];
		const headerLabel = new UIText(strings.get(keys[0])).setClass("label");
		this.add(new UIBox(headerLabel).addClass("header"));

    let isButtonDisabled = false;

		const playButton = new UIText(strings.get(keys[1]), "language-ui").setClass("button");
		const playButtonRow = new UIRow();
    playButton.dom.onclick = (e) => {
      if (isButtonDisabled) return;
      reader.emit("playspeech");
      e.preventDefault();
    };
		playButtonRow.add(playButton);
		this.add(playButtonRow);

    const stopButton = new UIText(strings.get(keys[3]), "language-ui").setClass("button");
		const stopButtonRow = new UIRow();
    stopButtonRow.setStyle("display", "none");
    stopButton.dom.onclick = (e) => {
      if (isButtonDisabled) return;
      reader.emit("stopspeech");
      e.preventDefault();
    };
    stopButtonRow.add(stopButton);
    this.add(stopButtonRow);

    const errorText = new UIText("", "language-ui");
    const errorRow = new UIRow();
    errorRow.setStyle("display", "none");
    errorRow.add(errorText);
    this.add(errorRow);

    const clearError = function() {
      errorText.setTextContent("");
      errorRow.setStyle("display", "none");
    };

    const tempDisableButtons = function() {
      playButton?.addClass("disabled");
      stopButton?.addClass("disabled");
      isButtonDisabled = true;
      setTimeout(() => {
        playButton?.removeClass("disabled");
        stopButton?.removeClass("disabled");
        isButtonDisabled = false;
      }, 2000);
    };

		//-- events --//
    reader.on("speechuiupdate", (option) => {
      clearError();
      switch (option.status) {
        case "playing":
          playButton.setTextContent(strings.get(keys[2]));
          stopButtonRow.setStyle("display", "block");
          tempDisableButtons();
          break;
        case "paused":
          playButton.setTextContent(strings.get(keys[1]));
          stopButtonRow.setStyle("display", "block");
          tempDisableButtons();
          break;
        case "stopped":
          playButton.setTextContent(strings.get(keys[1]));
          stopButtonRow.setStyle("display", "none");
          tempDisableButtons();
          break;
      }
    });

    reader.on('speecherror', (error) => {
      errorText.setTextContent(error);
      errorRow.setStyle("display", "block");
    });
	}
}