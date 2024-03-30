import { UIDiv, UISpan } from "./ui.js";

export class Content {

	constructor(reader) {

		const container = new UIDiv().setId("content");

		const prev = new UIDiv().setId("prev").setClass("arrow");
		prev.dom.onclick = (e) => {

			reader.emit("prev");
			e.preventDefault();
		};
		prev.add(new UISpan("<"));

		const next = new UIDiv().setId("next").setClass("arrow");
		next.dom.onclick = (e) => {

			reader.emit("next");
			e.preventDefault();
		};
		next.add(new UISpan(">"));

		const viewer = new UIDiv().setId("viewer");
		const loader = new UIDiv().setId("loader");
		const divider = new UIDiv().setId("divider");

		container.add([prev, viewer, next, divider, loader]);
		document.body.appendChild(container.dom);

		//-- events --//

		reader.on("bookready", (cfg) => {

			viewer.setClass(cfg.flow);
			loader.dom.style.display = "block";
		});

		reader.on("bookloaded", () => {

			loader.dom.style.display = "none";
		});

		reader.on("layout", (props) => {

			if (props.spread && props.width > props.spreadWidth) {
				divider.dom.style.display = "block";
			} else {
				divider.dom.style.display = "none";
			}
		});

		reader.on("flowchanged", (value) => {
			
			viewer.setClass(value);
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