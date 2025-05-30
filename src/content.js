import { UIDiv, UISpan } from "./ui.js";

export class Content {

	constructor(reader) {

		const settings = reader.settings;
		const container = new UIDiv().setId("content");

		let prev;
		if (settings.arrows === "content") {

			prev = new UIDiv().setId("prev").setClass("arrow");
			prev.dom.onclick = (e) => {

				reader.emit("prev");
				e.preventDefault();
			};
			prev.add(new UISpan("<"));
			container.add(prev);
		}

		const viewer = new UIDiv().setId("viewer");
		container.add(viewer);

		let next;
		if (settings.arrows === "content") {
			next = new UIDiv().setId("next").setClass("arrow");
			next.dom.onclick = (e) => {

				reader.emit("next");
				e.preventDefault();
			};
			next.add(new UISpan(">"));
			container.add(next);
		}

		const loader = new UIDiv().setId("loader");
		const divider = new UIDiv().setId("divider");
		const overlay = new UIDiv().setId("overlay");
		overlay.dom.onclick = (e) => {
			reader.emit("sidebaropener", false);
			e.preventDefault();
		};

		// Add progress bar container
		const progressContainer = new UIDiv().setId("progress-container").setClass("hidden");
		const progressBar = new UIDiv().setId("progress-bar");
		const progressHandle = new UIDiv().setId("progress-handle");
		progressBar.add(progressHandle);
		progressContainer.add(progressBar);

		// Add drag functionality to progress bar
		let isDragging = false;
		let currentProgress = 0;

		progressContainer.dom.onmousedown = (e) => {
			isDragging = true;
			updateProgressUI(e);
		};

		document.addEventListener('mousemove', (e) => {
			if (isDragging) {
				updateProgressUI(e);
			}
		});

		document.addEventListener('mouseup', () => {
			if (isDragging) {
				isDragging = false;
				// Only update the page position when dragging ends
				if (reader.book) {
					const locations = reader.book.locations;
					if (locations && locations.total) {
						const targetCfi = locations.cfiFromPercentage(currentProgress);
						reader.rendition.display(targetCfi);
					}
				}
			}
		});

		const updateProgressUI = (e) => {
			const rect = progressBar.dom.getBoundingClientRect();
			const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
			currentProgress = x / rect.width;
			progressHandle.dom.style.left = `${currentProgress * 100}%`;
		};

		container.add([loader, divider, overlay, progressContainer]);
		document.body.appendChild(container.dom);

		//-- events --//

		reader.on("bookready", (cfg) => {
			viewer.setClass(cfg.flow);
			loader.dom.style.display = "block";
			// Generate locations for the book if not already generated
			if (!reader.book.locations.length()) {
				reader.book.ready.then(() => {
					reader.book.locations.generate().then(() => {
						// Update progress bar for initial location after locations are generated
						if (reader.rendition.location) {
							const progress = reader.book.locations.percentageFromCfi(reader.rendition.location.start.cfi);
							progressHandle.dom.style.left = `${progress * 100}%`;
							progressContainer.removeClass("hidden");
						}
					});
				});
			}
		});

		reader.on("bookloaded", () => {
			loader.dom.style.display = "none";
		});

		reader.on("displayed", (renderer, cfg) => {
			// Update progress bar when the initial page is displayed
			if (cfg.previousLocationCfi && reader.book.locations.length()) {
				const progress = reader.book.locations.percentageFromCfi(cfg.previousLocationCfi);
				progressHandle.dom.style.left = `${progress * 100}%`;
			}
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
			if (settings.arrows === "content") {
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
			}

			// Update progress bar position
			if (reader.book.locations.length()) {
				const progress = reader.book.locations.percentageFromCfi(location.start.cfi);
				progressHandle.dom.style.left = `${progress * 100}%`;
			}
		});

		reader.on("prev", () => {
			if (settings.arrows === "content") {
				prev.addClass("active");
				setTimeout(() => { prev.removeClass("active"); }, 100);
			}
		});

		reader.on("next", () => {
			if (settings.arrows === "content") {
				next.addClass("active");
				setTimeout(() => { next.removeClass("active"); }, 100);
			}
		});

		reader.on("sidebaropener", (value) => {
			overlay.dom.style.display = value ? "block" : "none";
		});

		reader.on("viewercleanup", () => {
			viewer.clear();
		});
	}
}