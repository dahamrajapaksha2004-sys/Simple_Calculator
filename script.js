
const display = document.getElementById("display");

function appendValue(value) {
    if (display.value === "Error") {
        display.value = "";
    }

    const operators = ["+", "-", "*", "/"];
    const lastChar = display.value.slice(-1);

    if (operators.includes(value)) {
        if (display.value === "") {
            if (value === "-") {
                display.value = value;
            }
            return;
        }

        if (operators.includes(lastChar)) {
            if (value === "-" && lastChar !== "-") {
                display.value += value;
                return;
            }

            display.value =
                display.value.slice(0, -1) + value;
            return;
        }

        if (lastChar === ".") return;
    }

    if (value === ".") {
        const currentNumber =
            display.value.split(/[+\-*/]/).pop();

        if (currentNumber.includes(".")) return;

        if (currentNumber === "") {
            display.value += "0";
        }
    }

    display.value += value;
}

function clearDisplay() {
    display.value = "";
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    try {
        const expression = display.value;

        if (!/^[0-9+\-*/. ]+$/.test(expression)) {
            throw new Error("Invalid expression");
        }

        if (expression.trim() === "") return;

        // Evaluate only validated arithmetic characters.
        const result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (!Number.isFinite(result)) {
            throw new Error("Invalid result");
        }

        display.value =
            String(Number(result.toPrecision(12)));

    } catch (error) {
        display.value = "Error";
    }
}

// Keyboard support
document.addEventListener("keydown", function(event) {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        appendValue(key);
    } else if (["+", "-", "*", "/", "."].includes(key)) {
        event.preventDefault();
        appendValue(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    } else if (key === "Backspace") {
        deleteLast();
    } else if (key === "Escape") {
        clearDisplay();
    }
});
