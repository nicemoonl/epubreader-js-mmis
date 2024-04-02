import { UIPanel, UIDiv, UIInput } from "./ui.js";

export class Toolbar {

	constructor(reader) {

		const strings = reader.strings;

		const container = new UIDiv().setId("toolbar");
		const keys = [
			"toolbar/sidebar",
			"toolbar/prev",
			"toolbar/next",
			"toolbar/openbook",
			"toolbar/openbook/error",
			"toolbar/bookmark",
			"toolbar/fullscreen"
		];
		const menu1 = new UIDiv().setClass("menu-1");
		const openerBox = new UIDiv().setId("btn-m").setClass("box");
		const openerBtn = new UIInput("button");
		openerBtn.dom.title = strings.get(keys[0]);
		openerBtn.dom.onclick = (e) => {

			reader.emit("sidebaropener", true);
			e.preventDefault();
		};
		openerBox.add(openerBtn);
		menu1.add(openerBox);

		const prevBox = new UIDiv().setId("btn-p").setClass("box");
		const prevBtn = new UIInput("button");
		prevBtn.setTitle(strings.get(keys[1]));
		prevBtn.dom.onclick = (e) => {

			reader.emit("prev");
			e.preventDefault();
			prevBtn.dom.blur();
		};
		prevBox.add(prevBtn);
		menu1.add(prevBox);

		const nextBox = new UIDiv().setId("btn-n").setClass("box");
		const nextBtn = new UIInput("button");
		nextBtn.dom.title = strings.get(keys[2]);
		nextBtn.dom.onclick = (e) => {

			reader.emit("next");
			e.preventDefault();
			nextBtn.dom.blur();
		};
		nextBox.add(nextBtn);
		menu1.add(nextBox);

		const menu2 = new UIDiv().setClass("menu-2");
		const onload = (e) => {

			storage.clear();
			storage.set(e.target.result, () => {
				reader.unload();
				reader.init(e.target.result, { restore: true });
				const url = new URL(window.location.origin);
				window.history.pushState({}, "", url);
			});
		};
		const onerror = (e) => {
			console.error(e);
		};
		const storage = window.storage;
		const openbookBox = new UIDiv().setId("btn-o").setClass("box");
		const openbookBtn = new UIInput("file");
		openbookBtn.dom.title = strings.get(keys[3]);
		openbookBtn.dom.accept = "application/epub+zip";
		openbookBtn.dom.onchange = (e) => {

			if (e.target.files.length === 0)
				return;

			if (window.FileReader) {

				const fr = new FileReader();
				fr.onload = onload;
				fr.readAsArrayBuffer(e.target.files[0]);
				fr.onerror = onerror;
			} else {
				alert(strings.get(keys[4]));
			}
			
		};
		openbookBtn.dom.onclick = (e) => {

			openbookBtn.dom.blur();
		};
		openbookBox.add(openbookBtn);
		menu2.add(openbookBox);

		const bookmarkBox = new UIDiv().setId("btn-b").setClass("box");
		const bookmarkBtn = new UIInput("button");
		bookmarkBtn.setTitle(strings.get(keys[5]));
		bookmarkBtn.dom.onclick = (e) => {

			const cfi = this.locationCfi;
			const val = reader.isBookmarked(cfi) === -1;
			reader.emit("bookmarked", val);
			e.preventDefault();
			bookmarkBtn.dom.blur();
		};
		bookmarkBox.add(bookmarkBtn);
		menu2.add(bookmarkBox);

		let fullscreenBtn = null;
		if (document.fullscreenEnabled) {

			const fullscreenBox = new UIDiv().setId("btn-f").setClass("box");
			fullscreenBtn = new UIInput("button");
			fullscreenBtn.setTitle(strings.get(keys[6]));
			fullscreenBtn.dom.onclick = (e) => {

				this.toggleFullScreen();
				e.preventDefault();
			};

			document.onkeydown = (e) => {

				if (e.key === "F11") {
					e.preventDefault();
					this.toggleFullScreen();
				}
			};

			document.onfullscreenchange = (e) => {

				const w = window.screen.width === e.target.clientWidth;
				const h = window.screen.height === e.target.clientHeight;

				if (w && h) {
					fullscreenBox.addClass("resize-small");
				} else {
					fullscreenBox.removeClass("resize-small");
				}
			};
			fullscreenBox.add(fullscreenBtn);
			menu2.add(fullscreenBox);
		}

		container.add([menu1, menu2]);
		document.body.appendChild(container.dom);

		//-- events --//

		reader.on("relocated", (location) => {

			const cfi = location.start.cfi;
			const val = reader.isBookmarked(cfi) === -1;
			if (val) {
				bookmarkBox.removeClass("bookmarked");
			} else {
				bookmarkBox.addClass("bookmarked");
			}
			prevBox.dom.style.display = location.atStart ? "none" : "block";
			nextBox.dom.style.display = location.atEnd ? "none" : "block";
			this.locationCfi = cfi; // save location cfi
		});

		reader.on("bookmarked", (boolean) => {

			if (boolean) {
				bookmarkBox.addClass("bookmarked");
			} else {
				bookmarkBox.removeClass("bookmarked");
			}
		});

		reader.on("languagechanged", (value) => {

			openerBtn.setTitle(strings.get(keys[0]));
			openbookBtn.setTitle(strings.get(keys[1]));
			bookmarkBtn.setTitle(strings.get(keys[3]));

			if (fullscreenBtn) {
				fullscreenBtn.setTitle(strings.get(keys[4]));
			}
		});
	}

	toggleFullScreen() {

		document.activeElement.blur();

		if (document.fullscreenElement === null) {
			document.documentElement.requestFullscreen();
		} else if (document.exitFullscreen) {
			document.exitFullscreen();
		}
	}
}