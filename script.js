const courseList = document.getElementById('course-list');
const openAddCourseModal = document.getElementById('open-add-course-modal');
const courseModal = document.getElementById('course-modal');
const courseForm = document.getElementById('course-form');
const courseNameInput = document.getElementById('course-name');
const courseDescriptionInput = document.getElementById('course-description');
const courseIdInput = document.getElementById('course-id');

class Course {
    constructor(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
    render() {
        return `
        <tr>
            <td>${this.id}</td>
            <td>${this.name}</td>
            <td>${this.description}</td>
            <td>
                <button class="action-button edit-button" data-id="${this.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-button delete-button" data-id="${this.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>`;
    }
}

// Hiển thị danh sách khóa học
if (courseList) {
    fetch('https://my-json-server.typicode.com/MthanhDanh/json/courses')
        .then(response => response.json())
        .then(courses => {
            let html = "";
            courses.forEach(item => {
                const course = new Course(item.id, item.name, item.description);
                html += course.render();
            });
            courseList.innerHTML = html;
        });
}

//Mở modal thêm khóa học
if (openAddCourseModal) {
    openAddCourseModal.addEventListener('click', () => {
        courseForm.setAttribute('data-mode', 'add');
        courseForm.reset();
        courseModal.style.display = 'block';
    });

    // Submit form thêm , sửa khóa học
    courseForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (courseForm.getAttribute('data-mode') === 'edit') {
            const updateCourse = {
                id: courseIdInput.value,
                name: courseNameInput.value,
                description: courseDescriptionInput.value
            };
            fetch(`https://my-json-server.typicode.com/MthanhDanh/json/courses/${updateCourse.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateCourse)
            })
            .then(() => location.reload())
            .catch(error => console.error("Lỗi:", error));

        } else {
            const newCourse = {
                id: Date.now().toString(),
                name: courseNameInput.value,
                description: courseDescriptionInput.value
            };
            fetch('https://my-json-server.typicode.com/MthanhDanh/json/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCourse)
            })
            .then(() => location.reload())
            .catch(error => console.error("Lỗi:", error));
        }
    });
}

// Khi bấm nút sửa
// Bấm nút sửa hiện modal (xài chung modal thêm)
if (courseList) {
    courseList.addEventListener('click', (event) => {
        if (event.target.closest('.edit-button')) {
            const button = event.target.closest('.edit-button');
            const id = button.getAttribute('data-id');
            // Thêm thuộc tính để form chuyển sang chế độ edit
            courseForm.setAttribute('data-mode', 'edit');

            fetch(`https://my-json-server.typicode.com/MthanhDanh/json/courses/${id}`)
                .then(response => response.json())
                .then(course => {
                    console.log(course);
                    courseIdInput.value = course.id;
                    courseNameInput.value = course.name;
                    courseDescriptionInput.value = course.description;
                    courseModal.style.display = "block";
                })
                .catch(error => console.error("Lỗi khi tải khóa học:", error));
        }
    });
}

// Xóa khóa học
if (courseList) {
    courseList.addEventListener('click', (event) => {
        if (event.target.closest('.delete-button')) {
            const button = event.target.closest('.delete-button');
            const id = button.getAttribute('data-id');
            if (confirm('Bạn có chắc muốn xóa khóa học này?')) {
                fetch(`https://my-json-server.typicode.com/MthanhDanh/json/courses/${id}`, {
                    method: 'DELETE'
                })
                    .then(() => {
                        alert('Đã xóa khóa học thành công!');
                        location.reload(); // Reload lại trang để cập nhật danh sách
                    })
                    .catch(error => console.error("Lỗi khi xóa:", error));
            }
        }
    });
}

// Đóng modal khi bấm ra ngoài
window.addEventListener('click', (event) => {
    if (event.target === courseModal) {
        courseModal.style.display = "none";
        courseForm.removeAttribute('data-mode'); // Xóa chế độ sửa
        courseForm.reset(); // Xóa dữ liệu trong form
    }
});

