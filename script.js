const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearbtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');

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

    // Add list item
    addItemToDOM(newItem);
    addItemToStorage(newItem);

    changeUI();
    itemInput.value = '';
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

function removeItem(e) {
    if(e.target.parentElement.classList.contains('remove-item')) {
        if(confirm('Are you sure?')){
            e.target.parentElement.parentElement.remove();

            changeUI();
        } 
    }
}

function clearItems(e) {
    while(itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }
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
    const items = itemList.querySelectorAll('li');

    if(items.length === 0) {
        clearbtn.style.display = 'none';
        itemFilter.style.display = 'none';
    }
    else {
        clearbtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }
}

// Event Listener
itemForm.addEventListener('submit', addItem);
itemList.addEventListener('click', removeItem);
clearbtn.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItem);
document.addEventListener('DOMContentLoaded', displayItems);

changeUI();
// localStorage.clear();