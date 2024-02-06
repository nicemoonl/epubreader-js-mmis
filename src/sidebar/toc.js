import { UIPanel, UIDiv, UIItem, UIList, UILink, UISpan } from "../ui.js";

export class TocPanel extends UIPanel {

	constructor(reader) {

		super();
		const container = new UIDiv().setClass("list-container");
		this.setId("contents");
		this.reader = reader;
		this.selector = undefined; // save reference to selected tree item

		//-- events --//

		reader.on("navigation", (toc) => {

			container.clear();
			container.add(this.generateToc(toc));
			this.add(container);
		});
	}

	generateToc(toc, parent) {

		const list = new UIList(parent);

		toc.forEach((chapter) => {

			const link = new UILink(chapter.href, chapter.label);
			const item = new UIItem(list).setId(chapter.id);
			const tbox = new UIDiv().setId("expander");

			link.dom.onclick = () => {

				if (this.selector && this.selector !== item)
					this.selector.unselect();

				item.select();
				this.selector = item;
				this.reader.settings.sectionId = chapter.id;
				this.reader.rendition.display(chapter.href);
				return false;
			};
			item.add([tbox, link]);
			this.reader.navItems[chapter.href] = chapter;

			if (this.reader.settings.sectionId === chapter.id) {
				list.expand();
				item.select();
				this.selector = item;
			}

			if (chapter.subitems && chapter.subitems.length > 0) {

				const subItems = this.generateToc(chapter.subitems, item);
				const tbtn = new UISpan().setClass("toggle-collapsed");
				tbtn.dom.onclick = () => {

					if (subItems.expanded) {
						subItems.collaps();
						tbtn.setClass("toggle-collapsed");
					} else {
						subItems.expand();
						tbtn.setClass("toggle-expanded");
					}
					return false;
				};
				tbox.add(tbtn);
				item.add(subItems);
			}

			list.add(item);
		});

		return list;
	}
}
