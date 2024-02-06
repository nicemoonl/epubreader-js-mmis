import { UIPanel, UIDiv, UIRow, UIInput, UILink, UIList, UIItem } from "../ui.js";

export class BookmarksPanel extends UIPanel {

	constructor(reader) {

		super();
		const container = new UIDiv().setClass("list-container");
		const strings = reader.strings;
		const ctrlRow = new UIRow();
		const ctrlStr = [
			strings.get("sidebar/bookmarks/add"),
			strings.get("sidebar/bookmarks/remove"),
			strings.get("sidebar/bookmarks/clear"),
		];
		const btn_a = new UIInput("button", ctrlStr[0]).addClass("btn-start");
		const btn_r = new UIInput("button", ctrlStr[1]).addClass("btn-medium");
		const btn_c = new UIInput("button", ctrlStr[2]).addClass("btn-end");

		btn_a.dom.onclick = () => {

			reader.emit("bookmarked", true);
			return false;
		};

		btn_r.dom.onclick = () => {

			reader.emit("bookmarked", false);
			return false;
		};

		btn_c.dom.onclick = () => {

			this.clearBookmarks();
			reader.emit("bookmarked", false);
			return false;
		};

		ctrlRow.add([btn_a, btn_r, btn_c]);

		this.bookmarks = new UIList();
		container.add(this.bookmarks);
		this.setId("bookmarks");
		this.add([ctrlRow, container]);
		this.reader = reader;

		const update = () => {

			btn_r.dom.disabled = reader.settings.bookmarks.length === 0;
			btn_c.dom.disabled = reader.settings.bookmarks.length === 0;
		};

		//-- events --//

		reader.on("renderered", (renderer, cfg) => {

			cfg.bookmarks.forEach((cfi) => {

				this.setBookmark(cfi);
			});
			update();
		});

		reader.on("relocated", (location) => {

			const cfi = location.start.cfi;
			const val = reader.isBookmarked(cfi) === -1;
			btn_a.dom.disabled = !val;
			btn_r.dom.disabled = val;
			this.locationCfi = cfi; // save location cfi
		});

		reader.on("bookmarked", (boolean) => {

			if (boolean) {
				this.appendBookmark();
				btn_a.dom.disabled = true;
			} else {
				this.removeBookmark();
				btn_a.dom.disabled = false;
			}
			update();
		});
	}

	appendBookmark() {

		const cfi = this.locationCfi;
		if (this.reader.isBookmarked(cfi) > -1) {
			return;
		}
		this.setBookmark(cfi);
		this.reader.settings.bookmarks.push(cfi);
	}

	removeBookmark() {

		const cfi = this.locationCfi;
		const index = this.reader.isBookmarked(cfi);
		if (index === -1) {
			return;
		}
		this.bookmarks.remove(index);
		this.reader.settings.bookmarks.splice(index, 1);
	}

	clearBookmarks() {

		this.bookmarks.clear();
		this.reader.settings.bookmarks = [];
	}

	setBookmark(cfi) {

		const link = new UILink();
		const item = new UIItem();
		const book = this.reader.book;
		const spineItem = book.spine.get(cfi);
		const navItem = this.reader.navItemFromCfi(cfi);
		let idref;
		let label;

		if (navItem === undefined) {
			idref = spineItem.idref;
			label = spineItem.idref
		} else {
			idref = navItem.id;
			label = navItem.label;
		}

		link.setHref("#" + cfi);
		link.dom.onclick = () => {

			this.reader.rendition.display(cfi);
			return false;
		};
		link.setTextContent(label);

		item.add(link);
		item.setId(idref);
		this.bookmarks.add(item);
	}
}
