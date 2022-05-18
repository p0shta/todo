import './sass/main.scss';

const refs = {
    form: document.querySelector('[data-form]'),
    toDoList: document.querySelector('[data-todo-list]'),
};

class ToDo {
    constructor({ id, text, checked, priority }) {
        (this.id = id), (this.text = text), (this.checked = checked), (this.priority = priority);
    }
}

let toDoesStorage = [];

try {
    toDoesStorage = [...JSON.parse(localStorage.getItem('to-does'))];
} catch (error) {
    toDoesStorage = [];
}

const toDoApp = {
    addTodo(item) {
        return toDoesStorage.push(item);
    },

    renderTodoList(toDoes) {
        const markup = toDoes
            .map(item => {
                const isChecked = item.checked;
                return `
                <li class="card" id="${item.id}" checked="${item.checked}">
                    <div class="card__priority ${isChecked ? 'card__priority--checked' : ''}"></div>
                    <div class="card__body">
                        <p class="card__content ${isChecked ? 'card__body--checked' : ''}">${
                    item.text
                }</p>
                        <button class="card__delete" type="button">x</button>
                    </div>
                </li>`;
            })
            .join('');
        return markup;
    },

    addToDoesToLocalStorage(item) {
        localStorage.setItem('to-does', JSON.stringify(item));
    },

    deleteToDo(deleteItemId) {
        toDoesStorage = toDoesStorage.filter(item => item.id !== deleteItemId);
    },

    updRenderAndAddToLocalStorage() {
        toDoApp.addToDoesToLocalStorage(toDoesStorage);
        refs.toDoList.innerHTML = toDoApp.renderTodoList(toDoesStorage);
    },
};

refs.toDoList.innerHTML = toDoApp.renderTodoList(toDoesStorage);

refs.form.addEventListener('submit', onFormSubmit);
function onFormSubmit(e) {
    e.preventDefault();
    if (e.currentTarget[0].value === '') {
        return;
    }
    const toDo = new ToDo({
        id: String(new Date().getTime()).slice(8),
        text: e.currentTarget[0].value,
        checked: false,
    });
    toDoApp.addTodo(toDo);
    toDoApp.updRenderAndAddToLocalStorage();
    e.currentTarget.reset();
}

refs.toDoList.addEventListener('click', onDeleteBtnClick);
function onDeleteBtnClick(e) {
    if (e.target.nodeName !== 'BUTTON') {
        return;
    }

    const toDoId = e.target.closest('li').id;
    toDoApp.deleteToDo(toDoId);
    toDoApp.updRenderAndAddToLocalStorage();
}

refs.toDoList.addEventListener('click', makeToDoStyleChecked);
function makeToDoStyleChecked(e) {
    if (e.target.nodeName === 'BUTTON') {
        return;
    }

    const toDoId = e.target.closest('li').id;

    for (const todo of toDoesStorage) {
        if (todo.id === toDoId) {
            todo.checked = !todo.checked;

            toDoApp.updRenderAndAddToLocalStorage();
        }
    }
}
