import { UITabbedPanel } from './ui.js';
import { TocPanel } from './sidebar/toc.js';
import { BookmarksPanel } from './sidebar/bookmarks.js';
import { AnnotationsPanel } from './sidebar/annotations.js';
import { SearchPanel } from './sidebar/search.js';
import { SettingsPanel } from './sidebar/settings.js';

export class Sidebar {

	constructor(reader) {

		const strings = reader.strings;
		const tabs = [
			strings.get('sidebar/contents'),
			strings.get('sidebar/bookmarks'),
			strings.get('sidebar/annotations'),
			strings.get('sidebar/search'),
			strings.get('sidebar/settings')
		];

		const container = new UITabbedPanel('vertical').setId('sidebar');

		container.addTab('tab-t', tabs[0], new TocPanel(reader));
		container.addTab('tab-b', tabs[1], new BookmarksPanel(reader));
		container.addTab('tab-n', tabs[2], new AnnotationsPanel(reader));
		container.addTab('tab-s', tabs[3], new SearchPanel(reader));
		container.addTab('tab-c', tabs[4], new SettingsPanel(reader));
		container.select('tab-t');

		document.body.appendChild(container.dom);
	}
}
