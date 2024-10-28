// Select necessary elements
const button_container = document.querySelector(".buttons");
const input_screen = document.getElementById("input-screen");
const result_screen = document.getElementById("result-screen");

// Data structure to manage calculator operations
let data = {
    operation: [],     // Stores the sequence of operations for display
    formula: [],       // Stores the sequence of operations for calculation
    base: null,        // Holds the base number for power operations
    isPowerActive: false // Tracks if a power operation is active
};

// Define calculator buttons with their properties
let calculator_buttons = [
    { name: "sin", symbol: "sin", formula: "Math.sin(", type: "trigo_function" },
    { name: "cos", symbol: "cos", formula: "Math.cos(", type: "trigo_function" },
    { name: "tan", symbol: "tan", formula: "Math.tan(", type: "trigo_function" },
    { name: "rad", symbol: "rad", formula: false, type: "key" },
    { name: "deg", symbol: "deg", formula: false, type: "key" },
    { name: "log", symbol: "log", formula: "Math.log10(", type: "math_function" },
    { name: "ln", symbol: "ln", formula: "Math.log(", type: "math_function" },
    { name: "open-parenthesis", symbol: "(", formula: "(", type: "parenthesis" },
    { name: "close-parenthesis", symbol: ")", formula: ")", type: "parenthesis" },
    { name: "inv", symbol: "inv", formula: false, type: "key" },
    { name: "factorial", symbol: "!", formula: "FACTORIAL(", type: "math_fact" },
    { name: "clear", symbol: "AC", formula: false, type: "key" },
    { name: "percent", symbol: "%", formula: "/100", type: "percentage" },
    { name: "delete", symbol: "⌫", formula: false, type: "key" },
    { name: "division", symbol: "÷", formula: "/", type: "operator" },
    { name: "power", symbol: "^", formula: "Math.pow(", type: "math_pow" },
    { name: "7", symbol: 7, formula: 7, type: "number" },
    { name: "8", symbol: 8, formula: 8, type: "number" },
    { name: "9", symbol: 9, formula: 9, type: "number" },
    { name: "multiplication", symbol: "×", formula: "*", type: "operator" },
    { name: "square-root", symbol: "√", formula: "Math.sqrt(", type: "math_function" },
    { name: "4", symbol: 4, formula: 4, type: "number" },
    { name: "5", symbol: 5, formula: 5, type: "number" },
    { name: "6", symbol: 6, formula: 6, type: "number" },
    { name: "subtraction", symbol: "-", formula: "-", type: "operator" },
    { name: "pi", symbol: "π", formula: "Math.PI", type: "constant" },
    { name: "1", symbol: 1, formula: 1, type: "number" },
    { name: "2", symbol: 2, formula: 2, type: "number" },
    { name: "3", symbol: 3, formula: 3, type: "number" },
    { name: "addition", symbol: "+", formula: "+", type: "operator" },
    { name: "e", symbol: "e", formula: "Math.E", type: "constant" },
    { name: "00", symbol: "00", formula: "00", type: "number" },
    { name: "0", symbol: 0, formula: 0, type: "number" },
    { name: "comma", symbol: ".", formula: ".", type: "decimal" },
    { name: "calculate", symbol: "=", formula: "=", type: "calculate" }
];

// Create calculator buttons and add them to the container
function createCalculatorButtons() {
    calculator_buttons.forEach(button => {
        const button_element = document.createElement("button");
        button_element.id = button.name;
        button_element.textContent = button.symbol;

        // Style buttons based on type
        if (button.type === "operator") button_element.classList.add("arithmetic-operators");
        else if (button.type === "number" || button.type === "decimal") button_element.classList.add("buttons-digits");
        else if (["math_function", "key", "trigo_function", "parenthesis", "percentage", "constant", "math_pow", "math_fact"].includes(button.type)) {
            button_element.classList.add("buttons-functionalities");
        } else if (button.type === "calculate") button_element.classList.add("get-result");

        // Add event listener for button clicks
        button_element.addEventListener("click", () => buttonClick(button));
        button_container.appendChild(button_element);
    });
}

// Handle button clicks and call respective functions based on type
function buttonClick(button) {
    if (button.type === "operator") handleOperator(button);
    else if (button.type === "number") handleNumber(button);
    else if (button.type === "math_function") handleMathFunction(button);
    else if (button.type === "math_pow") handlePowFunction(button);
    else if (button.type === "trigo_function") handleTrigoFunction(button);
    else if (button.type === "key") handleKey(button);
    else if (button.type === "parenthesis") handleParenthesis(button);
    else if (button.type === "percentage") handlePercentage(button);
    else if (button.type === "constant") handleConstant(button);
    else if (button.type === "decimal") handleDecimal(button);
    else if (button.type === "calculate") handleCalculate();
    else if (button.type === "math_fact") handleFactorial(button);

    updateDisplay(); // Update the calculator display after each click
}

// Handle the factorial button click
function handleFactorial(button) {
    // Get the last operand and wrap it with the factorial function
    let lastOperand = data.formula.pop();
    let factorialString = `calculateFactorial(${lastOperand})`;
    data.formula.push(factorialString);
    data.operation.push(button.symbol); // Display "!" on screen
}

// Basic arithmetic and number functions
function handleOperator(button) { data.operation.push(button.symbol); data.formula.push(button.formula); }
function handleNumber(button) {
    if (data.isPowerActive) {
        let exponent = button.symbol;
        let base = data.base;
        data.formula = [`Math.pow(${base},${exponent})`];
        data.operation.push(button.symbol);
        data.isPowerActive = false;
    } else {
        data.operation.push(button.symbol);
        data.formula.push(button.formula);
    }
}

// Handle special functions (power, trigonometric, etc.)
function handleMathFunction(button) { data.operation.push(button.symbol + "("); data.formula.push(button.formula); }
function handlePowFunction(button) { data.base = data.formula.join(''); data.isPowerActive = true; data.operation.push(button.symbol); updateDisplay(); }
function handleTrigoFunction(button) { data.operation.push(button.symbol + "("); data.formula.push(button.formula); }

// Special keys like AC (clear), DEL (delete), and inverse
function handleKey(button) {
    if (button.name === "clear") { data.operation = []; data.formula = []; result_screen.innerHTML = "0"; }
    else if (button.name === "delete") { data.operation.pop(); data.formula.pop(); }
    else if (button.name === "inv") handleInverse();
}

// Other functions for handling constants, decimals, and parenthesis
function handleParenthesis(button) { data.operation.push(button.symbol); data.formula.push(button.formula); }
function handlePercentage(button) { data.operation.push(button.symbol); data.formula.push(button.formula); }
function handleConstant(button) { data.operation.push(button.symbol); data.formula.push(button.formula); }
function handleDecimal(button) { data.operation.push(button.symbol); data.formula.push(button.formula); }

// Calculate the result when "=" is clicked
function handleCalculate() {
    let formula_str = data.formula.join('');
    try {
        // Replace custom factorial calls with results
        formula_str = formula_str.replace(/calculateFactorial\((\d+)\)/g, (match, number) => calculateFactorial(Number(number)));
        let result = eval(formula_str); // Use eval for calculation
        if (!isFinite(result)) { result_screen.textContent = "Error"; return; }
        result = Math.round(result * 1e8) / 1e8; // Round to avoid floating-point issues
        result_screen.textContent = result;
        data.operation = [result.toString()]; data.formula = [result.toString()];
    } catch (error) { result_screen.textContent = "Error"; data.operation = []; data.formula = []; }
}

// Factorial calculation helper
function calculateFactorial(number) { return (number <= 1) ? 1 : number * calculateFactorial(number - 1); }

// Update display with the current operation
function updateDisplay() { input_screen.textContent = data.operation.join(''); }

// Initialize calculator on page load
createCalculatorButtons();
