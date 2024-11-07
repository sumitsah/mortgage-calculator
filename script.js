const form = document.querySelector('.calculator-form');
const formBtn = document.querySelector('.submit-btn');
const clearBtn = document.querySelector('.clear-all');
const repay = document.querySelector('#repay');
const interest = document.querySelector('#interest');
const calculatedPayments = document.querySelector('.calculated-payments');
const repayTerm = document.querySelector('.repay-term');
const result = document.querySelector('.result');
const actualResult = document.querySelector('.actual-result');
const repayInterest = document.querySelector('.repay-interest');
const numericInputs = document.querySelectorAll("[inputmode='decimal']");
const inputs = document.querySelectorAll("input");

numericInputs.forEach((input) => {
    validateInput(input);
});

function validateInput(el) {
    el.addEventListener("beforeinput", function (e) {
        let beforeValue = el.value;
        e.target.addEventListener("input", function () {
            if (el.validity.patternMismatch) {
                el.value = beforeValue;
            }
        },
            { once: true }
        );
    });
}

inputs.forEach((input) => {
    input.addEventListener('change', () => {
        if (!input.checkValidity()) {
            input.parentElement.classList.add('red');
            input.parentElement.parentElement.nextElementSibling.classList.add('show-error');
        } else {
            input.parentElement.classList.remove('red');
            input.parentElement.parentElement.nextElementSibling.classList.remove('show-error');
        }
    })
    input.addEventListener('input', () => {
        if (!input.checkValidity()) {
            input.parentElement.classList.add('red');
            input.parentElement.parentElement.nextElementSibling.classList.add('show-error');
        } else {
            input.parentElement.classList.remove('red');
            input.parentElement.parentElement.nextElementSibling.classList.remove('show-error');
        }
    })
})

let formData = new FormData(form);
let repayment = false;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    formData = new FormData(form);
    let invalidData = -1, i = 0, invalidForm = false;

    inputs.forEach((input) => {
        if (input.value === '') {
            input.parentElement.classList.add('red');
            input.parentElement.parentElement.nextElementSibling.classList.add('show-error');
            if (invalidData === -1) {
                invalidData = i;
            }
            invalidForm = true;
        } else {
            input.parentElement.classList.remove('red');
            input.parentElement.parentElement.nextElementSibling.classList.remove('show-error');
        }
        i++;
    })

    // Focus on the first inavlid field in the form
    if (invalidData !== -1) {
        inputs[invalidData].focus();
    }

    if (!repay.checked && !interest.checked) {
        interest.parentElement.classList.add('red')
        repay.parentElement.classList.add('red')
        interest.parentElement.nextElementSibling.classList.add('show-error');
        repay.parentElement.nextElementSibling.nextElementSibling.classList.add('show-error');
        return;
    }

    if (invalidForm) {
        return;
    }

    let mortgageAmount = formData.get('mortgageAmount');
    let interestRate = formData.get('interestRate');
    let mortgageTerm = formData.get('mortgageTerm');

    let monthlyI = (parseFloat(interestRate) / 100) / 12;

    let months = parseInt(mortgageTerm) * 12;

    let P = parseInt(mortgageAmount);

    let EMI = monthlyPayment(P, months, monthlyI);

    result.classList.add('display-switch');
    actualResult.classList.remove('display-switch');
    if (repayment) {
        repayInterest.parentElement.classList.add('display-switch');
        repayTerm.parentElement.classList.remove('display-switch');

        calculatedPayments.innerText = `₹${numberWithCommas(EMI.toFixed(2))}`
        repayTerm.innerText = `₹${numberWithCommas((EMI * months).toFixed(2))}`
    } else {
        repayInterest.parentElement.classList.remove('display-switch');
        repayInterest.parentElement.previousElementSibling.classList.add('display-switch');
        repayInterest.innerText = `₹${numberWithCommas(((EMI * months) - mortgageAmount).toFixed(2))}`
    }
})

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

clearBtn.addEventListener('click', () => {
    interest.parentElement.classList.remove('lime');
    repay.parentElement.classList.remove('lime');

    actualResult.classList.add('display-switch');
    result.classList.remove('display-switch');

    interest.parentElement.classList.remove('red');
    repay.parentElement.classList.remove('red');

    repay.parentElement.nextElementSibling.nextElementSibling.classList.remove('show-error');
    interest.parentElement.nextElementSibling.classList.remove('show-error');

    inputs.forEach((input) => {
        input.parentElement.classList.remove('red');
        input.parentElement.parentElement.nextElementSibling.classList.remove('show-error');
    })
    form.reset();
})

function monthlyPayment(p, n, i) {
    return p * i * (Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}


repay.addEventListener('click', (e) => {
    if (repay.checked) {
        repayment = true;
        repay.classList.add('lime');
        e.target.parentElement.classList.add('lime')
        interest.parentElement.classList.remove('red')
        repay.parentElement.nextElementSibling.nextElementSibling.classList.remove('show-error');
    } else {
        repayment = false;
        e.target.parentElement.classList.remove('lime')
    }

    if (!interest.checked) {
        interest.parentElement.classList.remove('lime')
    }
})

interest.addEventListener('click', (e) => {
    if (interest.checked) {
        repayment = false;
        e.target.parentElement.classList.add('lime');
        repay.parentElement.classList.remove('red');
        interest.parentElement.nextElementSibling.classList.remove('show-error');
    } else {
        repayment = true;
        e.target.parentElement.classList.remove('lime')
    }

    if (!repay.checked) {
        repay.parentElement.classList.remove('lime')
    }
})