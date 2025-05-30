import { UIPanel, UIDiv, UIItem, UIList, UILink, UISpan, UIText, UIBox } from "../ui.js";

export class TocPanel extends UIPanel {

	constructor(reader) {

		super();
		const container = new UIDiv().setClass("list-container");
		this.uiDiv = container;
		const strings = reader.strings;
		const keys = [
			"sidebar/contents"
		];
		const label = new UIText(strings.get(keys[0])).setClass("label");
		this.reader = reader;
		this.selector = undefined; // save reference to selected tree item
		this.setId("contents");
		this.add(new UIBox(label).addClass("header"));

		//-- events --//

		reader.on("navigation", (toc) => {

			container.clear();
			const uiList = this.generateToc(toc);
			container.add(uiList);
			container.uiList = uiList;
			this.add(container);
		});

		reader.on("languagechanged", (value) => {

			label.setValue(strings.get(keys[0]));
		});

		reader.on("relocated", () => {
			// select the current chapter in toc when relocated
			this.selectCurrentChapter();
		});
	}

	generateToc(toc, parent) {

		const list = new UIList(parent);
		list.uiItems = [];

		toc.forEach((chapter) => {

			const link = new UILink(chapter.href, chapter.label);
			const item = new UIItem(list).setId(chapter.id);
			const ibtn = new UISpan();

			link.dom.onclick = (e) => {

				if (this.selector && this.selector !== item)
					this.selector.unselect();
				this.reader.settings.sectionId = chapter.id;
				this.reader.rendition.display(chapter.href);
				// close sidebar when toc item is clicked
				this.reader.emit("sidebaropener", false);
				e.preventDefault();
			};
			item.add([ibtn, link]);
			this.reader.navItems[chapter.href] = {
				id: chapter.id,
				label: chapter.label
			};

			if (this.reader.settings.sectionId === chapter.id) {
				list.expand();
			}

			if (chapter.subitems && chapter.subitems.length > 0) {

				const subItems = this.generateToc(chapter.subitems, item);
				ibtn.setClass("toggle-collapsed");
				ibtn.dom.onclick = () => {

					if (subItems.expanded) {
						subItems.collaps();
						ibtn.setClass("toggle-collapsed");
					} else {
						subItems.expand();
						ibtn.setClass("toggle-expanded");
					}
					return false;
				};
				item.add(subItems);
			}

			list.add(item);
			list.uiItems.push(item);
		});

		return list;
	}

	selectCurrentChapter() {
		this.uiDiv.uiList.uiItems.forEach((item) => {
			if (item.dom.id === this.reader.settings.sectionId) {
				item.select();
			} else {
				item.unselect();
			}
		});
	}
}