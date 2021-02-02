const data = [
	{
		'folder': true,
		'title': 'Grow',
		'children': [
			{
				'title': 'logo.png'
			},
			{
				'folder': true,
				'title': 'English',
				'children': [
					{
						'title': 'Present_Perfect.txt'
					}
				]
			}
		]
	},
	{
		'folder': true,
		'title': 'Soft',
		'children': [
			{
				'folder': true,
				'title': 'NVIDIA',
				'children': null
			},
			{
				'title': 'nvm-setup.exe'
			},
			{
				'title': 'node.exe'
			}
		]
	},
	{
		'folder': true,
		'title': 'Doc',
		'children': [
			{
				'title': 'project_info.txt'
			}
		]
	},
	{
		'folder': true,
		'title': 'Info',
		'children': null
	},
	{
		'title': 'credentials.txt'
	}
];

//переменные и присвоения к классам; пустые стоки между готовыми элементами 
const rootNode = document.getElementById('root'); //div по id в html доке
rootNode.classList.add('root');

const shellBox = document.createElement('div'); //белое окно-оболочка
shellBox.classList.add('shellBox');

const nodeChildren = document.createElement('ul'); //список
nodeChildren.classList.add('nodes');

const nodeFolder = document.createElement('li'); //элемент списка -- закрытая папка
const nodeFolderDiv = document.createElement('div');
nodeFolderDiv.classList.add('cls-context-menu-link');
const nodeFolderIcon = document.createElement('i');
nodeFolderIcon.classList.add('material-icons','orange');
nodeFolderIcon.innerText = 'folder';
nodeFolderDiv.appendChild(nodeFolderIcon);
nodeFolder.appendChild(nodeFolderDiv);

const nodeOpenFolder = document.createElement('li'); //элемент списка -- открытая папка
const nodeOpenFolderDiv = document.createElement('div');
nodeOpenFolderDiv.classList.add('cls-context-menu-link');
const nodeOpenFolderIcon = document.createElement('i');
nodeOpenFolderIcon.classList.add('material-icons','orange');
nodeOpenFolderIcon.innerText = 'folder_open';
nodeOpenFolderDiv.appendChild(nodeOpenFolderIcon);
nodeOpenFolder.appendChild(nodeOpenFolderDiv);

const nodeFile = document.createElement('li'); //элемент списка -- файл
const nodeFileDiv = document.createElement('div');
nodeFileDiv.classList.add('cls-context-menu-link');
const nodeFileIcon = document.createElement('i');
nodeFileIcon.classList.add('material-icons','invert');
nodeFileIcon.innerText = 'insert_drive_file';
nodeFileDiv.appendChild(nodeFileIcon);
nodeFile.appendChild(nodeFileDiv);

const emptyFolder = document.createElement('p'); //элемент подпись -- папка пуста
emptyFolder.innerHTML = 'Folder is empty';
emptyFolder.classList.add('italic','text-cursor');

let nodeId = 0;

function setId(node, nodeElement){
	node.id = ++nodeId;
	nodeElement.setAttribute('data-id', nodeId);
}

function createFileTree(node, nodeElement){ //node--массив children, nodeElement--папка элемент html

	//если нет элементов значит папка пустая, выход из функции
	if (!node || node.length == 0){
		let emptyFolderClone = emptyFolder.cloneNode(true);
		nodeElement.appendChild(emptyFolderClone);
		return;
	} else {
		console.log(node);
	}

	let nodeChildrenClone = nodeChildren.cloneNode(true); //клонируем ul список для присоединения
	
	//парсим children
	for(let i = 0; i<node.length; i++){
		let nodeTitle = document.createTextNode(node[i].title); //название item'а

		//если нет поля фолдер, значит это файл, аппендим ноду-файл и переходим на след. итерацию
		if(!node[i].hasOwnProperty('folder')){
			let nodeFileClone = nodeFile.cloneNode(true); //клонируем ноду-файл
			nodeFileClone.firstChild.appendChild(nodeTitle); //тайтл для файла
			nodeChildrenClone.appendChild(nodeFileClone);
			nodeElement.appendChild(nodeChildrenClone);
			setId(node[i], nodeFileClone);
			continue;
		}

		let nodeFolderClone = nodeFolder.cloneNode(true); //клонируем ноду-папку
		nodeFolderClone.firstChild.appendChild(nodeTitle); //тайтл для папки
		setId(node[i], nodeFolderClone);
		//создаем переменные-слушатели
		let closeFolder = function (){
			node[i].folder = true; //папка закрыта 
			nodeFolderClone.firstChild.firstChild.innerHTML = nodeFolderDiv.innerHTML; //icon
			nodeFolderClone.removeChild(nodeFolderClone.lastChild); //удаляем подлежащий ul
			nodeFolderClone.firstChild.removeEventListener('click', closeFolder);
			nodeFolderClone.firstChild.addEventListener('click', openFolder);
		};
		let openFolder = function (){
			node[i].folder = false; //папка открыта
			nodeFolderClone.firstChild.firstChild.innerHTML = nodeOpenFolderDiv.innerHTML; //icon
			createFileTree(node[i].children, nodeFolderClone);
			nodeFolderClone.firstChild.removeEventListener('click', openFolder);
			nodeFolderClone.firstChild.addEventListener('click', closeFolder);
		};
		//вешаем слушателей на папки, если папка закрыта или папка открыта
		if(node[i].folder){ //папка закрыта
			nodeFolderClone.firstChild.addEventListener('click', openFolder);
		} else { //если стотоянии папки--открыта, то вызов-рекурсия с параметрами папки
			nodeFolderClone.firstChild.firstChild.innerHTML = nodeOpenFolderDiv.innerHTML; //icon
			createFileTree(node[i].children, nodeFolderClone);
			nodeFolderClone.firstChild.addEventListener('click', closeFolder);
		}
		nodeChildrenClone.appendChild(nodeFolderClone); //аппенд созданных li
	}
	nodeElement.appendChild(nodeChildrenClone); //прикладываем наполненный ul
}

createFileTree(data, shellBox); //первоначальный вызов для data, где аппенд будет на окно-оболочку
rootNode.appendChild(shellBox); //аппенд окна-оболочки к id-div в html

//контекстное меню
let сontextMenu = document.createElement('div');
сontextMenu.classList.add('cls-context-menu');
rootNode.appendChild(сontextMenu);
//элементы меню
let сontextMenuUl = document.createElement('ul');
let сontextMenuEdit = document.createElement('li');
let сontextMenuDelete = document.createElement('li');
сontextMenuEdit.innerText = `Edit`;
сontextMenuDelete.innerText = `Delete item`;
сontextMenuUl.appendChild(сontextMenuEdit);
сontextMenuUl.appendChild(сontextMenuDelete);
сontextMenu.appendChild(сontextMenuUl);
//закрываем меню если клик по любому месту документа
document.onclick = function() {
	сontextMenu.style.display = 'none';
}

function findNode(id, array) {

	//let index;
	console.log(id);
	let filter = array.filter(e => {e.id === id; console.log(e.id);});
	return array.indexOf(filter[0]);
	// if (!filter.length){
	// 	return false;
	// }
	// return index;
		// else if (array[i].hasOwnProperty(children)) {
		// 	findNode(id, array[i].children);
		// }
	//return 0;
}

function deleteFromData(element){
	console.log(data);
	let id = element.dataset.id;
	console.log(element);
	let index = findNode(id, data);
	console.log(index);
	data.splice(index, 1);
	console.log(data);
}

//реализация контекстного меню
document.oncontextmenu = function(e) {
	let element = e.target;
	сontextMenu.classList.remove('disable');
	e.preventDefault();
	if (element.className.startsWith('cls-context-menu')) {

		сontextMenuEdit.onclick = function() {
			element.removeChild(element.lastChild);
			let input = document.createElement('input');
			input.type ='text';
			input.size = '30';
			element.appendChild(input);
			input.focus();
			input.select();
			input.onchange = function() {
				let text = document.createTextNode(input.value);
				element.removeChild(element.lastChild);
				element.appendChild(text);
			}
		};

		сontextMenuDelete.onclick = function() {
			//если остался один li, ставим строку -- папка пуста
			if(element.parentElement.parentElement.children.length===1){
				let emptyFolderClone = emptyFolder.cloneNode(true);
				let parentDiv = element.parentElement.parentElement.parentElement;
				parentDiv.removeChild(parentDiv.lastChild);
				parentDiv.appendChild(emptyFolderClone);
				deleteFromData(element.parentElement);
				return;
			}
			element.parentElement.remove();
			deleteFromData(element.parentElement);
		};
		сontextMenu.style.left = e.pageX + 'px';
		сontextMenu.style.top = e.pageY + 'px';
		сontextMenu.style.display = 'block';
	} else {
		сontextMenu.classList.add('disable');
		сontextMenu.style.left = e.pageX + 'px';
		сontextMenu.style.top = e.pageY + 'px';
		сontextMenu.style.display = 'block';
	}
}