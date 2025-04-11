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

let selectedProject = JSON.parse(localStorage.getItem("selectedProject"));

function displayProjectDetails() {
    const projectTitle = document.querySelector(".box-1 h2");
    const projectDesc = document.querySelector(".box-1 p");
    if (selectedProject) {
        projectTitle.textContent = selectedProject.name;
        projectDesc.textContent = selectedProject.desc || "Không có mô tả.";
    } else {
        projectTitle.textContent = "Không có dự án được chọn";
        projectDesc.textContent = "Vui lòng quay lại trang danh sách dự án và chọn một dự án.";
    }
}

let modal = document.getElementById("myAddScreen");
let btn = document.getElementById("openAddModal");
let span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
    openAddTaskModal();
};

span.onclick = function () {
    closeModal();
};

modal.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
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

let memberListModal = document.getElementById("memberListModal");
let memberListSpan = document.getElementsByClassName("closeMemberListModal")[0];
let addMemberBtnInModal = document.querySelector(".btn-add-member");
let closeMemberListBtn = document.querySelector(".btn-close-member-list");

const optionsBtn = document.querySelector(".btn-options");
optionsBtn.onclick = function () {
    renderMembers();
    memberListModal.style.display = "flex";
};

memberListSpan.onclick = function () {
    memberListModal.style.display = "none";
};

closeMemberListBtn.onclick = function () {
    memberListModal.style.display = "none";
};

addMemberBtnInModal.onclick = function () {
    memberListModal.style.display = "none";
    addMemberModal.style.display = "flex";
};

memberListModal.onclick = function (event) {
    if (event.target == memberListModal) {
        memberListModal.style.display = "none";
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
        const projectTasks = getProjectTasks();
        projectTasks.splice(deleteIndex, 1);
        updateAllTasks(projectTasks);
        renderTasks();
        deleteModal.style.display = "none";
        deleteIndex = null;
    }
};

deleteSpan.onclick = function () {
    deleteModal.style.display = "none";
    deleteIndex = null;
};

deleteModal.onclick = function (event) {
    if (event.target == deleteModal) {
        deleteModal.style.display = "none";
        deleteIndex = null;
    }
};

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let members = JSON.parse(localStorage.getItem("members")) || [];
let editTaskIndex = null;
let currentSort = "";
let currentSearch = "";

function getProjectMembers() {
    return members.filter(member => member.projectId === selectedProject?.id);
}

function updateAllMembers(newMembers) {
    const otherMembers = members.filter(member => member.projectId !== selectedProject?.id);
    members = [...otherMembers, ...newMembers];
    localStorage.setItem("members", JSON.stringify(members));
}

function renderMembers() {
    const projectMembers = getProjectMembers();
    
    const memberList = document.querySelector(".member-list");
    memberList.innerHTML = "";
    projectMembers.forEach(member => {
        const initials = member.name.split(" ").map(n => n[0]).join("").toUpperCase();
        memberList.innerHTML += `
            <div class="member me-3">
                <div class="badge bg-${member.role === "Project owner" ? "primary" : member.role === "Frontend Developer" ? "secondary" : "warning"} rounded-circle p-3">${initials}</div>
                <span>${member.name}<br />${member.role}</span>
            </div>
        `;
    });

    const memberListContent = document.querySelector(".modal-body-member-list .member-list-content");
    memberListContent.innerHTML = "";
    projectMembers.forEach(member => {
        const initials = member.name.split(" ").map(n => n[0]).join("").toUpperCase();
        memberListContent.innerHTML += `
            <div class="member-item">
                <div class="member-info">
                    <div class="badge bg-${member.role === "Project owner" ? "primary" : member.role === "Frontend Developer" ? "secondary" : "warning"} rounded-circle p-2">${initials}</div>
                    <span>${member.name}<br /><a href="mailto:${member.email}">${member.email}</a></span>
                </div>
                <span class="member-role">${member.role}</span>
                <div class="member-actions">
                    <button class="btn btn-danger btn-sm delete-member" data-id="${member.id}">Xóa</button>
                </div>
            </div>
        `;
    });

    document.querySelectorAll(".delete-member").forEach(btn => {
        btn.onclick = function () {
            const memberId = btn.getAttribute("data-id");
            const projectMembers = getProjectMembers();
            const newMembers = projectMembers.filter(member => member.id !== memberId);
            updateAllMembers(newMembers);
            renderMembers();
            updateAssigneeDropdown();
        };
    });
}

const addMemberSaveBtn = document.querySelector("#myAddMemberScreen .save");
addMemberSaveBtn.onclick = () => {
    const emailInput = document.getElementById("email");
    const roleInput = document.getElementById("role");
    const errorMessage = document.querySelector("#myAddMemberScreen .error-message");
    
    const email = emailInput.value.trim();
    const role = roleInput.value.trim();
    const name = email.split("@")[0]; 

    errorMessage.classList.add("hidden");

    if (!email || !role) {
        errorMessage.textContent = "Email và vai trò không được để trống.";
        errorMessage.classList.remove("hidden");
        return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        errorMessage.textContent = "Email không hợp lệ.";
        errorMessage.classList.remove("hidden");
        return;
    }

    const projectMembers = getProjectMembers();
    if (projectMembers.some(member => member.email.toLowerCase() === email.toLowerCase())) {
        errorMessage.textContent = "Email đã tồn tại trong dự án.";
        errorMessage.classList.remove("hidden");
        return;
    }

    const newMember = {
        id: Date.now().toString(),
        name,
        email,
        role,
        projectId: selectedProject?.id
    };

    projectMembers.push(newMember);
    updateAllMembers(projectMembers);
    renderMembers();
    updateAssigneeDropdown();
    addMemberModal.style.display = "none";
    emailInput.value = "";
    roleInput.value = "";
};

function updateAssigneeDropdown() {
    const assigneeSelect = document.getElementById("assignee");
    const projectMembers = getProjectMembers();
    assigneeSelect.innerHTML = '<option value="" disabled selected>Chọn người phụ trách</option>';
    projectMembers.forEach(member => {
        assigneeSelect.innerHTML += `<option value="${member.name}">${member.name}</option>`;
    });
}

function getProjectTasks() {
    let filteredTasks = tasks.filter(task => task.projectId === selectedProject?.id);

    if (currentSearch) {
        filteredTasks = filteredTasks.filter(task =>
            task.name.toLowerCase().includes(currentSearch.toLowerCase())
        );
    }

    if (currentSort === "priority") {
        const priorityOrder = { "Cao": 1, "Trung bình": 2, "Thấp": 3 };
        filteredTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (currentSort === "dueDate") {
        filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    return filteredTasks;
}

function updateAllTasks(newProjectTasks) {
    const otherTasks = tasks.filter(task => task.projectId !== selectedProject?.id);
    tasks = [...otherTasks, ...newProjectTasks];
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

const MIN_TASK_NAME_LENGTH = 5;
const MAX_TASK_NAME_LENGTH = 50;

function validateTask(task) {
    const errorMessage = document.querySelector(".modal-content .error-message") || document.createElement("p");
    errorMessage.className = "error-message";
    errorMessage.style.color = "red";
    errorMessage.classList.add("hidden");
    document.querySelector(".modal-content").insertBefore(errorMessage, document.querySelector(".buttons"));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(task.startDate);
    const dueDate = new Date(task.dueDate);

    if (!task.name || !task.assignee || !task.status || !task.startDate || !task.dueDate || !task.priority || !task.progress) {
        errorMessage.textContent = "Tất cả các trường không được để trống.";
        errorMessage.classList.remove("hidden");
        return false;
    }

    if (task.name.length < MIN_TASK_NAME_LENGTH || task.name.length > MAX_TASK_NAME_LENGTH) {
        errorMessage.textContent = `Tên nhiệm vụ phải từ ${MIN_TASK_NAME_LENGTH} đến ${MAX_TASK_NAME_LENGTH} ký tự.`;
        errorMessage.classList.remove("hidden");
        return false;
    }

    const projectTasks = getProjectTasks();
    if (projectTasks.some((t, idx) => t.name.toLowerCase() === task.name.toLowerCase() && idx !== editTaskIndex)) {
        errorMessage.textContent = "Tên nhiệm vụ đã tồn tại.";
        errorMessage.classList.remove("hidden");
        return false;
    }

    if (startDate <= today) {
        errorMessage.textContent = "Ngày bắt đầu phải lớn hơn ngày hiện tại.";
        errorMessage.classList.remove("hidden");
        return false;
    }

    if (dueDate <= startDate) {
        errorMessage.textContent = "Hạn chót phải lớn hơn ngày bắt đầu.";
        errorMessage.classList.remove("hidden");
        return false;
    }

    return true;
}

function openAddTaskModal() {
    editTaskIndex = null;
    document.getElementById("task-name").value = "";
    document.getElementById("assignee").value = "";
    document.getElementById("status").value = "";
    document.getElementById("start-date").value = "";
    document.getElementById("due-date").value = "";
    document.getElementById("priority").value = "";
    document.getElementById("progress").value = "";
    const errorMessage = document.querySelector(".modal-content .error-message");
    if (errorMessage) errorMessage.classList.add("hidden");
    updateAssigneeDropdown();
    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";
    const errorMessage = document.querySelector(".modal-content .error-message");
    if (errorMessage) errorMessage.classList.add("hidden");
}

function renderTasks() {
    const projectTasks = getProjectTasks();
    const tbody = document.querySelector("table tbody");

    tbody.innerHTML = "";

    if (!projectTasks || projectTasks.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">Chưa có nhiệm vụ nào cho dự án này.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = `
        <tr><td colspan="7" class="fw-bold">To do</td></tr>
        <tr><td colspan="7" class="fw-bold">In Progress</td></tr>
        <tr><td colspan="7" class="fw-bold">Pending</td></tr>
        <tr><td colspan="7" class="fw-bold">Done</td></tr>
    `;

    const sections = {
        "To do": tbody.children[0],
        "In Progress": tbody.children[1],
        "Pending": tbody.children[2],
        "Done": tbody.children[3]
    };

    projectTasks.forEach((task, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.assignee}</td>
            <td><span class="badge bg-${task.priority === "Cao" ? "danger" : task.priority === "Trung bình" ? "warning" : "info"}">${task.priority}</span></td>
            <td>${task.startDate}</td>
            <td>${task.dueDate}</td>
            <td><span class="badge bg-${task.progress === "Đúng tiến độ" ? "success" : task.progress === "Có rủi ro" ? "warning" : "danger"}">${task.progress}</span></td>
            <td>
                <button class="btn btn-warning btn-sm edit">Sửa</button>
                <button class="btn btn-danger btn-sm delete">Xóa</button>
            </td>
        `;

        row.querySelector(".edit").onclick = () => {
            editTaskIndex = index;
            document.getElementById("task-name").value = task.name;
            document.getElementById("assignee").value = task.assignee;
            document.getElementById("status").value = task.status;
            document.getElementById("start-date").value = task.startDate;
            document.getElementById("due-date").value = task.dueDate;
            document.getElementById("priority").value = task.priority;
            document.getElementById("progress").value = task.progress;
            updateAssigneeDropdown();
            modal.style.display = "flex";
        };

        row.querySelector(".delete").onclick = () => {
            deleteIndex = index;
            deleteModal.style.display = "flex";
        };

        sections[task.status].insertAdjacentElement("afterend", row);
    });
}

const saveBtn = document.querySelector(".modal-content .save");
saveBtn.onclick = () => {
    const task = {
        name: document.getElementById("task-name").value.trim(),
        assignee: document.getElementById("assignee").value,
        status: document.getElementById("status").value,
        startDate: document.getElementById("start-date").value,
        dueDate: document.getElementById("due-date").value,
        priority: document.getElementById("priority").value,
        progress: document.getElementById("progress").value,
        projectId: selectedProject?.id
    };

    if (!validateTask(task)) return;

    let projectTasks = getProjectTasks();
    if (editTaskIndex !== null) {
        projectTasks[editTaskIndex] = task;
    } else {
        projectTasks.push(task);
    }

    updateAllTasks(projectTasks);
    renderTasks();
    closeModal();
};

document.querySelectorAll(".cancel").forEach(btn => {
    btn.onclick = () => closeModal();
});

const sortSelect = document.getElementById("sort-tasks");
sortSelect.onchange = function () {
    currentSort = sortSelect.value;
    renderTasks();
};

const searchInput = document.getElementById("search-tasks");
searchInput.oninput = function () {
    currentSearch = searchInput.value.trim();
    renderTasks();
};

displayProjectDetails();
renderMembers();
renderTasks();
