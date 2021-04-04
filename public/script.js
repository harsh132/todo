function $(id) {
	return document.getElementById(id);
}

list = document.querySelector(".list");
const itemObj = {};

function api(url, obj) {
	return fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(obj),
	});
}

function getItems() {
	fetch("/api/get")
		.then(data => data.json())
		.then(items => {
			list.innerHTML = "";
			items.forEach(({ _id, done, item }) => {
				itemObj[_id] = { item: item, done: done };
				list.innerHTML += `<div class="item" id="${_id}">
                <div${done ? ' style="text-decoration: line-through"' : ""}>${item}</div>
                <i class="gg-check-r complete" onclick="done('${_id}')"></i>
                <i class="gg-edit-markup edit" onclick="edit('${_id}')"></i>
                <i class="gg-close-r delete" onclick="del('${_id}')"></i>
            </div>`;
			});
		});
}

$("new").addEventListener("submit", function (e) {
	e.preventDefault();
	api("/api/add", { item: $("newTodo").value }).then(getItems);
	$("newTodo").value = "";
});

function done(id) {
	api("/api/done", { id: id }).then(getItems);
}

function del(id) {
	api("/api/delete", { id: id }).then(getItems);
}

function edit(id) {
	$(id).innerHTML = `<input type="text" id="in${id}" value="${itemObj[id].item}" />
    <i class="gg-check-r complete" onclick="editconfirm('${id}')"></i>
    <i class="gg-close-r delete" onclick="editcancel('${id}')"></i>`;
	$("in" + id).focus();
	$(id).style.border = "1px solid #666";
}

function editcancel(id) {
	$(id).innerHTML = `<div${itemObj[id].done ? ' style="text-decoration: line-through"' : ""}>${itemObj[id].item}</div>
    <i class="gg-check-r complete" onclick="done('${id}')"></i>
    <i class="gg-edit-markup edit" onclick="edit('${id}')"></i>
    <i class="gg-close-r delete" onclick="del('${id}')"></i>`;
	$(id).style.border = "0";
}

function editconfirm(id) {
	api("api/edit", { id: id, item: $("in" + id).value }).then(getItems);
}
