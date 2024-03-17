const form = document.getElementById("form");
const webUrl = document.getElementById("webUrl");
const webName = document.getElementById("webName");
const bookmark = document.getElementById("bookmark");
function handleFormSubmit(event) {
  event.preventDefault();

  const bookmarkDetails = {
    websiteTitle: webName.value,
    websiteURL: webUrl.value,
  };
  axios
    .post(
      "https://crudcrud.com/api/571dc3008d1345e1ab4b3dddbd4aeac2/bookmarkLinks",
      bookmarkDetails
    )
    .then((response) => {
      getDataFromServer();
    })
    .catch((error) => console.log(error));
}
function getDataFromServer() {
  axios
    .get(
      "https://crudcrud.com/api/571dc3008d1345e1ab4b3dddbd4aeac2/bookmarkLinks"
    )
    .then((response) => {
      showDataOnScreen(response.data);
    })
    .catch((error) => console.log(error));
}

function showDataOnScreen(bookmarkData) {
  bookmark.innerHTML = "";
  bookmarkData.forEach((data) => {
    const div = document.createElement("div");
    div.innerHTML = `<label>${data.websiteTitle} ></label>
      <a href=${data.websiteURL}  target="_blank">${data.websiteURL}</a>
      <button class="deleteBtn" data-id = "${data._id}">Delete</button>
      <button class="editBtn" data-id="${data._id}">Edit</button>
      <div class="editForm" style="display: none;">
        <input type="text" class="editName" value="${data.websiteTitle}">
        <input type="text" class="editUrl" value="${data.websiteURL}">
        <button class="saveBtn" data-id="${data._id}">Save</button>
        <button class="cancelBtn" data-id="${data._id}">Cancel</button>
      </div>`;
    bookmark.appendChild(div);
  });

  bookmark.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("editBtn")) {
      const editForm = target.nextElementSibling;
      editForm.style.display = "block";
    } else if (target.classList.contains("saveBtn")) {
      const editForm = target.parentElement;
      const bookmarkId = target.getAttribute("data-id");
      const newName = editForm.querySelector(".editName").value;
      const newUrl = editForm.querySelector(".editUrl").value;
      saveBookmarkChanges(bookmarkId, newName, newUrl);
    } else if (target.classList.contains("cancelBtn")) {
      const editForm = target.parentElement;
      editForm.style.display = "none";
    }
  });

  document.querySelectorAll(".deleteBtn").forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", () => {
      const bookmarkId = deleteBtn.getAttribute("data-id");

      deleteBookmark(bookmarkId);
    });
  });
}

function saveBookmarkChanges(bookmarkId, newName, newUrl) {
  const updatedBookmarkDetails = {
    websiteTitle: newName,
    websiteURL: newUrl,
  };

  axios
    .put(
      `https://crudcrud.com/api/571dc3008d1345e1ab4b3dddbd4aeac2/bookmarkLinks/${bookmarkId}`,
      updatedBookmarkDetails
    )
    .then((response) => {
      getDataFromServer(); // Refresh bookmarks after deletion
      console.log("Bookmark deleted successfully");
    })
    .catch((error) => console.log(error));
}

function deleteBookmark(bookmarkId) {
  axios
    .delete(
      `https://crudcrud.com/api/571dc3008d1345e1ab4b3dddbd4aeac2/bookmarkLinks/${bookmarkId}`
    )
    .then((response) => {
      getDataFromServer(); // Refresh bookmarks after deletion
      console.log("Bookmark deleted successfully");
    })
    .catch((error) => console.error("Error deleting bookmark:", error));
}

window.addEventListener("DOMContentLoaded", getDataFromServer);
form.addEventListener("submit", handleFormSubmit);
