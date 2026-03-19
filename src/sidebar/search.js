import { UIPanel, UIDiv, UIInput, UILink, UIList, UIItem, UIBox, UISpan } from "../ui.js";

export class SearchPanel extends UIPanel {

	constructor(reader) {

		super();
		const container = new UIDiv().setClass("list-container");
		const strings = reader.strings;

		let searchQuery = undefined;
		this._searchResults = [];
		const search = new UIInput("search").setId("nav-q");
		search.dom.placeholder = strings.get("sidebar/search/placeholder");
		search.dom.onsearch = () => {
			if (this._isSearching) {
				return;
			}
			this.reader.emit("issearching", true);

			this.removeHighlights();
			resultCount.dom.style.display = "none";

			const value = search.getValue();

			if (value.length === 0) {
				this.items.clear();
				this.items.listItems = [];
				this.searchQuery = undefined;
				this.reader.emit("toolbarsearchactive", [false, 0]);
				this.reader.emit("issearching", false);
			} else if (searchQuery !== value) {
				this.items.clear();
				this.items.listItems = [];
				this.searchQuery = value; // Store the query
				this.doSearch(value).then(results => {

					results.forEach(data => {
						this.set(data);
					});
					if (results.length === 0) {
						resultCount.dom.style.display = "block";
						resultCount.dom.innerHTML = strings.get("sidebar/search/noresults");
					} else {
						resultCount.dom.innerHTML = strings.get("sidebar/search/resultcount").replace("{count}", results.length);
						resultCount.dom.style.display = "block";
					}

					this.reader.emit("toolbarsearchactive", [true, results.length]);
				}).finally(() => {
					this.reader.emit("issearching", false);
				});
			} else {
				// if the keyword is the same as the previous one, keep showing the result count
				resultCount.dom.style.display = "block";
				this.reader.emit("updatehighlightposition"); // update highlight position for search results
				this.reader.emit("issearching", false);
			}
			searchQuery = value;
		};

		// add search button in the search input box
		const searchBtn = new UIInput("button").setId("btn-search-input");
		searchBtn.dom.onclick = (e) => {
			search.dom.onsearch();
			e.preventDefault();
		};

		// search input box includes the search input bar and the search button
		const searchInputBox = new UIBox([search, searchBtn])
		searchInputBox.setId("search-input-box");

		// no results message
		const resultCount = new UISpan(strings.get("sidebar/search/noresults"));
		resultCount.setId("result-count");
		resultCount.dom.style.display = "none";

		this.setId("search");
		this.items = new UIList();
		this.items.listItems = [];
		container.add(this.items);
		this.add([searchInputBox, resultCount, container]);
		this.reader = reader;
		this.selector = undefined;
		this.searchQuery = undefined; // Store current search query

		// w3c
		search.dom.tabIndex = -1;
		this.items.dom.querySelectorAll("a").forEach(a => {
			a.tabIndex = -1;
		});
		
		this.reader.on("sidebaropener", (value) => {
			search.dom.tabIndex = value ? 0 : -1;
			this.items.dom.querySelectorAll("a").forEach(a => {
				a.tabIndex = value ? 0 : -1;
			});
		});

		this.reader.on("focussearchbar", () => {
			search.dom.focus();
		});

		this.reader.on("cancelsearch", () => {
			search.dom.value = "";
			search.dom.onsearch();
		});

		this.reader.on("prevsearchresult", () => {
			this.selectPrevNextItem("prev");
		});

		this.reader.on("nextsearchresult", () => {
			this.selectPrevNextItem("next");
		});

		this.reader.on("updatehighlightposition", () => {
			this.removeHighlights();
			this.addHighlights();
		});

		this.reader.on("issearching", (value) => {
			this._isSearching = value;
			if (value) {
				container.addClass("is-searching");
			} else {
				container.removeClass("is-searching");
			}
		});
	}

	addHighlights() {
		if (this._searchResults.length > 0) {
			this._searchResults.forEach(result => {
				if (result.cfi) {
					if (this._selectedSearchResult && this._selectedSearchResult.cfi === result.cfi) {
						this.reader.rendition.annotations.add('highlight', result.cfi, {}, undefined, "search-highlight-active", { "fill": "#f06f00", "fill-opacity": "0.45" });
					} else {
						this.reader.rendition.annotations.add('highlight', result.cfi, {}, undefined, "search-highlight");
					}
				}
			});
		}
	}

	removeHighlights() {
		const toRemove = [];
		Object.values(this.reader.rendition.annotations._annotations || {}).forEach(annotation => {
			if (annotation.className === 'search-highlight' || annotation.className === 'search-highlight-active') {
				toRemove.push({ cfiRange: annotation.cfiRange, type: annotation.type });
			}
		});
		toRemove.forEach(({ cfiRange, type }) => {
			this.reader.rendition.annotations.remove(cfiRange, type);
		});
	}

	/**
	 * Searching the entire book
	 * @param {*} q Query keyword
	 * @returns The search result array.
	 */
	async doSearch(q) {

		const book = this.reader.book;
		const maxResults = this.reader.settings.maxsearchresults || 100000;
		const allResults = [];

		q = q?.trim() || "";
		if (q == "." || q == "") {
			// block search for single dot (.)
			return await Promise.resolve(allResults);
		}
		
		// Search spine items sequentially and stop once it reaches the maximum number of results
		for (const item of book.spine.spineItems) {
			if (allResults.length >= maxResults) {
				break;
			}
			
			try {
				await item.load(book.load.bind(book));
				const itemResults = await item.find(q);
				if (itemResults && itemResults.length > 0) {
					const remaining = maxResults - allResults.length;
					const resultsToAdd = itemResults.slice(0, remaining);
					allResults.push(...resultsToAdd);
				}
			} finally {
				item.unload();
			}
		}

		this._searchResults = allResults; // store the search results for highlight
		
		// Add ePub.js annotation highlights for matched keywords in the entire book
		if (q && typeof this.reader.rendition !== "undefined" && typeof this.reader.rendition.annotations !== "undefined") {
			this.addHighlights();
		}
		return await Promise.resolve(allResults);
	}

	set(data) {

		const link = new UILink("#" + data.cfi, data.excerpt);
		// custom feature: highlight the keyword
		if (this.searchQuery) {
			link.dom.innerHTML = data.excerpt.replace(new RegExp(this.searchQuery, 'gi'), '<span class="highlight">' + this.searchQuery + '</span>');
		}
		const item = new UIItem();
		link.dom.onclick = () => {

			if (this.selector && this.selector !== item)
				this.selector.unselect();
			
			item.select();
			this.selector = item;
			this._selectedSearchResult = data;
			this.reader.emit("toggleViewerVisibility", false);
			this.reader.rendition.display(data.cfi).then(() => {
				setTimeout(() => {
					this.reader.rendition.display(data.cfi).finally(() => {
						this.reader.emit("toggleViewerVisibility", true);
						this.reader.emit("updatehighlightposition");
					});
				}, 1000);
			});

			// close sidebar for mobile
			if (this.reader.isMobile) {
				this.reader.emit("sidebaropener", false);
			}

			return false;
		};
		item.add(link);
		item.link = link; // reference the uiLink
		this.items.add(item);
		this.items.listItems.push(item); // reference the array of uiItem
	}

	// select the previous or next search result, used in the buttons in toolbar
	selectPrevNextItem(mode) { // mode: "prev" or "next"
		if (!this.selector) {
			// select the first item
			if (this.items.listItems.length > 0) {
				this.items.listItems[0].link.dom.onclick();
			}
			return;
		}
		// Find the index of the selector's DOM element (or its parent li)
		const currentIndex = this.items.listItems.indexOf(this.selector);
		if (currentIndex === -1) {
			// Selector not found, select first item
			if (this.items.listItems.length > 0) {
				this.items.listItems[0].link.dom.onclick();
			}
			return;
		}
		if (mode === "prev") {
			if (currentIndex > 0) {
				this.items.listItems[currentIndex - 1].link.dom.onclick();
			} else {
				this.items.listItems[this.items.listItems.length - 1].link.dom.onclick();
			}
		} else {
			if (currentIndex < this.items.listItems.length - 1) {
				this.items.listItems[currentIndex + 1].link.dom.onclick();
			} else {
				this.items.listItems[0].link.dom.onclick();
			}
		}
	}
}