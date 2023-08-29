// Tüm elementleri seçme

const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");


eventListeners();

function eventListeners(){        // Tüm event listenerler

    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI);          //Sayfa her yüklendiğinde çalışır.
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup",filterTodos);
    clearButton.addEventListener("click", clearAllTodos);
}

function clearAllTodos(e){
// İlk Arayüzden kaldıracağız
if(confirm("Tümünü silmek istediğinize emin misiniz?")){
   // todoList.innerHTML= "";        // 1.yol ama yavaş bir yol.

   while(todoList.firstElementChild != null) {            //firstElement child == null olana kadar bu döngü devam edip teker teker silecek. 
    todoList.removeChild(todoList.firstElementChild);
   }
   
   localStorage.removeItem("todos");   // localStorage'den tüm todoları silme
}
}


function filterTodos(e){
 const filterValue = e.target.value.toLowerCase();      //tüm harfleri küçük harfe çevirdik, daha iyi arama yapsın diye
const listItems = document.querySelectorAll(".list-group-item");

listItems.forEach(function(listItem){

    const text = listItem.textContent.toLowerCase();
    if (text.indexOf(filterValue) === -1 ){
        //Bulamadığı durum 
        listItem.setAttribute("style", "display: none !important");
        

    }
    else {
        listItem.setAttribute("style", "display : block");
    
    }

})

}

function deleteTodo(e){

if(e.target.className === "fa fa-remove"){
    e.target.parentElement.parentElement.remove();//index.html'den kontrol ettik, fa fa-removenin üstünde 2 tane parent element var ve o satırı komple silmemiz için 2 parent element yukarı çıkmamız gerektiğinden böyle yaptık. 
    deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);  // Verileri localstorage'den silmek için bu fonksiyona bu parametreleri gönderdik.              
    showAlert("success","Todo Başarıyla Silindi.")
}


}

function deleteTodoFromStorage(deleteTodo){
    let todos = getTodosFromStorage();

    todos.forEach(function(todo,index){
        if ( todo === deleteTodo ){
          todos.splice(index,1);   //Array'den değeri sildik splice ile
        }
    });

    localStorage.setItem("todos",JSON.stringify(todos));

}



function loadAllTodosToUI(){                             //Sayfa her yüklendiğinde Arayüzdeki veriler kaybolmasın diye.
  
    let todos = getTodosFromStorage();

    todos.forEach(function(todo){
        addTodoToUI(todo);
    })
}


function addTodo(e){
const newTodo = todoInput.value.trim();

if(newTodo === "" ) {
    showAlert("danger","Lütfen bir Todo Girin.");

}else {
    addTodoToUI(newTodo);
    addTodoToStorage(newTodo);
    showAlert("success","Todo Başarıyla Eklendi.");
}



    e.preventDefault();
}


function getTodosFromStorage () {

  /* bu Fonksiyon çok fazla kullanılıyor. Eğer input boşsa boş bir dizi oluştur. Değilse de alınan string veriyi array'a  çevirip -todos- içine gönder */ 
    let todos;                                            

    if( localStorage.getItem("todos") ===null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem("todos"));                            
    }                                                              
           return todos;

}


function addTodoToStorage(newTodo) {
let todos = getTodosFromStorage();              //yukarıda yazdıgımız fonksiyonu cagırdık.


todos.push(newTodo);

localStorage.setItem("todos", JSON.stringify(todos));


} 


function showAlert(type,message){

    const alert = document.createElement("div");

    alert.className = ` alert alert-${type}`;
    alert.textContent =message;
    
    firstCardBody.appendChild(alert);

    //setTimeOut metodu ile alertin 1sn-2sn sonra görünürlükten gitmesi için kullandık.
    setTimeout(function(){
        alert.remove();
    },2000);
}



function addTodoToUI(newTodo){      //String değerini ekranda gösterecek yani List item olarak ekleyek.

    // li elementini oluşturma
const listItem = document.createElement("li");

//LİNK OLUŞTURMA
const link = document.createElement("a");
link.href= "#";
link.className="delete-item";
link.innerHTML= "<i class = 'fa fa-remove'></i>";

listItem.className="list-group-item d-flex justify-content-between";

//Text Node Ekleme

listItem.appendChild(document.createTextNode(newTodo));
listItem.appendChild(link);

//Todo List'e List Item'ı ekleme

todoList.appendChild(listItem);
todoInput.value="";


}