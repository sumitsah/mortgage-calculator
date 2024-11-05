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
        console.log(el.value)
        let beforeValue = el.value;
        e.target.addEventListener("input", function () {
            console.log(el.validity.patternMismatch)
            if (el.validity.patternMismatch) {
                el.value = beforeValue;
                console.log(el.value)
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
        } else {
            input.parentElement.classList.remove('red');
        }
    })
    input.addEventListener('input', () => {
        if (!input.checkValidity()) {
            input.parentElement.classList.add('red');
        } else {
            input.parentElement.classList.remove('red');
        }
    })
})

let formData = new FormData(form);
let repayment = false;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    formData = new FormData(form);
    let invalidData = false;

    inputs.forEach((input) => {
        if (input.value === '') {
            input.parentElement.classList.add('red');
            invalidData = true;
        } else {
            console.log(input.checkValidity());
            input.parentElement.classList.remove('red');
        }
    })

    if (!repay.checked && !interest.checked) {
        interest.parentElement.classList.add('red')
        repay.parentElement.classList.add('red')
        return;
    }

    if (invalidData) {
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
    form.reset();
    interest.parentElement.classList.remove('lime');
    repay.parentElement.classList.remove('lime');
    actualResult.classList.add('display-switch');
    result.classList.remove('display-switch');
    interest.parentElement.classList.remove('red')
    repay.parentElement.classList.remove('red')

    inputs.forEach((input) => {
        input.parentElement.classList.remove('red');
    })
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
    } else {
        repayment = true;
        e.target.parentElement.classList.remove('lime')
    }

    if (!repay.checked) {
        repay.parentElement.classList.remove('lime')
    }
})