let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "/pages/login.html";
}

const logoutLink = document.querySelector(".logout");
if (logoutLink) {
    logoutLink.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.removeItem("currentUser");
        window.location.href = "./login.html";
    });
}

let modal = document.getElementById("myAddScreen");
let btn = document.getElementById("openAddBtn");
let span = document.getElementsByClassName("close")[0];
btn.onclick = function () {
    openAddProjectModal();
};
span.onclick = function () {
    closeModal();
};
modal.onclick = function (event) {
    if (event.target == modal) closeModal();
};

function closeModal() {
    modal.style.display = "none";
    document.getElementById("project-name").value = "";
    document.getElementById("project-desc").value = "";
    document.querySelector(".error-message").classList.add("hidden");
    editIndex = null;
}

function openAddProjectModal() {
    editIndex = null;
    document.getElementById("project-name").value = "";
    document.getElementById("project-desc").value = "";
    document.querySelector(".error-message").classList.add("hidden"); 
    modal.style.display = "flex";
}

document.querySelectorAll(".btn-cancel").forEach(btn => {
    btn.onclick = () => closeModal();
});

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
        const userProjects = getUserProjects();
        userProjects.splice(deleteIndex, 1);
        updateAllProjects(userProjects);
        renderProjects();
        deleteModal.style.display = "none";
        deleteIndex = null;
    }
};
deleteSpan.onclick = function () {
    deleteModal.style.display = "none";
};
deleteModal.onclick = function (event) {
    if (event.target == deleteModal) deleteModal.style.display = "none";
};

let allProjects = JSON.parse(localStorage.getItem("projects")) || [];

function getUserProjects() {
    return allProjects.filter(p => p.userId === currentUser.id);
}

function updateAllProjects(newUserProjects) {
    const otherProjects = allProjects.filter(p => p.userId !== currentUser.id);
    allProjects = [...otherProjects, ...newUserProjects];
    localStorage.setItem("projects", JSON.stringify(allProjects));
}

const ITEMS_PER_PAGE = 5;
let currentPage = 1;
let editIndex = null;

const projectTableBody = document.querySelector("table tbody");
const saveBtn = document.querySelector(".btn-save");
const paginationContainer = document.querySelector(".pagination");



function renderProjects(filteredProjects = null) {
  const userProjects = getUserProjects();
  const projectsToRender = filteredProjects || userProjects;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginated = projectsToRender.slice(start, end);

  projectTableBody.innerHTML = "";
  paginated.forEach((project, index) => {
      const realIndex = start + index;
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${realIndex + 1}</td>
          <td class="th-1">${project.name}</td>
          <td>
              <button class="edit">Sửa</button>
              <button class="delete">Xóa</button>
              <button class="details">Chi tiết</button>
          </td>
      `;

      row.querySelector(".delete").onclick = () => {
          deleteIndex = realIndex;
          deleteModal.style.display = "flex";
      };

      row.querySelector(".details").onclick = () => {
          localStorage.setItem("selectedProject", JSON.stringify(userProjects[realIndex]));
          window.location.href = "./category-manager.html";
      };

      row.querySelector(".edit").onclick = () => {
          editIndex = realIndex;
          const nameInput = document.getElementById("project-name");
          const descInput = document.getElementById("project-desc");
          nameInput.value = project.name;
          descInput.value = project.desc;
          modal.style.display = "flex";
      };

      projectTableBody.appendChild(row);
  });

  renderPagination(projectsToRender.length);
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    paginationContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.className = "page-btn" + (i === currentPage ? " active" : "");
        btn.innerText = i;
        btn.onclick = () => {
            currentPage = i;
            renderProjects();
        };
        paginationContainer.appendChild(btn);
    }

    if (currentPage < totalPages) {
        const nextBtn = document.createElement("button");
        nextBtn.className = "page-btn";
        nextBtn.innerText = ">";
        nextBtn.onclick = () => {
            currentPage++;
            renderProjects();
        };
        paginationContainer.appendChild(nextBtn);
    }
}

saveBtn.onclick = () => {
    const nameInput = document.getElementById("project-name");
    const descInput = document.getElementById("project-desc");
    const errorMessage = document.querySelector(".error-message");
    const name = nameInput.value.trim();
    const desc = descInput.value.trim();

    errorMessage.classList.add("hidden");

    if (name === "") {
        errorMessage.textContent = "Tên dự án không được để trống";
        errorMessage.classList.remove("hidden");
        return;
    }

    let userProjects = getUserProjects();
    const exists = userProjects.some((project, idx) =>
        project.name.toLowerCase() === name.toLowerCase() && idx !== editIndex
    );
    if (exists) {
        errorMessage.textContent = "Tên dự án đã tồn tại";
        errorMessage.classList.remove("hidden");
        return;
    }

    if (editIndex !== null) {
        userProjects[editIndex].name = name;
        userProjects[editIndex].desc = desc;
        editIndex = null;
    } else {
      userProjects.push({
        id: Date.now().toString(),
        name,
        desc,
        userId: currentUser.id,
    });
    }

    updateAllProjects(userProjects);
    renderProjects();
    closeModal();
};

const searchInput = document.querySelector(".search-bar");
searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.trim().toLowerCase();
    const userProjects = getUserProjects();
    const filtered = userProjects.filter(p =>
        p.name.toLowerCase().includes(keyword)
    );
    currentPage = 1;
    renderProjects(filtered);
});

renderProjects();