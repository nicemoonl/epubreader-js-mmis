export class Strings {

	constructor(reader) {

		this.language = reader.settings.language || "en";
		this.values = {
			en: {
				"content/prev": "Previous chapter",
				"content/next": "Next chapter",

				"toolbar/sidebar": "Sidebar",
				"toolbar/prev": "Previous page",
				"toolbar/next": "Next page",
				"toolbar/openbook": "Open book",
				"toolbar/openbook/error": "Your browser does not support the required features.\nPlease use a modern browser such as Google Chrome, or Mozilla Firefox.",
				"toolbar/bookmark": "Add this page to bookmarks",
				"toolbar/settings": "Settings",
				"toolbar/fullscreen": "Fullscreen",
				"toolbar/zoom-in": "Zoom in",
				"toolbar/zoom-out": "Zoom out",
				"toolbar/flow/paginated": "Page Flow: Paginated",
				"toolbar/flow/scrolled": "Page Flow: Scrolled",
				"toolbar/spread/none": "Page Spread: Off",
				"toolbar/spread/auto": "Page Spread: Auto",
				"toolbar/search": "Search",
				"toolbar/cancelsearch": "Cancel search",
				"toolbar/prevsearch": "Previous result",
				"toolbar/nextsearch": "Next result",
				"sidebar/search/resultcount": "Number of results: {count}",
				"sidebar/search/noresults": "No related search results",


				"sidebar/close": "Close Sidebar",
				"sidebar/contents": "Contents",
				"sidebar/bookmarks": "Bookmarks",
				"sidebar/bookmarks/add": "Add",
				"sidebar/bookmarks/remove": "Remove",
				"sidebar/bookmarks/clear": "Clear",
				"sidebar/annotations": "Annotations",
				"sidebar/annotations/add": "Add",
				"sidebar/annotations/remove": "Remove",
				"sidebar/annotations/clear": "Clear",
				"sidebar/annotations/anchor": "Anchor",
				"sidebar/annotations/cancel": "Cancel",
				"sidebar/search": "Search",
				"sidebar/search/placeholder": "Search in the book",
				"sidebar/settings": "Settings",
				"sidebar/settings/language": "Language",
				"sidebar/settings/fontsize": "Font size (%)",
				"sidebar/settings/flow": "Flow",
				"sidebar/settings/flow/paginated": "Paginated",
				"sidebar/settings/flow/scrolled": "Scrolled",
				"sidebar/settings/pagination": ["Pagination", "Generate pagination"],
				"sidebar/settings/spread": "Spread",
				"sidebar/settings/spread/none": "None",
				"sidebar/settings/spread/auto": "Auto",
				"sidebar/settings/spread/minwidth": "Minimum spread width",
				"sidebar/metadata": "Metadata",
				"sidebar/metadata/title": "Title",
				"sidebar/metadata/creator": "Creator",
				"sidebar/metadata/description": "Description",
				"sidebar/metadata/pubdate": "Pubdate",
				"sidebar/metadata/publisher": "Publisher",
				"sidebar/metadata/identifier": "Identifier",
				"sidebar/metadata/language": "Language",
				"sidebar/metadata/rights": "Rights",
				"sidebar/metadata/modified_date": "Modified date",
				"sidebar/metadata/layout": "Layout", // rendition:layout
				"sidebar/metadata/flow": "Flow", // rendition:flow
				"sidebar/metadata/spread": "Spread", // rendition:spread
				"sidebar/metadata/direction": "Direction", // page-progression-direction

				"notedlg/label": "Note",
				"notedlg/add": "Add"
			},
			tc: {
				"content/prev": "上一章",
				"content/next": "下一章",

				"toolbar/sidebar": "側邊欄",
				"toolbar/prev": "上一頁",
				"toolbar/next": "下一頁",
				"toolbar/openbook": "打開書籍",
				"toolbar/openbook/error": "您的瀏覽器不支持所需功能。\n請使用現代瀏覽器如Google Chrome或Firefox。",
				"toolbar/bookmark": "新增書籤",
				"toolbar/settings": "設置",
				"toolbar/fullscreen": "全螢幕",
				"toolbar/zoom-in": "放大",
				"toolbar/zoom-out": "縮小",
				"toolbar/flow/paginated": "翻頁模式: 分頁",
				"toolbar/flow/scrolled": "翻頁模式: 滾動",
				"toolbar/spread/none": "雙頁佈局: 單頁",
				"toolbar/spread/auto": "雙頁佈局: 自動",
				"toolbar/search": "搜索",
				"toolbar/cancelsearch": "取消搜索",
				"toolbar/prevsearch": "上一結果",
				"toolbar/nextsearch": "下一結果",
				"sidebar/search/resultcount": "搜尋結果數量︰{count}",
				"sidebar/search/noresults": "無相關搜尋結果",


				"sidebar/close": "關閉側邊欄",
				"sidebar/contents": "目錄",
				"sidebar/bookmarks": "書籤",
				"sidebar/bookmarks/add": "添加",
				"sidebar/bookmarks/remove": "移除",
				"sidebar/bookmarks/clear": "清空",
				"sidebar/annotations": "註解",
				"sidebar/annotations/add": "添加",
				"sidebar/annotations/remove": "移除",
				"sidebar/annotations/clear": "清空",
				"sidebar/annotations/anchor": "固定",
				"sidebar/annotations/cancel": "取消",

				"sidebar/search": "搜索",
				"sidebar/search/placeholder": "搜索內文",
				"sidebar/settings": "設置",
				"sidebar/settings/language": "語言",
				"sidebar/settings/fontsize": "字體大小 (%)",
				"sidebar/settings/flow": "瀏覽模式", // Scrolled = "滾動模式"
				"sidebar/settings/flow/paginated": "分頁模式",
				"sidebar/settings/flow/scrolled": "滾動模式",
				"sidebar/settings/pagination": ["分頁模式", "生成分頁"], 
				"sidebar/settings/spread": "雙頁佈局",
				"sidebar/settings/spread/none": "單頁",
				"sidebar/settings/spread/auto": "自動",
				"sidebar/settings/spread/minwidth": "最小雙頁寬度",
				"sidebar/metadata": "書籍詳情",
				"sidebar/metadata/title": "標題",
				"sidebar/metadata/creator": "作者",
				"sidebar/metadata/description": "描述",
				"sidebar/metadata/pubdate": "出版日期",
				"sidebar/metadata/publisher": "出版商",
				"sidebar/metadata/identifier": "標識符",
				"sidebar/metadata/language": "語言",
				"sidebar/metadata/rights": "版權",
				"sidebar/metadata/modified_date": "修改日期",
				"sidebar/metadata/layout": "佈局",  // rendition:layout
				"sidebar/metadata/flow": "瀏覽模式",  // rendition:flow
				"sidebar/metadata/spread": "雙頁佈局",  // rendition:spread
				"sidebar/metadata/direction": "閱讀方向",  // page-progression-direction

				"notedlg/label": "筆記",
				"notedlg/add": "添加"
			},
			sc: {
				"content/prev": "上一章",
				"content/next": "下一章",

				"toolbar/sidebar": "侧边栏",
				"toolbar/prev": "上一页",
				"toolbar/next": "下一页",
				"toolbar/openbook": "打开书籍",
				"toolbar/openbook/error": "您的浏览器不支持所需功能。\n请使用现代浏览器如谷歌Chrome或火狐Firefox。",
				"toolbar/bookmark": "加为书签",
				"toolbar/settings": "设置",
				"toolbar/fullscreen": "全屏",
				"toolbar/zoom-in": "放大",
				"toolbar/zoom-out": "缩小",
				"toolbar/flow/paginated": "翻页模式: 分页",
				"toolbar/flow/scrolled": "翻页模式: 滚动",
				"toolbar/spread/none": "双页布局: 单页",
				"toolbar/spread/auto": "双页布局: 自动",
				"toolbar/search": "搜索",
				"toolbar/cancelsearch": "取消搜索",
				"toolbar/prevsearch": "上一结果",
				"toolbar/nextsearch": "下一结果",
				"sidebar/search/resultcount": "搜索结果数量︰{count}",
				"sidebar/search/noresults": "没有相关搜索结果",

				"sidebar/close": "关闭侧边栏",
				"sidebar/contents": "目录",
				"sidebar/bookmarks": "书签",
				"sidebar/bookmarks/add": "添加",
				"sidebar/bookmarks/remove": "移除",
				"sidebar/bookmarks/clear": "清空",
				"sidebar/annotations": "注解",
				"sidebar/annotations/add": "添加",
				"sidebar/annotations/remove": "移除",
				"sidebar/annotations/clear": "清空",
				"sidebar/annotations/anchor": "锚定",
				"sidebar/annotations/cancel": "取消",

				"sidebar/search": "搜索",
				"sidebar/search/placeholder": "搜索內文",
				"sidebar/settings": "设置",
				"sidebar/settings/language": "语言",
				"sidebar/settings/fontsize": "字体大小 (%)",
				"sidebar/settings/flow": "流模式", // Scrolled = "滚动模式"
				"sidebar/settings/flow/paginated": "分页模式",
				"sidebar/settings/flow/scrolled": "滚动模式",
				"sidebar/settings/pagination": ["分页模式", "生成分页"], 
				"sidebar/settings/spread": "双页布局",
				"sidebar/settings/spread/none": "关闭",
				"sidebar/settings/spread/auto": "自动",
				"sidebar/settings/spread/minwidth": "最小双页宽度",
				"sidebar/metadata": "元数据",
				"sidebar/metadata/title": "标题",
				"sidebar/metadata/creator": "作者",
				"sidebar/metadata/description": "描述",
				"sidebar/metadata/pubdate": "出版日期",
				"sidebar/metadata/publisher": "出版商",
				"sidebar/metadata/identifier": "标识符",
				"sidebar/metadata/language": "语言",
				"sidebar/metadata/rights": "版权",
				"sidebar/metadata/modified_date": "修改日期",
				"sidebar/metadata/layout": "布局",  // rendition:layout
				"sidebar/metadata/flow": "流模式",  // rendition:flow
				"sidebar/metadata/spread": "双页布局",  // rendition:spread
				"sidebar/metadata/direction": "阅读方向",  // page-progression-direction

				"notedlg/label": "笔记",
				"notedlg/add": "添加"
			},
		};

		reader.on("languagechanged", (value) => {
			this.language = value;
		});
	}

	get(key) { return this.values[this.language][key] || "???"; }
}