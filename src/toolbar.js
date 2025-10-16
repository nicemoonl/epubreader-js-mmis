import { UIDiv, UIInput, UISelect } from "./ui.js";
import { readerConfig } from "./config.js";

export class Toolbar {

	constructor(reader) {

		const strings = reader.strings;
		const settings = reader.settings;

		const container = new UIDiv().setId("toolbar");
		const keys = [
			"toolbar/sidebar",
			"toolbar/prev",
			"toolbar/next",
			"toolbar/openbook",
			"toolbar/openbook/error",
			"toolbar/bookmark",
			"toolbar/fullscreen",
			"toolbar/settings",
			"toolbar/zoom-in",
			"toolbar/zoom-out",
		];
		const menu1 = new UIDiv().setClass("menu-1");
		const openerBox = new UIDiv().setId("btn-m").setClass("box");
		const openerBtn = new UIInput("button");
		openerBtn.dom.title = strings.get(keys[0]);
		openerBtn.dom.onclick = (e) => {

			reader.emit("sidebaropener", true);
			openerBtn.dom.blur();
			e.preventDefault();
		};
		openerBox.add(openerBtn);
		menu1.add(openerBox);

		let prevBox, prevBtn;
		let nextBox, nextBtn;
		if (settings.arrows === "toolbar") {
			prevBox = new UIDiv().setId("btn-p").setClass("box");
			prevBtn = new UIInput("button");
			prevBtn.setTitle(strings.get(keys[1]));
			prevBtn.dom.onclick = (e) => {

				reader.emit("prev");
				e.preventDefault();
				prevBtn.dom.blur();
			};
			prevBox.add(prevBtn);
			menu1.add(prevBox);

			nextBox = new UIDiv().setId("btn-n").setClass("box");
			nextBtn = new UIInput("button");
			nextBtn.dom.title = strings.get(keys[2]);
			nextBtn.dom.onclick = (e) => {

				reader.emit("next");
				e.preventDefault();
				nextBtn.dom.blur();
			};
			nextBox.add(nextBtn);
			menu1.add(nextBox);
		}

		const menu2 = new UIDiv().setClass("menu-2");
		let openbookBtn;
		if (settings.openbook) {
			const onload = (e) => {

				reader.storage.clear();
				reader.storage.set(e.target.result, () => {
					reader.unload();
					reader.init(e.target.result);
					const url = new URL(window.location.origin);
					window.history.pushState({}, "", url);
				});
			};
			const onerror = (e) => {
				console.error(e);
			};
			const openbookBox = new UIDiv().setId("btn-o").setClass("box");
			openbookBtn = new UIInput("file");
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
		}

		let bookmarkBox, bookmarkBtn;
		if (settings.bookmarks) {
			bookmarkBox = new UIDiv().setId("btn-b").setClass("box");
			bookmarkBtn = new UIInput("button");
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
		}

		// add zoom in and out buttons in top toolbar
		let zoomSelectBox, zoomSelect;
		if (true) {
			// zoom out
			const zoomOutBox = new UIDiv().setId("btn-zo").setClass("box");
			const zoomOutBtn = new UIInput("button");
			zoomOutBtn.setTitle(strings.get(keys[9]));
			zoomOutBtn.dom.onclick = (e) => {
				const step = readerConfig.fontsize.step;
				let value = reader.settings.styles.fontSize;
				value -= step;
				reader.emit("styleschanged", { fontSize: value });
				e.preventDefault();
			};
			zoomOutBox.add(zoomOutBtn);
			menu2.add(zoomOutBox);

			// zoom select
			zoomSelectBox = new UIDiv().setId("input-zoom").setClass("box");
			zoomSelect = new UISelect().setOptions({
				50: "50%",
				60: "60%",
				70: "70%",
				80: "80%",
				90: "90%",
				100: "100%",
				110: "110%",
				120: "120%",
				130: "130%",
				140: "140%",
				150: "150%",
				160: "160%",
				170: "170%",
				180: "180%",
				190: "190%",
				200: "200%",
			});
			zoomSelect.setValue(reader.settings.styles.fontSize);
			zoomSelect.dom.onchange = (e) => {
				reader.emit("styleschanged", { fontSize: parseInt(e.target.value) });
				e.preventDefault();
			};
			zoomSelectBox.add(zoomSelect);
			menu2.add(zoomSelectBox);

			// zoom in
			const zoomInBox = new UIDiv().setId("btn-zi").setClass("box");
			const zoomInBtn = new UIInput("button");
			zoomInBtn.setTitle(strings.get(keys[8]));
			zoomInBtn.dom.onclick = (e) => {
				const step = readerConfig.fontsize.step;
				let value = reader.settings.styles.fontSize;
				value += step;
				reader.emit("styleschanged", { fontSize: value });
				e.preventDefault();
			};
			zoomInBox.add(zoomInBtn);
			menu2.add(zoomInBox);
		}

		// add page flow toggle button in top toolbar
		const updatePageFlow = (value) => {
			const flow = value ?? reader.settings.flow;
			if (flow === "scrolled") {
				pageFlowBtn.setTitle(strings.get("toolbar/flow/scrolled"));
				pageFlowBox.addClass("scrolled");
				pageFlowBox.removeClass("paginated");
				if (reader.settings.spread.mod !== "none") {
					reader.emit("spreadchanged", {
						mod: "none",
						min: undefined
					});
				}
				reader.emit("spreaddisabled", true);
			} else {
				pageFlowBtn.setTitle(strings.get("toolbar/flow/paginated"));
				pageFlowBox.addClass("paginated");
				pageFlowBox.removeClass("scrolled");
				reader.emit("spreaddisabled", false);
			}
		};

		let pageFlowBox, pageFlowBtn;
		if (!reader.isMobile) {
			pageFlowBox = new UIDiv().setId("btn-pf").setClass("box");
			pageFlowBtn = new UIInput("button");
			pageFlowBtn.dom.onclick = (e) => {
				reader.emit("flowchanged", reader.settings.flow === "scrolled" ? "paginated" : "scrolled");
			};
			pageFlowBox.add(pageFlowBtn);
			menu2.add(pageFlowBox);
			updatePageFlow();
		}

		// add page spread toggle button in top toolbar
		const updatePageSpread = (value) => {
			const mod = value ?? reader.settings.spread.mod;
			if (mod === "none") {
				pageSpreadBtn.setTitle(strings.get("toolbar/spread/none"));
				pageSpreadBox.addClass("none");
				pageSpreadBox.removeClass("auto");
			} else {
				pageSpreadBtn.setTitle(strings.get("toolbar/spread/auto"));
				pageSpreadBox.addClass("auto");
				pageSpreadBox.removeClass("none");
			}
		};

		let pageSpreadBox, pageSpreadBtn;
		if (!reader.isMobile) {
			pageSpreadBox = new UIDiv().setId("btn-ps").setClass("box");
			pageSpreadBtn = new UIInput("button");
			pageSpreadBtn.dom.onclick = (e) => {
				reader.emit("spreadchanged", {
					mod: reader.settings.spread.mod === "none" ? "auto" : "none",
					min: undefined
				});
			};
			pageSpreadBtn.dom.disabled = reader.settings.flow === "scrolled";
			pageSpreadBox.add(pageSpreadBtn);
			menu2.add(pageSpreadBox);
			updatePageSpread();
		}

		// add setting button in top toolbar
		if (settings.settings) {
			const settingBox = new UIDiv().setId("btn-st").setClass("box");
			const settingBtn = new UIInput("button");
			settingBtn.setTitle(strings.get(keys[7]));
			settingBtn.dom.onclick = (e) => {
				reader.emit("sidebaropener", true);
				reader.sidebar.container.select("btn-c");
				e.preventDefault();
			};
			settingBox.add(settingBtn);
			menu2.add(settingBox);
		}

		// add fullscreen button in top toolbar
		let fullscreenBtn;
		if (settings.fullscreen) {

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

			if (settings.bookmarks) {
				const cfi = location.start.cfi;
				const val = reader.isBookmarked(cfi) === -1;
				if (val) {
					bookmarkBox.removeClass("bookmarked");
				} else {
					bookmarkBox.addClass("bookmarked");
				}
				this.locationCfi = cfi; // save location cfi
			}
			if (settings.arrows === "toolbar") {
				prevBox.dom.style.display = location.atStart ? "none" : "block";
				nextBox.dom.style.display = location.atEnd ? "none" : "block";
			}
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

			if (settings.arrows === "toolbar") {
				prevBtn.setTitle(strings.get(keys[1]));
				nextBtn.setTitle(strings.get(keys[2]));
			}
			if (settings.openbook) {
				openbookBtn.setTitle(strings.get(keys[3]));
			}
			if (settings.bookmarks) {
				bookmarkBtn.setTitle(strings.get(keys[5]));
			}
			if (settings.fullscreen) {
				fullscreenBtn.setTitle(strings.get(keys[6]));
			}
		});

		reader.on("uifontsizechanged", (value) => {
			zoomSelect.setValue(value.fontSize);
		});

		reader.on("flowchanged", (value) => {
			updatePageFlow(value);
		});

		reader.on("spreadchanged", (value) => {	
			updatePageSpread(value.mod);
		});

		reader.on("spreaddisabled", (value) => {
			pageSpreadBtn.dom.disabled = value;
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