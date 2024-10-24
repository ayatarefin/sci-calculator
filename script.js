//Select Elements
const button_container = document.querySelector(".buttons");
const input_screen = document.getElementById("input-screen");
const result_screen = document.getElementById("result-screen");

let data = {
    operation: [],
    formula: [],
    base: null, // To store the base number before the power
    isPowerActive: false // To track if the power button was clicked
};

// CALCULATOR BUTTONS
let calculator_buttons = [
    {
        name: "sin",
        symbol: "sin",
        formula: "Math.sin(", //Math.sin for sine function
        type: "trigo_function"
    },
    {
        name: "cos",
        symbol: "cos",
        formula: "Math.cos(", //Math.cos for cosine function
        type: "trigo_function"
    },
    {
        name: "tan",
        symbol: "tan",
        formula: "Math.tan(", //Math.tan for tangent function
        type: "trigo_function"
    },
    {
        name: "rad",
        symbol: "rad",
        formula: false,
        type: "key"
    },
    {
        name: "deg",
        symbol: "deg",
        formula: false,
        type: "key"
    },
    {
        name: "log",
        symbol: "log",
        formula: "Math.log10(", //Math.log10 for base-10 logarithm
        type: "math_function"
    },
    {
        name: "ln",
        symbol: "ln",
        formula: "Math.log(", //Math.log for natural logarithm
        type: "math_function"
    },
    {
        name: "open-parenthesis",
        symbol: "(",
        formula: "(",
        type: "parenthesis"
    },
    {
        name: "close-parenthesis",
        symbol: ")",
        formula: ")",
        type: "parenthesis"
    },
    {
        name: "inv",
        symbol: "inv",
        formula: false,
        type: "key"
    },
    {
        name: "factorial",
        symbol: "!",
        formula: "FACTORIAL(", // for custom factorial logic
        type: "math_function"
    },
    {
        name: "clear",
        symbol: "AC",
        formula: false,
        type: "key"
    },
    {
        name: "percent",
        symbol: "%",
        formula: "/100", // This will work for percentage calculations
        type: "percentage"
    },
    {
        name: "delete",
        symbol: "⌫",
        formula: false,
        type: "key"
    },
    {
        name: "division",
        symbol: "÷",
        formula: "/", // Division operator
        type: "operator"
    },
    {
        name: "power",
        symbol: "^",
        formula: "Math.pow(", //Math.pow for power function
        type: "math_pow"
    },
    {
        name: "7",
        symbol: 7,
        formula: 7,
        type: "number"
    },
    {
        name: "8",
        symbol: 8,
        formula: 8,
        type: "number"
    },
    {
        name: "9",
        symbol: 9,
        formula: 9,
        type: "number"
    },
    {
        name: "multiplication",
        symbol: "×",
        formula: "*", // Multiplication operator
        type: "operator"
    },
    {
        name: "square-root",
        symbol: "√",
        formula: "Math.sqrt(", // Math.sqrt for square root function
        type: "math_function"
    },
    {
        name: "4",
        symbol: 4,
        formula: 4,
        type: "number"
    },
    {
        name: "5",
        symbol: 5,
        formula: 5,
        type: "number"
    },
    {
        name: "6",
        symbol: 6,
        formula: 6,
        type: "number"
    },
    {
        name: "subtraction",
        symbol: "-",
        formula: "-", // Subtraction operator
        type: "operator"
    },
    {
        name: "pi",
        symbol: "π",
        formula: "Math.PI", // Use Math.PI for the value of pi
        type: "constant"
    },
    {
        name: "1",
        symbol: 1,
        formula: 1,
        type: "number"
    },
    {
        name: "2",
        symbol: 2,
        formula: 2,
        type: "number"
    },
    {
        name: "3",
        symbol: 3,
        formula: 3,
        type: "number"
    },
    {
        name: "addition",
        symbol: "+",
        formula: "+", // Addition operator
        type: "operator"
    },
    {
        name: "e",
        symbol: "e",
        formula: "Math.E", // Use Math.E for the value of e
        type: "constant"
    },
    {
        name: "00",
        symbol: "00",
        formula: "00", // Representing double zero
        type: "number"
    },
    {
        name: "0",
        symbol: 0,
        formula: 0,
        type: "number"
    },
    {
        name: "comma",
        symbol: ".",
        formula: ".", // Decimal point
        type: "decimal"
    },
    {
        name: "calculate",
        symbol: "=",
        formula: "=", // Equal sign for calculation
        type: "calculate"
    }
];


// Create Calculator Buttons
function createCalculatorButtons() {
    calculator_buttons.forEach(button => {
        const button_element = document.createElement("button");
        button_element.id = button.name;
        button_element.textContent = button.symbol;

        if (button.type === "operator") {
            button_element.classList.add("arithmetic-operators");
        } else if (button.type === "number") {
            button_element.classList.add("buttons-digits");
        } else if (button.type === "math_function" || button.type === "key" || button.type === "trigo_function" || button.type === "scope") {
            button_element.classList.add("buttons-functionalities");
        } else if (button.type === "calculate") {
            button_element.classList.add("get-result");
        }

        button_element.addEventListener("click", () => buttonClick(button));
        button_container.appendChild(button_element);
    });
}

// Button Click Handler
function buttonClick(button) {
    if (button.type === "operator") {
      handleOperator(button);
    } else if (button.type === "number") {
      handleNumber(button);
    } else if (button.type === "math_function") {
      handleMathFunction(button);
    } else if (button.type === "math_pow") {
        handlePowFunction(button);
    }else if (button.type === "trigo_function") {
        handleTrigoFunction(button);
    } else if (button.type === "key") {
      handleKey(button);
    } else if (button.type === "parenthesis") {
      handleParenthesis(button);
    } else if (button.type === "percentage") {
      handlePercentage(button);
    } else if (button.type === "constant") {
      handleConstant(button);
    } else if (button.type === "decimal") {
      handleDecimal(button);
    } else if (button.type === "calculate") {
      handleCalculate();
    }
    updateDisplay();
  }
  

// Handle Different Button Types
function handleOperator(button) {
    data.operation.push(button.symbol);
    data.formula.push(button.formula);
  }
  
  // Handle Number
  function handleNumber(button) {
    // If the power function is active, treat the number as the exponent
    if (data.isPowerActive) {
        let exponent = button.symbol;
        let base = data.base;

        // Append the Math.pow(base, exponent) formula
        data.formula = [`Math.pow(${base},${exponent})`]; // Replace formula with power function
        data.operation.push(button.symbol); // Add the exponent to the operation display
        
        // Reset the power active state
        data.isPowerActive = false;
    } else {
        // Regular number handling
        data.operation.push(button.symbol);
        data.formula.push(button.formula);
    }
}

// Handle Math Function
function handleMathFunction(button) {
    let symbol = button.symbol + "(";
    let formula = button.formula;
  
    data.operation.push(symbol);
    data.formula.push(formula);
  }
//Handle power Function
function handlePowFunction(button) {
    // Set the base (current number before ^)
    data.base = data.formula.join(''); // Join current formula to store base
    
    // Indicate power operation is active
    data.isPowerActive = true;
    
    // Show the ^ symbol on the screen
    data.operation.push(button.symbol);
    
    updateDisplay();
}
  // Handle Trigonometric Function
function handleTrigoFunction(button) {
    let symbol = button.symbol + "(";
    let formula = button.formula;
  
    data.operation.push(symbol);
    data.formula.push(formula);
  }

// Handle Special Keys (AC, DEL, etc.)
function handleKey(button) {
    if (button.name === "clear") {
      data.operation = [];
      data.formula = [];
      result_screen.innerHTML = "0";
    } else if (button.name === "delete") {
      data.operation.pop();
      data.formula.pop();
    } else if (button.name === "inv") {
      handleInverse();
    }
  }

// Handle Parenthesis
function handleParenthesis(button) {
    data.operation.push(button.symbol);
    data.formula.push(button.formula);
  }

// Handle Percentage
function handlePercentage(button) {
    data.operation.push(button.symbol);
    data.formula.push(button.formula);
  }
  
// Handle Constants (π, e, etc.)
function handleConstant(button) {
    data.operation.push(button.symbol);
    data.formula.push(button.formula);
  }
  
// Handle Decimal Point
function handleDecimal(button) {
    data.operation.push(button.symbol);
    data.formula.push(button.formula);
  }

// Handle Calculation
function handleCalculate() {
    // Join the formula array to create a string for evaluation
    let formula_str = data.formula.join('');
    
    try {
        // Use eval to calculate the result
        let result = eval(formula_str);

        // Handle undefined or infinity
        if (!isFinite(result)) {
            result_screen.textContent = "Error";
            return;
        }

        // Round to 8 decimal places to avoid floating point issues
        result = Math.round(result * 1e8) / 1e8;
        result_screen.textContent = result;

        // Store result for next operation
        data.operation = [result.toString()];
        data.formula = [result.toString()];
    } catch (error) {
        result_screen.textContent = "Error";
        data.operation = [];
        data.formula = [];
    }
}


// Helper Functions
function calculateFactorial(num) {
    if (num === 0 || num === 1) return 1;
    let result = 1;
    for (let i = 2; i <= num; i++) {
        result *= i;
    }
    return result;
}

function updateDisplay() {
    input_screen.textContent = data.operation.join('');
}

// Initialize Calculator
createCalculatorButtons();