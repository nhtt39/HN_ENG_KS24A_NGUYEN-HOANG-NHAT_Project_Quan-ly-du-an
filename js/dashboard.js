let btnSwitch = document.getElementById("openDetails");
btnSwitch.onclick = function (){
    window.location.href = 'http://127.0.0.1:5500/pages/category-manager.html'
}
let modal = document.getElementById("myAddScreen");
let btn = document.getElementById("openAddBtn");
let span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
  modal.style.display = "flex";
};

span.onclick = function () {
  modal.style.display = "none";
};

modal.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
let deleteModal = document.getElementById("myDeleteModal");
let deleteBtn = document.getElementById("openDeleteModal");
let deleteSpan = document.getElementsByClassName("closeDeleteModal")[0];

deleteBtn.onclick = function () {
  deleteModal.style.display = "flex";
};

deleteSpan.onclick = function () {
  deleteModal.style.display = "none";
};

deleteModal.onclick = function (event) {
  if (event.target == deleteModal) {
    deleteModal.style.display = "none";
  }
};