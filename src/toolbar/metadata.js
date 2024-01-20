import { UIPanel, UIText } from "../ui.js";

export class MetadataPanel extends UIPanel {

	constructor(reader) {

		super();
		super.setId("metadata");

		const title = new UIText().setId("book-title");
		const creator = new UIText().setId("book-creator");
		const separator = new UIText().setId("book-title-separator");

		super.add([title, separator, creator]);

		//-- events --//

		reader.on("metadata", (meta) => {

			document.title = meta.title;
			document.title = meta.creator ? " - " + meta.creator : "";
			title.setValue(meta.title);
			if (meta.creator) {
				creator.setValue(meta.creator);
				separator.dom.style.display = "inline-block";
			}
		});
	}
}
