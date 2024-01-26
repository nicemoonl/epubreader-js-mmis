import { UIPanel, UITreeView, UITreeViewItem, UILink, UIDiv } from "../ui.js";

export class TocPanel extends UIPanel {

	constructor(reader) {

		super();

		this.setId("contents");
		this.reader = reader;
		this.selector = undefined; // save reference to selected tree item
		const container = new UIDiv().setClass("list-container");

		//-- events --//

		reader.on("navigation", (toc) => {

			container.clear();
			container.add(this.generateToc(toc));
			this.add(container);
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
