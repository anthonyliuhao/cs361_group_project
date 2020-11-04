function displayRegisterForm() {
    document.querySelector('.register_model_container').style.display = 'flex';
}

function closeRegisterForm() {
    document.querySelector('.register_model_container').style.display = 'none';

    let first_name = document.getElementById('first_name');
    let last_name = document.getElementById('last_name');
    let email = document.getElementById('email');
    let username = document.getElementById('username');
    let password = document.getElementById('password');
    let confirm_password = document.getElementById('confirm_password');

    // clear field values after closing
    first_name.value = "";
    last_name.value = "";
    email.value = "";
    username.value = "";
    password.value = "";
    confirm_password.value = "";

    // clear error messages
    let input_list = [];
    input_list.push(first_name);
    input_list.push(last_name);
    input_list.push(email);
    input_list.push(username);
    input_list.push(password);
    input_list.push(confirm_password);
    console.log(input_list);
    for (i=0; i<input_list.length; i++) {
        if (input_list[i].nextElementSibling.childElementCount != 0){
            input_list[i].nextElementSibling.children[0].remove();
        }
    }
}

function signUpAttempt() {
    let first_name = document.getElementById('first_name');
    let last_name = document.getElementById('last_name');
    let email = document.getElementById('email');
    let username = document.getElementById('username');
    let password = document.getElementById('password');
    let confirm_password = document.getElementById('confirm_password');
    let signUpForm = new SignUpForm(first_name, last_name, email, username, password, confirm_password);
    console.log("signUpform", signUpForm); //remove this later
    let formValidated = validateSignUp(signUpForm);
    console.log("formValidated", formValidated); // remove later
    if (formValidated === true){
        //create account goes here?
        let req = new XMLHttpRequest();
        let payload = {first_name: signUpForm.getFirstName().value,last_name: signUpForm.getLastName().value, email: signUpForm.getEmail().value, username: signUpForm.getUsername().value, password: signUpForm.getPassword().value}
        req.open("POST", "http://localhost:3000/register", true);
        req.setRequestHeader("Content-Type", "application/json");
        req.addEventListener("load", function(){
            if (req.status >= 200 && req.status < 400) {
                let response = JSON.parse(req.responseText);
                console.log("response", response); // remove later
                if (response.success === true) {
                    return true;
                } else {
                    return false;
                }
            } else {
                console.log(req.status);
            }
        });
        console.log("payload",payload);
        req.send(JSON.stringify(payload));
    }
    else {
        return false;
    }
}

function SignUpForm(first_name, last_name, email, username, password, confirm_password) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.username = username;
    this.password = password;
    this.confirm_password = confirm_password;
}

SignUpForm.prototype.getFirstName = function() {
    return this.first_name;
}

SignUpForm.prototype.getLastName = function() {
    return this.last_name;
}

SignUpForm.prototype.getEmail = function() {
    return this.email;
}

SignUpForm.prototype.getUsername = function() {
    return this.username;
}

SignUpForm.prototype.getPassword = function() {
    return this.password;
}

SignUpForm.prototype.getConfirmPassword = function() {
    return this.confirm_password;
}

function emptyFieldsVerification(signUpFormObj) {
    let verfication = true;
    for (var nodeElement of Object.values(signUpFormObj)) {
        if (nodeElement.value.trim().length == 0) {
            if (nodeElement.nextElementSibling.childElementCount === 0){
                let error_msg = document.createElement("span");
                error_msg.innerHTML = "This field is required";
                error_msg.style.color = "red";
                if (nodeElement.id == "last_name"){
                    error_msg.style.paddingLeft = "245px";
                }
                nodeElement.nextElementSibling.appendChild(error_msg);
            }
            verfication = false;
        }
        else {
            if (nodeElement.nextElementSibling.childElementCount != 0){
                nodeElement.nextElementSibling.children[0].remove();
            }
        }
    }

    if (verfication == false){
        return false;
    }
    else {

        return true;
    }
}

function validatePasswordReq(signUpFormObj) {
    // if the password input has more than 1 character but less than 6.
    if (signUpFormObj.getPassword().value.length < 6 && signUpFormObj.getPassword().value.length > 0){
        let error_msg = document.createElement("span");
        error_msg.innerHTML = "Invalid password, please enter 6 or more characters";
        error_msg.style.color = "red";
        signUpFormObj.getPassword().nextElementSibling.appendChild(error_msg)
        return false
    }
    // check if the input is alphanumeric. 
    let alphanumericRegEx  = /[^a-z\d]/i;
    let arePasswordCharactersValid = !(alphanumericRegEx.test(signUpFormObj.getPassword().value)); // test if each letter is alphanumeric character.
    if (arePasswordCharactersValid === false){
        let error_msg = document.createElement("span");
        error_msg.innerHTML = "Invalid password, please enter only alphanumeric characters";
        error_msg.style.color = "red";
        signUpFormObj.getPassword().nextElementSibling.appendChild(error_msg);
        return false;
    }
    // check if the confirm password is the same as the password input
    if ((signUpFormObj.getPassword().value != signUpFormObj.getConfirmPassword().value) && signUpFormObj.getConfirmPassword().value.length > 0){
        let error_msg = document.createElement("span");
        error_msg.innerHTML = "Password does not match";
        error_msg.style.color = "red";
        signUpFormObj.getConfirmPassword().nextElementSibling.appendChild(error_msg);
        return false;
    }
    return true;
}

function validateUsername(signUpFormObj) {
    let req = new XMLHttpRequest();
        let payload = {username: signUpFormObj.getUsername().value}
        req.open("POST", "http://localhost:3000/validateUsername", true);
        req.setRequestHeader("Content-Type", "application/json");
        req.addEventListener("load", function(){
            if (req.status >= 200 && req.status < 400) {
                let response = JSON.parse(req.responseText);
                console.log("response", response); // remove later
                if (response.success === true) {
                    return true;
                } else {
                    // display username taken msg
                    return false;
                }
            } else {
                console.log(req.status);
            }
        });
        console.log("payload",payload);
        req.send(JSON.stringify(payload));
}

function validateSignUp(signUpFormObj) {
    let ableToSignUp = true;
    if (emptyFieldsVerification(signUpFormObj) === false) {
        ableToSignUp = false;
    }
    if (validatePasswordReq(signUpFormObj) === false) {
        ableToSignUp = false;
    }
    if (validateUsername(signUpFormObj) === false) {
        ableToSignUp = false;
    } 
    // if email is taken function add here
    console.log("ableToSignUp", ableToSignUp); // remove later
    return ableToSignUp;
}

document.getElementById('register_button').addEventListener('click', function(event){
    displayRegisterForm();
    event.preventDefault();
    event.stopPropagation();
});

document.getElementById('register_close').addEventListener('click', function(event){
    closeRegisterForm();
    event.preventDefault();
    event.stopPropagation();
});

document.getElementById('create_account_button').addEventListener('click', function(event){
    let success = signUpAttempt();
    if (success === true){
        //show success msg
    }
    event.preventDefault();
    event.stopPropagation();
});