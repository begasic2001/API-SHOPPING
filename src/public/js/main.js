$("tbody").sortable({
	items: "tr:not('.home')",
	placeholder: "ui-state-hightlight",
	update: function () {
		var ids = $("tbody").sortable("serialize");
		var url = "/api/page/reorder-page";

		$.post(url, ids);
	},
});

$(function () {
	if ($("textarea#content").length) {
		CKEDITOR.replace("content");
	}
	$("a.confirmDeletion").on("click", function () {
		if (!confirm("Are you sure delete ?")) return false;
	});
	if ($("a.gallery").length) {
		$("a.gallery").fancybox();
	}
});
