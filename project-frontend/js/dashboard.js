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
let deleteSpan = document.getElementsByClassName("closeDeleteModal")[0];
let deleteIndex = null;

const cancelDeleteBtn = document.querySelector(".btn-cancelDeleteModal");
const confirmDeleteBtn = document.querySelector(".btn-deleteDeleteModal");

cancelDeleteBtn.onclick = () => {
  deleteModal.style.display = "none";
  deleteIndex = null;
};

confirmDeleteBtn.onclick = () => {
  if (deleteIndex !== null) {
    projects.splice(deleteIndex, 1);
    renderProjects();
    deleteModal.style.display = "none";
  }
};

deleteSpan.onclick = function () {
  deleteModal.style.display = "none";
};

deleteModal.onclick = function (event) {
  if (event.target == deleteModal) {
    deleteModal.style.display = "none";
  }
};

let projects = [
  { name: "Xây dựng website thương mại điện tử", desc: "" },
  { name: "Phát triển ứng dụng di động", desc: "" },
  { name: "Quản lý dữ liệu khách hàng", desc: "" },
  { name: "Xây dựng website thương mại điện tử", desc: "" },
  { name: "Phát triển ứng dụng di động", desc: "" },
  { name: "Quản lý dữ liệu khách hàng", desc: "" },
  { name: "Xây dựng website thương mại điện tử", desc: "" },
  { name: "Phát triển ứng dụng di động", desc: "" },
  { name: "Quản lý dữ liệu khách hàng", desc: "" },
];

const projectTableBody = document.querySelector("table tbody");
const saveBtn = document.querySelector(".btn-save");

function renderProjects(filtered = projects) {
  projectTableBody.innerHTML = "";
  filtered.forEach((project, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td class="th-1">${project.name}</td>
      <td>
        <button class="edit">Sửa</button>
        <button class="delete">Xóa</button>
        <button class="details">Chi tiết</button>
      </td>
    `;
    row.querySelector(".delete").onclick = () => {
      deleteIndex = index;
      deleteModal.style.display = "flex";
    };
    row.querySelector(".details").onclick = () => {
      window.location.href = "./category-manager.html";
    };
    projectTableBody.appendChild(row);
  });
}

renderProjects();

saveBtn.onclick = () => {
  const nameInput = document.getElementById("project-name");
  const descInput = document.getElementById("project-desc");
  const name = nameInput.value.trim();
  const desc = descInput.value.trim();

  if (name === "") {
    alert("Tên dự án không được để trống");
    return;
  }

  const exists = projects.some(project => project.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    alert("Tên dự án đã tồn tại");
    return;
  }

  projects.push({ name, desc });
  renderProjects();
  modal.style.display = "none";
  nameInput.value = "";
  descInput.value = "";
};

const searchInput = document.querySelector(".search-bar");
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.trim().toLowerCase();
  const filtered = projects.filter(p => p.name.toLowerCase().includes(keyword));
  renderProjects(filtered);
});