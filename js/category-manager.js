let modal = document.getElementById("myAddScreen");
let btn = document.getElementById("openAddModal");
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

let addMemberModal = document.getElementById("myAddMemberScreen");
let addMemberBtn = document.getElementById("openAddMemberModal");
let memberSpan = document.getElementsByClassName("closeMemberModal")[0];

addMemberBtn.onclick = function () {
  addMemberModal.style.display = "flex";
};

memberSpan.onclick = function () {
  addMemberModal.style.display = "none";
};

addMemberModal.onclick = function (event) {
  if (event.target == addMemberModal) {
    addMemberModal.style.display = "none";
  }
};
