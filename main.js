/**
 * Professional Calculator - Main Logic
 * Author: Yassir Rzigui - Full-Stack Developer & AI Specialist
 * Email: rziguiyassir@gmail.com
 * GitHub: https://github.com/yazzy01
 * LinkedIn: https://linkedin.com/in/yassir-rzigui
 */

class ProfessionalCalculator {
    constructor() {
        this.display = document.getElementById('display');
        this.historyDisplay = document.getElementById('history-display');
        this.historyList = document.getElementById('history-list');
        this.currentInput = '';
        this.operator = '';
        this.previousInput = '';
        this.shouldResetDisplay = false;
        this.history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];
        this.isScientificMode = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadHistory();
        this.setupKeyboardSupport();
        this.setupModeToggle();
    }

    setupEventListeners() {
        // Number buttons
        document.querySelectorAll('[data-number]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.inputNumber(e.target.dataset.number);
            });
        });

        // Operator buttons
        document.querySelectorAll('[data-operator]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.inputOperator(e.target.dataset.operator);
            });
        });

        // Action buttons
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleAction(e.target.dataset.action);
            });
        });

        // Function buttons (scientific)
        document.querySelectorAll('[data-function]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFunction(e.target.dataset.function);
            });
        });

        // Clear history
        document.getElementById('clear-history').addEventListener('click', () => {
            this.clearHistory();
        });
    }

    setupKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            e.preventDefault();
            
            if (e.key >= '0' && e.key <= '9' || e.key === '.') {
                this.inputNumber(e.key);
            } else if (['+', '-', '*', '/'].includes(e.key)) {
                this.inputOperator(e.key);
            } else if (e.key === 'Enter' || e.key === '=') {
                this.handleAction('calculate');
            } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
                this.handleAction('clear');
            } else if (e.key === 'Backspace') {
                this.handleAction('delete');
            } else if (e.key === '%') {
                this.handleAction('percent');
            }
        });
    }

    setupModeToggle() {
        const basicModeBtn = document.getElementById('basic-mode');
        const scientificModeBtn = document.getElementById('scientific-mode');
        const basicButtons = document.querySelector('.basic-buttons');
        const scientificButtons = document.querySelector('.scientific-buttons');

        basicModeBtn.addEventListener('click', () => {
            this.isScientificMode = false;
            basicModeBtn.classList.add('active');
            scientificModeBtn.classList.remove('active');
            basicButtons.style.display = 'grid';
            scientificButtons.style.display = 'none';
        });

        scientificModeBtn.addEventListener('click', () => {
            this.isScientificMode = true;
            scientificModeBtn.classList.add('active');
            basicModeBtn.classList.remove('active');
            basicButtons.style.display = 'none';
            scientificButtons.style.display = 'grid';
        });
    }

    inputNumber(number) {
        if (this.shouldResetDisplay) {
            this.display.value = '';
            this.shouldResetDisplay = false;
        }

        if (number === '.' && this.display.value.includes('.')) {
            return;
        }

        if (this.display.value === '0' && number !== '.') {
            this.display.value = number;
        } else {
            this.display.value += number;
        }
    }

    inputOperator(operator) {
        if (this.operator && !this.shouldResetDisplay) {
            this.calculate();
        }

        this.previousInput = this.display.value;
        this.operator = operator;
        this.shouldResetDisplay = true;
        
        // Update history display
        this.historyDisplay.textContent = `${this.previousInput} ${this.getOperatorSymbol(operator)}`;
    }

    getOperatorSymbol(operator) {
        const symbols = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷'
        };
        return symbols[operator] || operator;
    }

    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'delete':
                this.delete();
                break;
            case 'calculate':
                this.calculate();
                break;
            case 'percent':
                this.percent();
                break;
            case 'parentheses':
                this.toggleParentheses();
                break;
        }
    }

    handleFunction(func) {
        const value = parseFloat(this.display.value);
        let result;

        switch (func) {
            case 'sin':
                result = Math.sin(this.toRadians(value));
                break;
            case 'cos':
                result = Math.cos(this.toRadians(value));
                break;
            case 'tan':
                result = Math.tan(this.toRadians(value));
                break;
            case 'log':
                result = Math.log10(value);
                break;
            case 'ln':
                result = Math.log(value);
                break;
            case 'sqrt':
                result = Math.sqrt(value);
                break;
            case 'pow':
                result = Math.pow(value, 2);
                break;
            case 'factorial':
                result = this.factorial(Math.floor(value));
                break;
            case 'pi':
                this.display.value = Math.PI.toString();
                return;
            case 'e':
                this.display.value = Math.E.toString();
                return;
        }

        if (result !== undefined) {
            const calculation = `${func}(${value})`;
            this.display.value = this.formatResult(result);
            this.addToHistory(calculation, this.display.value);
        }
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    clear() {
        this.display.value = '0';
        this.historyDisplay.textContent = '';
        this.currentInput = '';
        this.previousInput = '';
        this.operator = '';
        this.shouldResetDisplay = false;
    }

    delete() {
        if (this.display.value.length > 1) {
            this.display.value = this.display.value.slice(0, -1);
        } else {
            this.display.value = '0';
        }
    }

    percent() {
        const value = parseFloat(this.display.value);
        this.display.value = (value / 100).toString();
    }

    toggleParentheses() {
        // Simple parentheses implementation
        if (this.display.value.includes('(')) {
            this.display.value += ')';
        } else {
            this.display.value += '(';
        }
    }

    calculate() {
        if (!this.operator || this.shouldResetDisplay) return;

        const current = parseFloat(this.display.value);
        const previous = parseFloat(this.previousInput);
        let result;

        try {
            switch (this.operator) {
                case '+':
                    result = previous + current;
                    break;
                case '-':
                    result = previous - current;
                    break;
                case '*':
                    result = previous * current;
                    break;
                case '/':
                    if (current === 0) {
                        throw new Error('Cannot divide by zero');
                    }
                    result = previous / current;
                    break;
            }

            const calculation = `${previous} ${this.getOperatorSymbol(this.operator)} ${current}`;
            this.display.value = this.formatResult(result);
            this.addToHistory(calculation, this.display.value);
            
            this.historyDisplay.textContent = '';
            this.operator = '';
            this.shouldResetDisplay = true;

        } catch (error) {
            this.display.value = 'Error';
            this.shouldResetDisplay = true;
        }
    }

    formatResult(result) {
        if (isNaN(result) || !isFinite(result)) {
            return 'Error';
        }

        // Format large numbers in scientific notation
        if (Math.abs(result) > 1e10 || (Math.abs(result) < 1e-6 && result !== 0)) {
            return result.toExponential(6);
        }

        // Round to avoid floating point precision issues
        return parseFloat(result.toPrecision(12)).toString();
    }

    addToHistory(calculation, result) {
        const historyItem = {
            calculation,
            result,
            timestamp: new Date().toLocaleTimeString()
        };

        this.history.unshift(historyItem);
        
        // Keep only last 50 calculations
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }

        this.saveHistory();
        this.updateHistoryDisplay();
    }

    saveHistory() {
        localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
    }

    loadHistory() {
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        if (this.history.length === 0) {
            this.historyList.innerHTML = '<p class="no-history">No calculations yet</p>';
            return;
        }

        this.historyList.innerHTML = this.history.map(item => `
            <div class="history-item" onclick="calculator.loadFromHistory('${item.result}')">
                <div class="calculation">${item.calculation}</div>
                <div class="result">= ${item.result}</div>
                <div class="timestamp">${item.timestamp}</div>
            </div>
        `).join('');
    }

    loadFromHistory(result) {
        this.display.value = result;
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
        this.updateHistoryDisplay();
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new ProfessionalCalculator();
    console.log('Professional Calculator initialized by Yassir Rzigui');
});