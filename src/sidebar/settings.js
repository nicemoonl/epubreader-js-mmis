import { UIPanel, UIRow, UISelect, UIInput, UILabel, UIInteger } from "../ui.js";

export class SettingsPanel extends UIPanel {

	constructor(reader) {

		super();
		super.setId("settings");

		const strings = reader.strings;
		const keys = [
			"sidebar/settings/language",
			"sidebar/settings/fontsize",
			"sidebar/settings/layout",
			"sidebar/settings/spread",
			"sidebar/settings/spread/pagewidth"
		];

		const languageLabel = new UILabel(strings.get(keys[0]));
		const languageRow = new UIRow();
		const language = new UISelect().setOptions({
			en: "English",
			fr: "French",
			ja: "Japanese",
			ru: "Russian"
		});
		language.dom.onchange = (e) => {

			reader.emit("languagechanged", e.target.value);
		};

		languageRow.add(languageLabel);
		languageRow.add(language);

		const fontSizeLabel = new UILabel(strings.get(keys[1]));
		const fontSizeRow = new UIRow();
		const fontSize = new UIInteger(100, 1);
		fontSize.dom.onchange = (e) => {

			reader.emit("styleschanged", {
				fontSize: parseInt(e.target.value)
			});
		};

		fontSizeRow.add(fontSizeLabel);
		fontSizeRow.add(fontSize);

		//-- layout configure --//

		const layoutLabel = new UILabel(strings.get(keys[2]));
		const layoutRow = new UIRow();
		const layout = new UISelect().setOptions({
			paginated: "Paginated",
			scrolled: "Scrolled"
		});
		layout.dom.onchange = (e) => {

			reader.emit("flowchanged", e.target.value);

			if (e.target.value === "scrolled") {
				reader.emit("spreadchanged", {
					mod: "none",
					min: undefined
				});
			} else {
				reader.emit("spreadchanged", {
					mod: undefined,
					min: undefined
				});
			}
		};

		layoutRow.add(layoutLabel);
		layoutRow.add(layout);

		//-- spdead configure --//

		const spreadLabel = new UILabel(strings.get(keys[3]));
		const spreadRow = new UIRow();
		const spread = new UISelect().setOptions({
			none: "None",
			auto: "Auto"
		});
		spread.dom.onchange = (e) => {

			reader.emit("spreadchanged", {
				mod: e.target.value,
				min: undefined
			});
		};

		spreadRow.add(spreadLabel);
		spreadRow.add(spread);

		const minSpreadWidthLabel = new UILabel(strings.get(keys[4]));
		const minSpreadWidthRow = new UIRow();
		const minSpreadWidth = new UIInteger(800, 1);
		minSpreadWidth.dom.onchange = (e) => {

			reader.emit("spreadchanged", {
				mod: undefined,
				min: parseInt(e.target.value)
			});
		};

		minSpreadWidthRow.add(minSpreadWidthLabel);
		minSpreadWidthRow.add(minSpreadWidth);

		//-- pagination --//

		const paginationStr = strings.get("sidebar/settings/pagination");
		const paginationRow = new UIRow();
		const pagination = new UIInput("checkbox", false, paginationStr[1]);
		pagination.setId("pagination");
		pagination.dom.onclick = (e) => {

			// not implemented
		};

		paginationRow.add(new UILabel(paginationStr[0], "pagination"));
		paginationRow.add(pagination);

		super.add([
			languageRow,
			fontSizeRow,
			layoutRow,
			spreadRow,
			minSpreadWidthRow,
			//paginationRow
		]);

		//-- events --//

		reader.on("bookready", (cfg) => {

			language.setValue(cfg.language);
			fontSize.setValue(cfg.styles.fontSize);
			layout.setValue(cfg.flow);
			spread.setValue(cfg.spread.mod);
			minSpreadWidth.setValue(cfg.spread.min);
		});

		reader.on("layout", (props) => {

			spread.dom.disabled = props.flow === "scrolled";
		});

		reader.on("languagechanged", (value) => {

			languageLabel.dom.textContent = strings.get(keys[0]);
			fontSizeLabel.dom.textContent = strings.get(keys[1]);
			layoutLabel.dom.textContent = strings.get(keys[2]);
			spreadLabel.dom.textContent = strings.get(keys[3]);
			minSpreadWidthLabel.dom.textContent = strings.get(keys[4]);
		});
	}
}
