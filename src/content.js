import { UIDiv, UILabel } from "./ui.js";

export class Content {

	constructor(reader) {

		const container = new UIDiv().setId("content");
		container.dom.ontransitionend = (e) => {

			reader.emit("sidebarreflow");
			e.preventDefault();
		};

		const prev = new UIDiv().setId("prev").setClass("arrow");
		prev.dom.onclick = (e) => {

			reader.emit("prev");
			e.preventDefault();
		};
		prev.add(new UILabel("<"));

		const next = new UIDiv().setId("next").setClass("arrow");
		next.dom.onclick = (e) => {

			reader.emit("next");
			e.preventDefault();
		};
		next.add(new UILabel(">"));

		const viewer = new UIDiv().setId("viewer");
		const divider = new UIDiv().setId("divider");
		const loader = new UIDiv().setId("loader");

		container.add([prev, viewer, next, divider, loader]);
		document.body.appendChild(container.dom);

		//-- events --//

		reader.on("bookready", (cfg) => {

			loader.dom.style.display = "block";
		});

		reader.on("bookloaded", () => {

			loader.dom.style.display = "none";
		});

		reader.on("sidebaropener", (value) => {

			if (value) {
				container.addClass("closed");
			} else {
				container.removeClass("closed");
			}
		});

		reader.on("layout", (props) => {

			if (props.spread && props.width > props.spreadWidth) {
				divider.dom.style.display = "block";
			} else {
				divider.dom.style.display = "none";
			}
		});

		reader.on("relocated", (location) => {

			if (location.atStart) {
				prev.addClass("disabled");
			} else {
				prev.removeClass("disabled");
			}

			if (location.atEnd) {
				next.addClass("disabled");
			} else {
				next.removeClass("disabled");
			}
		});

		reader.on("prev", () => {

			prev.addClass("active");
			setTimeout(() => { prev.removeClass("active"); }, 100);
		});

		reader.on("next", () => {

			next.addClass("active");
			setTimeout(() => { next.removeClass("active"); }, 100);
		});

		reader.on("viewercleanup", () => {

			viewer.clear();
		});
	}
}
