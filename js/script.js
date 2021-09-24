/*
Treehouse Techdegree:
Project 3 - Interactive form
*/

/*
Variables
*/
const forms = document.querySelector('form'),
  userName = document.getElementById('name'),
  email = document.getElementById('email'),
  creditCard = document.getElementById('cc-num'),
  zipCode = document.getElementById('zip'),
  cvv = document.getElementById('cvv'),
  selectRole = document.getElementById('title'),
  selectOtherRole = document.getElementById('other-job-role'),
  selectShirtDesign = document.getElementById('design'),
  selectShirtColor = document.getElementById('color'),
  activities = document.querySelector('#activities'),
  activityCheckboxes = activities.querySelectorAll('input[type="checkbox"]'),
  creditCardContainer = document.getElementById('credit-card'),
  paypalContainer = document.getElementById('paypal'),
  bitcoinContainer = document.getElementById('bitcoin');

/*
'focusFirstField' function
Focuses on first name field
*/
const focusFirstField = () => {
  userName.focus();
};

/*
'toggleOtherJobRole' function
Toggles 'Other User Role' select box if 'Other' is selected in 'Job Role' select box
*/
const toggleOtherJobRole = () => {
  if (selectRole.value === 'other') {
    selectOtherRole.style.display = 'inherit';
  } else {
    selectOtherRole.style.display = 'none';
  }
};

/*
'toggleShirtColors' function
Used to display shirt color select and show/hide appropriate colors based on design selection
*/
const toggleShirtColors = () => {
  const shirtDesignVal = selectShirtDesign.value;
  const shirtColorOptions = selectShirtColor.children;

  selectShirtColor.removeAttribute('disabled');

  for (let i = 0; i < shirtColorOptions.length; i++) {
    const theme = shirtColorOptions[i].dataset.theme;
    shirtColorOptions[i].hidden = true;
    shirtColorOptions[i].removeAttribute('selected');

    if (theme === shirtDesignVal) {
      shirtColorOptions[i].hidden = false;
      shirtColorOptions[i].setAttribute('selected', 'selected');
    }
  }
}

/*
'generateActivityPrice' function
Calculates and populates activity total price
*/
const generateActivityPrice = () => {
  const costDisplay = document.querySelector('#activities-cost');
  const totalText = document.querySelector('#activities-cost').textContent;
  let totalPrice = 0;

  for (let i = 0; i < activityCheckboxes.length; i++) {
    activityCheckboxes[i].addEventListener('change', () => {
      const cost = parseInt(activityCheckboxes[i].dataset.cost);

      if (activityCheckboxes[i].checked){
        totalPrice = totalPrice + cost;
      } else {
        totalPrice = totalPrice - cost;
      }

      costDisplay.textContent = totalText.replace(/[^$]*$/, totalPrice);
    });
  }
};

/*
'togglePaymentInfo' function
Displays correct payment info section based on user selection
*/
const togglePaymentInfo = () => {
  const selectPaymentInfo = document.getElementById('payment');

  const hideAllPaymentContainers = () => {
    creditCardContainer.style.display = 'none';
    paypalContainer.style.display = 'none';
    bitcoinContainer.style.display = 'none';
  }

  const togglePaymentContainer = (value) => {
    hideAllPaymentContainers();
    document.getElementById(value).style.display = 'block';
  }

  // Select first option by default (ie credit card)
  selectPaymentInfo.selectedIndex = 1;

  // Hide all payment containers and only show credit card
  hideAllPaymentContainers();
  togglePaymentContainer(selectPaymentInfo.value);

  // Add listener to toggle payment section
  selectPaymentInfo.addEventListener('change', () => {
    togglePaymentContainer(selectPaymentInfo.value);
  });
};

/*
'addCheckboxFocus' and 'removeCheckboxFocus' functions
These functions help with ADA focus requirements for checkboxes
*/
const addCheckboxFocus = (e) => {
  const parentLabel = e.target.parentElement;
  parentLabel.classList.add('focus');
};

const removeCheckboxFocus = (e) => {
  const parentLabel = e.target.parentElement;
  parentLabel.classList.remove('focus');
}

/*
'isValidUsername' function
Validates username (Cannot be blank or empty)
*/
const isValidUsername = () => {
  const usernameValue = userName.value;
  return /^\w+/.test(usernameValue);
};

/*
'isValidEmail' function
Validates formatted email address
*/
const isValidEmail = () => {
  const emailValue = email.value;
  return /^[^@]+@[^@.]+\.[a-z]+$/i.test(emailValue);
};

/*
'isValidActivities' function
Validates if at least one activity is chosen
*/
const isValidActivities = () => {
  const activitiesChecked = document.querySelectorAll('input[type="checkbox"]:checked').length;
  return activitiesChecked > 0;
};

/*
'isValidCreditCard' function
Validates formatted credit card
*/
const isValidCreditCard = () => {
  const ccValue = creditCard.value;
  return /^[0-9]{13,16}$/.test(ccValue);
};

/*
'isValidZipCode' function
Validates formatted zip code
*/
const isValidZipCode = () => {
  const zipValue = zipCode.value;
  return /^[0-9]{5}$/.test(zipValue);
};

/*
'isValidCvv' function
Validates formatted CVV
*/
const isValidCvv = () => {
  const cvvValue = cvv.value;
  return /^[0-9]{3}$/.test(cvvValue);
};

/*
'showHideError' function'
Displays error styling and hint if invalid
*/
const showHideError = (show, error, parent) => {
  if (show) {
    parent.classList.add('not-valid');
    error.style.display = 'block';
  } else {
    parent.classList.remove('not-valid');
    parent.classList.add('valid');
    error.style.display = 'none';
  }
};

/*
'createListener' function'
[input] parameter is the input being passed in for validation
[validator] parameter passes in input-specific validator function
Creates a listener and passes the appropriate element values to determine if the value is valid
*/
const createListener = (input, validator) => {
  const thisInput = input.target ? input.target : input;
  const isValid = validator(thisInput.value);
  const showError = !isValid;
  let inputParent = thisInput.parentElement;

  if (input.type === 'checkbox') {
    inputParent = thisInput.parentElement.parentElement.parentElement;
  }

  const error = inputParent.lastElementChild;

  showHideError(showError, error, inputParent);
};

/*
'formSubmit' function'
Executes the form submission checking for errors and displaying them
*/
const formSubmit = (e) => {
  const userNameValid = isValidUsername();
  const emailValid = isValidEmail();
  const creditCardValid = isValidCreditCard();
  const zipCodeValid = isValidZipCode();
  const cvvValid = isValidCvv();
  const activitiesValid = isValidActivities();

  if (!userNameValid || !emailValid || !activitiesValid) {
    e.preventDefault();
    createListener(userName, isValidUsername);
    createListener(email, isValidEmail);
    for (let i = 0; i < activityCheckboxes.length; i++) {
      createListener(activityCheckboxes[i], isValidActivities);
    }
  }

  // Check if credit card is active and validate fields
  if (creditCardContainer.style.display === 'block') {
    if (!creditCardValid || !zipCodeValid || !cvvValid) {
      e.preventDefault();
      createListener(creditCard, isValidCreditCard);
      createListener(zipCode, isValidZipCode);
      createListener(cvv, isValidCvv);
    }
  }
};

/*
'init' function
Groups all functions and events
*/
const init = () => {
  // Functions
  focusFirstField();
  generateActivityPrice();
  togglePaymentInfo();

  // Toggle 'other' job role select
  selectOtherRole.style.display = 'none';
  selectRole.addEventListener('change', toggleOtherJobRole);

  // initiate shirt function
  selectShirtColor.setAttribute('disabled', 'disabled');
  selectShirtDesign.addEventListener('change', toggleShirtColors);

  // Validation on input change
  userName.addEventListener('input', () => {
    createListener(userName, isValidUsername);
  });
  email.addEventListener('input', () => {
    createListener(email, isValidEmail);
  });
  creditCard.addEventListener('input', () => {
    createListener(creditCard, isValidCreditCard);
  });
  zipCode.addEventListener('input', () => {
    createListener(zipCode, isValidZipCode);
  });
  cvv.addEventListener('input', () => {
    createListener(cvv, isValidCvv);
  });

  // Toggle checkbox focus states
  for (let i = 0; i < activityCheckboxes.length; i++) {
    activityCheckboxes[i].addEventListener('focus', addCheckboxFocus);
    activityCheckboxes[i].addEventListener('blur', removeCheckboxFocus);
  }

  // Form submission
  forms.addEventListener('submit', formSubmit);
};


// Initiate all functions
init();