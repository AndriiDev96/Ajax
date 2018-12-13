const btnReturnTop = document.querySelector('.topBtn'),
      addNewUser = document.querySelector('.btn-add-user'),
      btnPullUsers = document.querySelector('.pull-users'),
      btnSaveChange = document.querySelector('#btnSaveChange'),
      blockPullUsers = document.querySelector('#pull-data'),
      stateDisplay = getComputedStyle(blockPullUsers, null),
      formAddUser = document.querySelector('#add-user-form'),
      formEdidUser = document.querySelector('#edid-user-form'),
      blockUserCards = document.querySelector('.user-cards');

const URL = 'https://test-users-api.herokuapp.com';

window.onscroll = () => {
  if(document.documentElement.scrollTop > 300){
    btnReturnTop.classList.add('showTopButton');
  }else{
    btnReturnTop.classList.remove('showTopButton');
  }
};

function scrollTop(){
  let scrollStep = -window.scrollY / 30;
  let scrollInterval = setInterval(() => {
    if(window.scrollY != 0){
      window.scrollBy(0, scrollStep);
    }else{
      clearInterval(scrollInterval);
    }
  }, 15);
}

const request = (endpoint, method = "GET", data = {}) => {
  const body = method == "GET" ? void(0) : JSON.stringify(data);

  return fetch(`${URL}/${endpoint}`, {
    method,
    body,
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(res => { return res.json(); })
  .catch(err => alert(err));
}

let users = [], idClickUser;

const cardUser = (user) => {
  let divCard = document.createElement('div'),
      divView = document.createElement('div'),
      divCardBody = document.createElement('div'),
      avatar = document.createElement('img'),
      userName = document.createElement('h4'),
      textAge = document.createElement('p'),
      ageUser = document.createElement('span'),
      editUser = document.createElement('a'),
      delUser = document.createElement('a');

  const photoUser = `img/newUser.png`;

  divCard.className = 'card';
  divCard.setAttribute("data-id", user.id);
  divView.className = 'view overlay';
  divCardBody.className = 'card-body';
  avatar.className = 'card-img-top';
  userName.className = 'card-title';
  textAge.className = 'card-text';
  ageUser.className = 'age-user';
  editUser.id = 'btn-edit';
  delUser.id = 'btn-delete';

  avatar.src = photoUser;
  divView.append(avatar);
  userName.innerText = user.name;
  divCardBody.prepend(userName);
  textAge.innerText = 'Age: ';
  ageUser.innerText = user.age;
  textAge.append(ageUser);
  divCardBody.append(textAge);
  editUser.innerText = 'Edit';
  divCardBody.append(editUser);
  delUser.innerText = 'Delete';
  divCardBody.append(delUser);
  divCard.prepend(divView);
  divCard.append(divCardBody);
  blockUserCards.prepend(divCard);

  editUser.addEventListener("click", () => {
    $('#editDataUser').modal();
    idClickUser = editCreatedUser.bind(null, userName, ageUser, user.id);
  });
  
  delUser.addEventListener("click", () => {deleteUser(divCard)});
}

const editCreatedUser = async (userName, ageUser, id) => {
  let name = document.querySelector('#edit-name').value,
        age = Number(document.querySelector('#edit-age').value);

  if(name == "" && age <= 0){
    return alert("You can not save. Fill in fields (name and age or name or age).");
  }else if(name == "" && age > 0){
    name = userName.innerText;
  }else if(name && age <= 0){
    age = ageUser.innerText;
  }
  
  try{
    const responce = await request(`users/${id}`, "PUT", {name, age})
    userName.innerText = responce.data.name;
    ageUser.innerText = responce.data.age;
    formEdidUser.reset();
  }catch(err){
    alert(err);
  } 
}

const deleteUser = async (divCard) => {
  const id = divCard.dataset.id;
  try{
    const responce = await request(`users/${id}`, "DELETE");
    divCard.remove();
  }catch(err){
    alert(err);
  }
}

const showAllUsers = () => {
  blockUserCards.innerHTML = ' ';
  users.forEach((user) => {
    cardUser(user);    
  })
}

const createOneUser = (createNewUser) => {
  cardUser(createNewUser);
  getUsers();
}

const createUser = async () => {
  const name = document.querySelector('#id-name').value,
        age = Number(document.querySelector('#id-age').value);
        
  if(name === '' || age <= 0){
    alert("Please, fill in all fields");
  }else if(stateDisplay.display == "block"){
    alert("First you need to output users from the server!");
  }else{
    try{
      const createNewUser = await request("users/", "POST",{name, age})
      createOneUser(createNewUser.data);
      formAddUser.reset();
      toastr.success(`Added new user: ${createNewUser.data.name}`);
    }catch(err){
      alert(err);
    }
  }
}

const getUsers = async () => {
  try{
    const response = await request("users/");
    users = response.data;
    showAllUsers();
  }catch(err){
    alert(err);    
  }
}

btnPullUsers.addEventListener("click", () => {
  blockPullUsers.classList.add('pull-data-display');
  getUsers();
});

btnSaveChange.addEventListener("click", () =>{
  idClickUser();
});

addNewUser.addEventListener("click", () => createUser());

btnReturnTop.addEventListener("click", () => scrollTop());