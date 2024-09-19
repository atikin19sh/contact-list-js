window.onload = function () {
    //Press on submit button: getting input's values and creating object with fields name, vacancy, phone
    document.querySelector('.js-submit-btn').addEventListener('click', () => {
        let contact = new Object();
        let nameInput = document.querySelector('.js-name-input');
        let vacancyInput = document.querySelector('.js-vacancy-input');
        let phoneInput = document.querySelector('.js-phone-input');

        //If all inputs not empty, creating new object, else - printing error ang highlights incorrect inputs 
        let correctFirstInput = checkInput(nameInput);
        let correctSecondInput = checkInput(vacancyInput);
        let correctThirdInput = checkInput(phoneInput);
        if (correctFirstInput && correctSecondInput && correctThirdInput) {
            contact.name = nameInput.value.trim();
            contact.vacancy = vacancyInput.value.trim();
            contact.phone = phoneInput.value.trim();

            //getting first letter of name - will be key of object array - adding to table, list
            let firstLetter = nameInput.value.trim()[0].toLowerCase();
            addToTable(contact, firstLetter);
        } else
            showErrorBlock('Error');
    });



    //Add contact to list and table: adding to HTML table general SET list array of objects
    //(like {a: [0: {name: "Andrew", vacancy: "Prgrammer", phone: "+213123"}], b: [{name: "BAndrew", vacancy: "Prgrammer", phone: "+2131232"}}]})
    let contactSet = new Set();
    let letterContactsObj = {};

    function addToTable(contact, firstLetter) {
        //Set list of all elements of contact list
        if (checkEqualsInGlobalSet(contact)) {
            contactSet.add(contact);
            //If object hasn't this property, creating array at this property
            if (!letterContactsObj.hasOwnProperty(firstLetter)) {
                letterContactsObj[firstLetter] = new Array();
            }
            letterContactsObj[firstLetter].push(contact);
            changeCounter(firstLetter);
            addInfoToLetter(firstLetter, contact);
        } else {
            showErrorBlock("Contact List can't contain 2 equals contacts");
        }
    }

    //Change counter of contact for 1 letter
    function changeCounter(firstLetter) {
        //If div hasn't span - creating it
        let hasSpan = false;
        let letter = document.querySelector('.js-column-letter[data-id=' + firstLetter + ']');
        for (let i = 0; i < letter.children.length; i++) {
            if (letter.children[i].tagName == 'SPAN') {
                hasSpan = true;
                break;
            }
        }

        //If letter hasn't span element - creating it. Else - just increase counter
        if (!hasSpan) {
            let span = document.createElement('span');
            span.className = 'letter__counter letter__counter_active';
            span.textContent = '0';
            letter.appendChild(span);

            letter.classList.add('element__letter_active');
        }
        letter.children[0].textContent++;
    }


    //Adding block with info about contact to letter when 
    function addInfoToLetter(firstLetter, contact) {
        let letter = document.querySelector('.js-column-letter[data-id=' + firstLetter + ']');
        //Create and add contact's info to page
        for (let i = 1; i < letter.parentNode.children.length; i++) {
            letter.parentNode.children[i].classList.remove('letter__info_active');
        }
        let div = document.createElement('div');
        div.className = 'letter__info js-letter-info';
        div.innerText = `Name: ${contact.name}\n  Vacancy: ${contact.vacancy}\n  Phone: ${contact.phone}\n`;

        //Create and add window close symbol (button)
        let closeWindow = document.createElement('i');
        closeWindow.className = 'fa fa-window-close contact__delete js-delete-element';
        closeWindow.setAttribute('aria-hidden', true);
        letter.after(div);

        div.appendChild(closeWindow);
    }


    //Show elements info when click on letter element
    let tableElements = document.querySelectorAll('.js-column-letter');
    tableElements.forEach(function (item) {
        item.addEventListener('click', function (event) {
            let children = event.target.parentNode.children;

            for (let i = 1; i < children.length; i++) {
                children[i].classList.toggle('letter__info_active');
                //Adding for every contact delete function               
                let delBtn = children[i].querySelector('.js-delete-element');
                delBtn.addEventListener('click', function () {
                    deleteElement(delBtn.parentNode);
                });
            }
        });
    });



    function checkInput(input) {
        let inputValue = input.value.trim().toLowerCase();
        let inputCorrectStasus;

        if (input.className.includes('phone')) {
            inputCorrectStasus = checkNumericInputValue(input, inputValue);
        } else {
            inputCorrectStasus = checkTextInputValue(input, inputValue);
        }
        return inputCorrectStasus;
    }

    function checkTextInputValue(input, inputValue) {
        let regLetters = /[a-zA-Z ]/gmi;

        let errorText = "";
        let incorrectValue = false;

        if (inputValue == "") {
            errorText = "Empty input";
            incorrectValue = true;
        } else if (inputValue.length < 3) {
            errorText = "Can't be shorter than 3 symbols";
            incorrectValue = true;
        } else if (inputValue.length > 20) {
            errorText = "Can't be longer than 20 symbols";
            incorrectValue = true;
        } else if (!checkRegExp(inputValue, regLetters)) {
            errorText = "Invalid value";
            incorrectValue = true;
        }

        if (incorrectValue) {
            showErrorInput(errorText, input);
            return false;
        }
        return true;
    }

    function checkNumericInputValue(input, inputValue) {
        let regNumbers = /[0-9+]/gmi;

        let errorText = "";
        let incorrectValue = false;

        if (inputValue == "") {
            errorText = "Empty input";
            incorrectValue = true;
        } else if (inputValue.length <= 5) {
            errorText = "Can't be shorter than 5 symbols";
            incorrectValue = true;
        } else if (inputValue.length > 30) {
            errorText = "Can't be longer than 30 symbols";
            incorrectValue = true;
        } else if (inputValue[0] !== '+' || !checkRegExp(inputValue, regNumbers)) {
            errorText = "Invalid phone number";
            incorrectValue = true;
        }
        if (incorrectValue) {
            showErrorInput(errorText, input);
            return false;
        }
        return true;
    }

    //Checking string on regular exp. If match regExp - keep workingm else - return false
    function checkRegExp(string, regExp) {
        for (let i = 0; i < string.length; i++) {
            if (string[i].search(regExp) == -1) {
                return false;
            }
        }
        return true;
    }

    function checkEqualsInGlobalSet(contact) {
        let notEquals = true;
        for (let contactE of contactSet.keys()) {
            if (contactE.name == contact.name && contactE.vacancy == contact.vacancy && contactE.phone == contact.phone) {
                notEquals = false;
            }
        }
        return notEquals;
    }

    //Arguments: error text and object, which class will be toggled to active
    function showErrorInput(errText, obj) {
        obj.classList.toggle(obj.classList[0] + '_active');
        let tempPlaceHolder = obj.getAttribute('placeholder');
        obj.value = "";
        obj.setAttribute('placeholder', errText);

        //Sand after 3 seconds hide error message
        setTimeout(function () {
            obj.classList.toggle(obj.classList[0] + '_active');
            obj.setAttribute('placeholder', tempPlaceHolder);
        }, 3000);
    }


    //Printing al screend message on 3 seconds
    function showErrorBlock(errorText) {
        let error = document.querySelector('.js-error');
        error.classList.toggle('error_active');
        error.textContent = errorText;
        setTimeout(function () {
            error.classList.toggle('error_active');
        }, 3000);
    }



    //Deleting element - removing form general SET, array of objects, HTML table, reducting contact couner(if counter = 0 - removing span)
    function deleteElement(element) {
        removeFromGeneralSet(element);
        removeFromObjectArray(element);
        spanReduciton(element);
        element.remove();
    }


    function removeFromGeneralSet(element) {
        let delObj = textToObject(element.textContent);
        for (let contactSetElem of contactSet.keys()) {
            if (contactSetElem.name == delObj.name && contactSetElem.vacancy == delObj.vacancy && contactSetElem.phone == delObj.phone) {
                contactSet.delete(contactSetElem);
            }
        }
    }

    function removeFromObjectArray(element) {
        let delObj = textToObject(element.textContent);
        let firstLetter = element.parentNode.children[0].getAttribute('data-id');
        let letterContactsArray = letterContactsObj[firstLetter];

        for (let i = 0; i < letterContactsArray.length; i++) {
            if (letterContactsArray[i].name == delObj.name && letterContactsArray[i].vacancy == delObj.vacancy && letterContactsArray[i].phone == delObj.phone) {
                let index = i;
                letterContactsArray.splice(index, 1);
                break;
            }
        }
        letterContactsObj[firstLetter] = letterContactsArray;
    }

    //Reducting contactCounter when deleting contact
    function spanReduciton(element) {
        let span = element.parentNode.firstChild.querySelector('span');
        let elementLetter = element.parentNode.querySelector('.js-column-letter');
        span.textContent--;

        if (span.textContent == 0) {
            span.remove();
            elementLetter.classList.toggle('element__letter_active');
        }
    }

    //Converting HTML text to contact object (using for getting object of delete)
    function textToObject(text) {
        let delObj = {};
        let contactFullElements = text.split('  ');
        let contactElements = [];
        for (let contact of contactFullElements) {
            let contactEls = contact.split(':');
            contactElements.push(contactEls[1]);
        }

        delObj.name = contactElements[0].trim();
        delObj.vacancy = contactElements[1].trim();
        delObj.phone = contactElements[2].trim();
        return delObj;
    }

    //Press on Clear List button - deleting all general set and array of object
    document.querySelector('.js-clear-btn').addEventListener('click', function () {
        let lettersInfo = document.querySelectorAll('.js-letter-info');

        for (let element of lettersInfo) {
            deleteElement(element);
        }
    });


    //POPUP
    document.querySelector('.js-search-btn').addEventListener('click', function () {
        toggleSearchPopUp();
        lettersInfo = getAllContactsFromHTML();
    });

    document.querySelector('.js-popup-close').addEventListener('click', toggleSearchPopUp);
    document.querySelector('.js-search-popup-bg').addEventListener('click', toggleSearchPopUp);

    document.querySelector('.js-edit-popup-close').addEventListener('click', toggleEditPopUp);
    document.querySelector('.js-edit-popup-bg').addEventListener('click', toggleEditPopUp);


    function toggleSearchPopUp() {
        clearSearchPopup();
        clearSearchInput();
        document.querySelector('.js-search-popup').classList.toggle('search-popup__text_active');
        document.querySelector('.js-search-popup-bg').classList.toggle('search-popup__bg_active');
    }

    function toggleEditPopUp() {
        document.querySelector('.js-edit-popup').classList.toggle('edit-popup__text_active');
        document.querySelector('.js-edit-popup-bg').classList.toggle('edit-popup__bg_active');
    }



    //At every input in search-input starting search in whole contact list 
    let lettersInfo;
    document.querySelector('.js-search-input').addEventListener('input', function () {
        let searchInputValue = this.value.toLowerCase().trim();
        clearSearchPopup();

        if (searchInputValue != '') {
            findSearchMatch(lettersInfo, searchInputValue);
        }
    });


    //Searching match in contact list by searchInputValue
    function findSearchMatch(lettersInfo, searchInputValue) {
        for (let contact of lettersInfo) {
            let contactClone = contact.cloneNode(true);
            let elementObject = textToObject(contactClone.textContent);

            if (isStartsWithText(elementObject, searchInputValue)) {
                printToSearchTable(contactClone);
                editSearchTable(contact, contactClone);
                deleteFromSearchTable(contact, contactClone);
            }
        }
    }

    //Press at showAll button in seachPopup - showing all contacts
    document.querySelector('.js-show-all-btn').addEventListener('click', function () {
        clearSearchPopup();
        clearSearchInput();
        for (let contact of lettersInfo) {
            let contactClone = contact.cloneNode(true);
            printToSearchTable(contactClone);
            editSearchTable(contact, contactClone);
            deleteFromSearchTable(contact, contactClone);
        }
    });

    //Showing shuitable contact
    function printToSearchTable(contactClone) {
        contactClone.classList.add('letter__info_active');
        let editIcon = document.createElement('i');
        editIcon.className = 'fa fa-edit js-edit';
        contactClone.appendChild(editIcon);
        document.querySelector('.js-popup-output').appendChild(contactClone);
    }

    let globalContact, globalContactClone;
    function editSearchTable(contact, contactClone) {
        let editBtn = contactClone.querySelector('.js-edit');

        editBtn.addEventListener('click', function () {
            setEditInputsValue(contactClone);
            toggleEditPopUp();
            globalContact = contact;
            globalContactClone = contactClone;
        });
    }

    document.querySelector('.js-submit-edit-btn').addEventListener('click', function () {
        addConfirmEdit(globalContact, globalContactClone);
    });

    //Adding delete function for every contact in seach popup
    function deleteFromSearchTable(contact, contactClone) {
        let delBtn = contactClone.querySelector('.js-delete-element');
        delBtn.addEventListener('click', function () {
            contactClone.remove();
            deleteElement(contact);

            clearSearchPopup();
            lettersInfo = getAllContactsFromHTML();
            findSearchMatch(lettersInfo, document.querySelector('.js-search-input').value.toLowerCase().trim());
        });

    }
    //When click to Change at seach popup - opening new popup with filled fields with current contact values
    function setEditInputsValue(contactClone) {
        let contactCloneObj = textToObject(contactClone.textContent);
        document.querySelector('.js-edit-name-input').value = contactCloneObj.name;
        document.querySelector('.js-edit-vacancy-input').value = contactCloneObj.vacancy;
        document.querySelector('.js-edit-phone-input').value = contactCloneObj.phone;
    }

    //Confirm changes at seach
    function addConfirmEdit(contact, contactClone) {
        let contactObj = textToObject(contact.textContent);
        let contactCloneObj = textToObject(contactClone.textContent);

        let nameInput = document.querySelector('.js-edit-name-input');
        let vacancyInput = document.querySelector('.js-edit-vacancy-input');
        let phoneInput = document.querySelector('.js-edit-phone-input');

        let correctFirstInput = checkInput(nameInput);
        let correctSecondInput = checkInput(vacancyInput);
        let correctThirdInput = checkInput(phoneInput);

        if (correctFirstInput && correctSecondInput && correctThirdInput) {
            contactCloneObj.name = nameInput.value.trim();
            contactCloneObj.vacancy = vacancyInput.value.trim();
            contactCloneObj.phone = phoneInput.value.trim();

            if (checkEqualsInGlobalSet(contactCloneObj)) {
                toggleEditPopUp();

                changeInSet(contactObj, contactCloneObj);
                changeInArray(contactObj, contactCloneObj);
                changeInMainTable(contactObj, contactCloneObj);

                contact = objToText(contact, contactObj);
                contactClone = objToText(contactClone, contactCloneObj);


                clearSearchPopup();
                findSearchMatch(lettersInfo, document.querySelector('.js-search-input').value.toLowerCase().trim());

            } else {
                showErrorBlock("Contact List can't contain 2 equals contacts");
            }
        }
    }

    //Convert contact element in object type ti string view: Name: Andrew Vacancy: Programmer Phone: +1232131
    function objToText(contact, contactObj) {
        let icons = contact.innerHTML.split('<br>')[3];
        contact.innerText = `Name: ${contactObj.name}\n  Vacancy: ${contactObj.vacancy}\n  Phone: ${contactObj.phone}\n`;
        contact.innerHTML += icons;
        return contact;
    }

    //If globalSet not includes same value, adding element
    function changeInSet(contactObj, contactCloneObj) {
        for (let setElement of contactSet.keys()) {
            if (contactObj.name == setElement.name && contactObj.vacancy == setElement.vacancy && contactObj.phone == setElement.phone) {
                setElement.name = contactCloneObj.name;
                setElement.vacancy = contactCloneObj.vacancy;
                setElement.phone = contactCloneObj.phone;
            }
        }
    }

    //Chnaging in contact array('a': [[firstObject], [],[]]) - finding the right contact and changing his fields
    function changeInArray(contactObj, contactCloneObj) {
        let firstLetter = contactObj.name[0].toLowerCase();
        let letterContactsArray = letterContactsObj[firstLetter];

        for (let i = 0; i < letterContactsArray.length; i++) {
            if (letterContactsArray[i].name == contactObj.name && letterContactsArray[i].vacancy == contactObj.vacancy && letterContactsArray[i].phone == contactObj.phone) {
                letterContactsArray[i].name = contactCloneObj.name;
                letterContactsArray[i].vacancy = contactCloneObj.vacancy;
                letterContactsArray[i].phone = contactCloneObj.phone;
            }
        }
        letterContactsObj[firstLetter] = letterContactsArray;
    }

    function changeInMainTable(contactObj, contactCloneObj) {
        contactObj.name = contactCloneObj.name;
        contactObj.vacancy = contactCloneObj.vacancy;
        contactObj.phone = contactCloneObj.phone;
    }

    function isStartsWithText(elementObject, searchInputValue) {
        return elementObject.name.toLowerCase().startsWith(searchInputValue);
    }

    function getAllContactsFromHTML() {
        return document.querySelectorAll('.contact-table .js-letter-info');
    }

    function clearSearchPopup() {
        let popupOutput = document.querySelector('.js-popup-output');
        while (popupOutput.firstChild) {
            popupOutput.removeChild(popupOutput.firstChild);
        }
    }

    function clearSearchInput() {
        document.querySelector('.js-search-input').value = '';
    }
};