const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearbtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
    const itemsFromStorage = getItemFromStorage();

    itemsFromStorage.forEach((item) => {
        addItemToDOM(item);
    });

    changeUI();
}

function addItem(e) {
    e.preventDefault();
    const newItem = itemInput.value;
    
    // Validate item
    if(newItem === ''){
        alert('Please add an item');
        return;
    }

    if(isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }

    if(checkIfItemExists(newItem)) {
        alert('That item already exists!');
        itemInput.value = '';
        return;
    }

    // Add list item
    addItemToDOM(newItem);
    addItemToStorage(newItem);

    changeUI();
    itemInput.value = '';
}

function checkIfItemExists(item) {
    const itemsFromStorage = getItemFromStorage();
    return itemsFromStorage.includes(item);
}

function addItemToDOM(item) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');
    const icon = createIcon('fa-solid fa-xmark');

    button.appendChild(icon);
    li.appendChild(button);
    itemList.appendChild(li);
}


function addItemToStorage(item) {
    const storageItems = getItemFromStorage();

    storageItems.push(item);
    localStorage.setItem('items',JSON.stringify(storageItems));
}

function getItemFromStorage() {
    let storageItems;

    if(localStorage.getItem('items') === null) {
        storageItems = [];
    }
    else {
        storageItems = JSON.parse(localStorage.getItem('items'));
    }
    return storageItems;
}

function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function onClickItem(e) {
    if(e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    }
    else {
        setItemToEdit(e.target);
    }
}

function setItemToEdit(item) {
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((item) => {
        item.classList.remove('edit-mode');
    });

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
}

function removeItem(item) {
    if(confirm('Are you sure?')){

        // Remove item from DOM
        item.remove();

        // Remove item from localStorage
        removeItemFromStorage(item.textContent);

        changeUI();
    } 
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemFromStorage();

    itemsFromStorage = itemsFromStorage.filter((i) => i!==item);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems(e) {
    while(itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    // Clear items from localStorage
    localStorage.removeItem('items');

    changeUI();
}

function filterItem(e) {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if(itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        }
        else {
            item.style.display = 'none';
        }
    });
}

function changeUI() {
    // itemInput.value = '';
    const items = itemList.querySelectorAll('li');

    if(items.length === 0) {
        clearbtn.style.display = 'none';
        itemFilter.style.display = 'none';
    }
    else {
        clearbtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item'
    formBtn.style.backgroundColor = '#333';

    // isEditMode = false;
}

// Event Listener
itemForm.addEventListener('submit', addItem);
itemList.addEventListener('click', onClickItem);
clearbtn.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItem);
document.addEventListener('DOMContentLoaded', displayItems);

changeUI();
