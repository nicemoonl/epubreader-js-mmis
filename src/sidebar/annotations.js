import { UIPanel, UIDiv, UIRow, UITextArea, UIInput, UILink, UIList, UIItem, UISpan } from "../ui.js";

export class AnnotationsPanel extends UIPanel {

	constructor(reader) {

		super();
		const container = new UIDiv().setClass("list-container");
		const strings = reader.strings;
		const textRow = new UIRow();
		const ctrlRow = new UIRow();
		const ctrlStr = [
			strings.get("sidebar/annotations/add"),
			strings.get("sidebar/annotations/clear")
		];

		const textBox = new UITextArea();
		textBox.dom.oninput = (e) => {

			this.update();
		};

		const btn_a = new UIInput("button", ctrlStr[0]).addClass("btn-start");
		btn_a.dom.disabled = true;
		btn_a.dom.onclick = () => {

			const note = {
				cfi: this.cfiRange,
				date: new Date(),
				text: textBox.getValue(),
				uuid: reader.uuid()
			};

			reader.settings.annotations.push(note);

			textBox.setValue("");
			this.set(note);
			return false;
		};

		const btn_c = new UIInput("button", ctrlStr[1]).addClass("btn-end");
		btn_c.dom.disabled = true;
		btn_c.dom.onclick = () => {

			this.clearNotes();
			return false;
		};

		textRow.add(textBox);
		ctrlRow.add([btn_a, btn_c]);

		this.notes = new UIList();
		container.add(this.notes);
		this.setId("annotations");
		this.add([textRow, ctrlRow, container]);
		this.reader = reader;
		this.update = () => {

			btn_a.dom.disabled = !this.range || textBox.getValue().length === 0;
			btn_c.dom.disabled = reader.settings.annotations.length === 0;
		};

		//-- events --//

		reader.on("bookready", (cfg) => {

			cfg.annotations.forEach((note) => {

				this.set(note);
			});
		});

		reader.on("selected", (cfiRange, contents) => {

			this.cfiRange = cfiRange;
			this.range = contents.range(cfiRange);
			this.update();
		});

		reader.on("unselected", () => {

			this.range = undefined;
			this.update();
		});
	}

	set(note) {

		const link = new UILink("#" + note.cfi, note.text);
		const item = new UIItem().setId("note-" + note.uuid);
		const btnr = new UISpan().setClass("btn-remove");
		const call = () => { };

		link.onclick = () => {

			this.reader.rendition.display(note.cfi);
			return false;
		};

		btnr.dom.onclick = () => {

			this.removeNote(note);
			return false;
		};

		item.add([link, btnr]);
		this.notes.add(item);
		this.reader.rendition.annotations.add(
			"highlight", note.cfi, {}, call, "note-highlight", {});
		this.update();
	}

	removeNote(note) {

		const index = this.reader.settings.annotations.indexOf(note);
		if (index === -1)
			return;

		this.notes.remove(index);
		this.reader.settings.annotations.splice(index, 1);
		this.reader.rendition.annotations.remove(note.cfi, "highlight");
		this.update();
	}

	clearNotes() {

		this.reader.settings.annotations.forEach(note => {
			this.reader.rendition.annotations.remove(note.cfi, "highlight");
		});
		this.notes.clear();
		this.reader.settings.annotations = [];
		this.update();
	}
}
