$('tbody').sortable({

    items: "tr:not('.home')",
    placeholder: "ui-state-hightlight",
    update: function () {
        var ids = $('tbody').sortable("serialize");
        var url = "/admin/reorder-page";
        
        $.post(url, ids);
    }

});
