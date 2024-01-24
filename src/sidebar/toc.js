import { UIPanel, UITreeView, UITreeViewItem, UILink } from "../ui.js";

export class TocPanel extends UIPanel {

	constructor(reader) {

		super();
		super.setId("contents");

		this.reader = reader;
		this.selector = undefined; // save reference to selected tree item

		//-- events --//

		reader.on("navigation", (toc) => {

			this.clear();
			this.add(this.generateToc(toc));
		});
	}

	generateToc(toc) {

		const container = new UITreeView();

		toc.forEach((chapter) => {

			const link = new UILink(chapter.href, chapter.label);
			const item = new UITreeViewItem(chapter.id, link);

			link.dom.onclick = () => {

				if (this.selector && this.selector !== item) {
					this.selector.unselect();
				}
				item.select();
				this.selector = item;
				this.reader.emit("tocselected", chapter);
				return false;
			};

			if (this.reader.settings.sectionId === chapter.id) {
				item.select();
				this.selector = item;
			}

			if (chapter.subitems && chapter.subitems.length > 0) {

				item.setItem(this.generateToc(chapter.subitems));
			}

			container.add(item);
		});

		return container;
	}
}
