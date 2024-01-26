/**
 * @author mrdoob https://github.com/mrdoob/ui.js
 */

const ERROR_MSG = "is not an instance of UIElement.";

/**
 * UIElement
 * @param {string} tag
 */
export class UIElement {
	
	constructor(tag) {

		this.dom = document.createElement(tag); 
	}

	add() {

		for (let i = 0; i < arguments.length; i++) {

			const argument = arguments[i];

			if (argument instanceof UIElement) {

				this.dom.appendChild(argument.dom);

			} else if (Array.isArray(argument)) {

				for (let j = 0; j < argument.length; j++) {

					const element = argument[j];

					if (element instanceof UIElement) {

						this.dom.appendChild(element.dom);
					} else {

						console.error("UIElement:", element, ERROR_MSG);
					}
				}
			} else {

				console.error("UIElement:", argument, ERROR_MSG);
			}
		}
		return this;
	}

	remove() {

		for (let i = 0; i < arguments.length; i++) {

			const argument = arguments[i];

			if (argument instanceof UIElement) {

				this.dom.removeChild(argument.dom);

			} else if (Number.isInteger(argument)) {

				this.dom.removeChild(this.dom.childNodes[argument]);
			} else {

				console.error("UIElement:", argument, ERROR_MSG);
			}
		}
		return this;
	}

	clear() {

		while (this.dom.children.length) {

			this.dom.removeChild(this.dom.lastChild);
		}
		return this;
	}

	setId(id) {

		this.dom.id = id;
		return this;
	}

	getId() {

		return this.dom.id;
	}

	setClass(name) {

		this.dom.className = name;
		return this;
	}

	addClass(name) {

		this.dom.classList.add(name);
		return this;
	}

	removeClass(name) {

		this.dom.classList.remove(name);
		return this;
	}

	setStyle(key, value) {

		this.dom.style[key] = value;
		return this;
	}

	setTextContent(text) {

		this.dom.textContent = text;
		return this;
	}

	getBoundingClientRect() {

		return this.dom.getBoundingClientRect();
	}
}

/**
 * UISpan
 */
export class UISpan extends UIElement {

	constructor() {

		super("span");
	}
}

/**
 * UIDiv
 */
export class UIDiv extends UIElement {

	constructor() {

		super("div");
	}
}

/**
 * UIRow
 */
export class UIRow extends UIDiv {

	constructor() {

		super();

		this.dom.className = "row";
	}
}

/**
 * UIPanel
 */
export class UIPanel extends UIDiv {

	constructor() {

		super();

		this.dom.className = "panel";
	}
}

/**
 * UILabel
 * @param {string} text
 * @param {string} id
 */
export class UILabel extends UIElement {

	constructor(text, id) {

		super("label");

		this.dom.textContent = text;
		if (id) this.dom.htmlFor = id;
	}
}

/**
 * UILink
 * @param {string} href
 * @param {string} text
 */
export class UILink extends UIElement {

	constructor(href, text) {

		super("a");

		this.dom.href = href || "#";
		this.dom.textContent = text || "";
	}

	setHref(url) {

		this.dom.href = url;
		return this;
	}
}

/**
 * UIText
 * @param {string} text
 */
export class UIText extends UISpan {

	constructor(text) {

		super();

		this.dom.textContent = text;
	}

	getValue() {

		return this.dom.textContent;
	}

	setValue(text) {

		this.dom.textContent = text;
		return this;
	}
}

/**
 * UITextArea
 */
export class UITextArea extends UIElement {

	constructor() {

		super("textarea");

		this.dom.spellcheck = false;
		this.dom.onkeydown = (e) => {

			e.stopPropagation();

			if (e.key === "Tab") {

				const cursor = this.dom.selectionStart;
				this.dom.value = this.dom.value.substring(0, cursor) + "\t" + this.dom.value.substring(cursor);
				this.dom.selectionStart = cursor + 1;
				this.dom.selectionEnd = this.dom.selectionStart;
				e.preventDefault();
			}
		};
	}

	getValue() {

		return this.dom.value;
	}

	setValue(value) {

		this.dom.value = value;
		return this;
	}
}

/**
 * UISelect
 */
export class UISelect extends UIElement {

	constructor() {

		super("select");
	}

	setMultiple(boolean) {

		this.dom.multiple = boolean || false;
		return this;
	}

	setOptions(options) {

		const selected = this.dom.value;
		this.clear();

		for (const key in options) {

			const option = document.createElement("option");
			option.value = key;
			option.text = options[key];
			this.dom.appendChild(option);
		}
		this.dom.value = selected;
		return this;
	}

	getValue() {

		return this.dom.value;
	}

	setValue(value) {

		value = String(value);

		if (this.dom.value !== value)
			this.dom.value = value;
		return this;
	}
}

/**
 * UIInput
 * @param {*} type
 * @param {*} value
 * @param {*} title
 */
export class UIInput extends UIElement {

	constructor(type, value, title) {

		super("input");

		this.dom.type = type;
		this.dom.onkeydown = (e) => {

			e.stopPropagation();
		};
		this.setValue(value);
		this.setTitle(title);
	}

	getName() {

		return this.dom.name;
	}

	setName(name) {

		this.dom.name = name;
		return this;
	}

	getTitle() {

		return this.dom.title;
	}

	setTitle(title) {

		if (this.dom.title !== title && title)
			this.dom.title = title;
		return this;
	}

	getType() {

		return this.dom.type;
	}

	setType(type) {

		this.dom.type = type;
		return this;
	}

	getValue() {

		return this.dom.value;
	}

	setValue(value) {

		if (this.dom.value !== value && value)
			this.dom.value = value;
		return this;
	}
}

/**
 * UIColor
 */
export class UIColor extends UIElement {

	constructor() {

		super("input");

		try {

			this.dom.type = "color";
			this.dom.value = "#ffffff";

		} catch (e) {

			console.exception(e);
		}
	}

	getValue() {

		return this.dom.value;
	}

	getHexValue() {

		return parseInt(this.dom.value.substr(1), 16);
	}

	setValue(value) {

		this.dom.value = value;
		return this;
	}

	setHexValue(hex) {

		this.dom.value = "#" + ("000000" + hex.toString(16)).slice(-6);
		return this;
	}
}

/**
 * UINumber
 * @param {number} value
 * @param {number} step
 * @param {number} min
 * @param {number} max
 * @param {number} precision
 * @param {number} unit
 */
export class UINumber extends UIElement {

	constructor(value, step, min, max, precision, unit) {

		super("input");

		this.dom.type = "number";
		this.dom.step = step || 1;
		this.dom.onkeydown = (e) => {

			e.stopPropagation();
		};
		this.value = value || 0;
		this.min = min || -Infinity;
		this.max = max || +Infinity;
		this.precision = precision || 0;
		this.unit = unit;
		this.setValue(value);
		this.dom.onchange = (e) => {

			this.setValue(this.value);
		};
	}

	getName() {

		return this.dom.name;
	}

	setName(name) {

		this.dom.name = name;
		return this;
	}

	setPrecision(precision) {

		this.precision = precision;
		this.setValue(this.value);
		return this;
	}

	setRange(min, max) {

		this.min = min;
		this.max = max;
		this.dom.min = min;
		this.dom.max = max;
		return this;
	}

	setStep(step) {

		this.dom.step = step;
		return this;
	}

	setTitle(text) {

		this.dom.title = text;
		return this;
	}

	getValue() {

		return parseFloat(this.dom.value);
	}

	setValue(value) {

		if (value !== undefined) {
			value = parseFloat(value);

			if (value < this.min)
				value = this.min;
			if (value > this.max)
				value = this.max;

			this.value = value;
			this.dom.value = value.toFixed(this.precision);

			if (this.unit)
				this.dom.value += this.unit;
		}
		return this;
	}

	setUnit(unit) {

		this.unit = unit;
		this.setValue(this.value);
		return this;
	}
}

/**
 * UIBreak
 */
export class UIBreak extends UIElement {

	constructor() {

		super("br");
	}
}

/**
 * UIHorizontalRule
 */
export class UIHorizontalRule extends UIElement {

	constructor() {

		super("hr");
	}
}

/**
 * UIProgress
 * @param {*} value
 */
export class UIProgress extends UIElement {

	constructor(value) {

		super("progress");

		this.dom.value = value;
	}

	setValue(value) {

		this.dom.value = value;
		return this;
	}
}

/**
 * UITabbedPanel
 * @param {string} align (horizontal | vertical)
 */
export class UITabbedPanel extends UIDiv {

	constructor(align) {

		super();

		this.align = align || "horizontal";
		this.tabs = [];
		this.panels = [];
		this.selector = new UISpan().setClass("tab-selector");
		this.tabsDiv = new UIDiv().setClass("tabs");
		this.tabsDiv.add(this.selector);
		this.panelsDiv = new UIDiv().setClass("panels");
		this.selected = "";
		this.add(this.tabsDiv);
		this.add(this.panelsDiv);
	}

	addTab(id, label, items) {

		const tab = new UITab(label, this);
		tab.setId(id);
		tab.setClass("tab");
		this.tabs.push(tab);
		this.tabsDiv.add(tab);

		const panel = new UIDiv();
		panel.setId(id);
		panel.add(items);
		this.panels.push(panel);
		this.panelsDiv.add(panel);
		this.select(id);
	}

	select(id) {

		for (let tab of this.tabs) {
			if (tab.dom.id === id) {
				tab.addClass("selected");
				this.transformSelector(tab);
			} else if (tab.dom.id === this.selected) {
				tab.removeClass("selected");
			}
		}

		for (let panel of this.panels) {
			if (panel.dom.id === id) {
				panel.dom.style.display = "block";
			} else if (panel.dom.id === this.selected) {
				panel.dom.style.display = "none";
			}
		}

		this.selected = id;
		return this;
	}

	transformSelector(tab) {

		let size;
		const rect = tab.getBoundingClientRect();
		if (this.align === "horizontal") {
			size = rect.width * this.tabs.indexOf(tab);
			this.selector.dom.style.transform = `translateX(${size}px)`;
		} else {
			size = rect.height * this.tabs.indexOf(tab);
			this.selector.dom.style.transform = `translateY(${size}px)`;
		}
	}
}

/**
 * UITab
 * @param {*} label
 * @param {*} parent
 */
export class UITab extends UIDiv {

	constructor(label, parent) {

		super();
		const button = new UIInput("button");
		button.dom.title = label;
		this.dom.onclick = (e) => {

			parent.select(this.dom.id);
			e.preventDefault();
		};
		this.add(button);
	}
}

/**
 * UIList
 */
export class UIList extends UIElement {

	constructor() {

		super("ul");
	}
}

/**
 * UIListItem
 */
export class UIListItem extends UIElement {

	constructor() {

		super("li");
	}
}

/**
 * UITreeView
 */
export class UITreeView extends UIElement {

	constructor() {

		super("ul");
	}
}

/**
 * UITreeViewItem
 * @param {string} id
 * @param {UILink} link
 */
export class UITreeViewItem extends UIElement {

	constructor(id, link) {

		super("li");

		this.dom.id = id;
		this.link = link;
		this.toggle = new UISpan().setClass("toggle-collapsed");
		this.expander = new UIDiv().setId("expander");
		this.expanded = false;
		this.selected = false;
		this.add([this.expander, this.link]);
	}

	setItem(subItem) {

		this.add(subItem);
		this.toggle.dom.onclick = () => {

			if (this.expanded) {
				this.collaps();
			} else {
				this.expand();
			}
			return false;
		};
		this.expander.add(this.toggle);

		if (!this.expanded) {

			const items = subItem.dom.getElementsByTagName("li");
			for (let item of items) {
				if (item.className === "selected") {
					this.expand();
					break;
				}
			}
		}
	}

	select() {

		this.selected = true;
		this.setClass("selected");
	}

	unselect() {

		this.selected = false;
		this.dom.removeAttribute("class");
	}

	expand() {

		this.toggle.setClass("toggle-expanded");
		this.dom.children[2].style.display = "block";
		this.expanded = true;
	}

	collaps() {

		this.toggle.setClass("toggle-collapsed");
		this.dom.children[2].style.display = "none";
		this.expanded = false;
	}
}