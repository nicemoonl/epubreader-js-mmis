import { UIPanel, UIDiv, UIRow, UITextArea, UIInput, UILink, UIList, UISpan } from "../ui.js";

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

			if (isSelected() && e.target.value.length > 0) {
				btn_a.dom.disabled = false;
			} else {
				btn_a.dom.disabled = true;
			}
		};

		const selector = {
			range: undefined,
			cfiRange: undefined
		};

		const btn_a = new UIInput("button", ctrlStr[0]).addClass("btn-start");
		btn_a.dom.disabled = true;
		btn_a.dom.onclick = () => {

			const note = {
				date: new Date(),
				text: textBox.getValue(),
				href: selector.cfiRange,
				uuid: reader.uuid()
			};

			reader.settings.annotations.push(note);

			this.set(note);

			textBox.setValue('');
			btn_a.dom.disabled = true;
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

			btn_c.dom.disabled = reader.settings.annotations.length === 0;
		};

		const isSelected = () => {

			return selector.range && selector.range.startOffset !== selector.range.endOffset;
		};

		//-- events --//

		reader.on("bookready", (cfg) => {

			cfg.annotations.forEach((note) => {

				this.set(note);
			});
		});

		reader.on("selected", (cfiRange, contents) => {

			selector.range = contents.range(cfiRange);
			selector.cfiRange = cfiRange;

			if (isSelected() && textBox.getValue().length > 0) {
				btn_a.dom.disabled = false;
			} else {
				btn_a.dom.disabled = true;
			}
		});

		reader.on("unselected", () => {

			btn_a.dom.disabled = true;
		});
	}

	set(note) {

		const link = new UILink("#" + note.href, note.text);
		const btnr = new UISpan().setClass("btn-remove");
		const call = () => { };

		link.onclick = () => {

			this.reader.rendition.display(note.href);
			return false;
		};

		btnr.dom.onclick = () => {

			this.removeNote(note);
			return false;
		};

		this.notes.add([link, btnr], "note-" + note.uuid);
		this.reader.rendition.annotations.add(
			"highlight", note.href, {}, call, "note-highlight", {});
		this.update();
	}

	removeNote(note) {

		const index = this.reader.settings.annotations.indexOf(note);
		if (index === -1)
			return;

		this.notes.remove(index);
		this.reader.settings.annotations.splice(index, 1);
		this.reader.rendition.annotations.remove(note.href, "highlight");
		this.update();
	}

	clearNotes() {

		this.notes.clear();
		this.reader.settings.annotations = [];
	}
}
