/**
 * Scientific Calculator Functions
 * Author: Yassir Rzigui - Full-Stack Developer & AI Specialist
 * Advanced mathematical functions for scientific calculator mode
 */

class ScientificCalculator {
    constructor() {
        this.angleMode = 'degrees'; // 'degrees' or 'radians'
        this.memory = 0;
        this.constants = {
            pi: Math.PI,
            e: Math.E,
            phi: (1 + Math.sqrt(5)) / 2, // Golden ratio
            sqrt2: Math.sqrt(2),
            sqrt3: Math.sqrt(3)
        };
    }

    // Advanced trigonometric functions
    inverseSin(value) {
        const result = Math.asin(value);
        return this.angleMode === 'degrees' ? this.toDegrees(result) : result;
    }

    inverseCos(value) {
        const result = Math.acos(value);
        return this.angleMode === 'degrees' ? this.toDegrees(result) : result;
    }

    inverseTan(value) {
        const result = Math.atan(value);
        return this.angleMode === 'degrees' ? this.toDegrees(result) : result;
    }

    // Hyperbolic functions
    sinh(value) {
        return Math.sinh(this.angleMode === 'degrees' ? this.toRadians(value) : value);
    }

    cosh(value) {
        return Math.cosh(this.angleMode === 'degrees' ? this.toRadians(value) : value);
    }

    tanh(value) {
        return Math.tanh(this.angleMode === 'degrees' ? this.toRadians(value) : value);
    }

    // Logarithmic functions
    log2(value) {
        return Math.log2(value);
    }

    logBase(value, base) {
        return Math.log(value) / Math.log(base);
    }

    // Power and root functions
    power(base, exponent) {
        return Math.pow(base, exponent);
    }

    nthRoot(value, n) {
        return Math.pow(value, 1/n);
    }

    cube(value) {
        return Math.pow(value, 3);
    }

    cubeRoot(value) {
        return Math.cbrt(value);
    }

    // Statistical functions
    permutation(n, r) {
        if (n < 0 || r < 0 || r > n) return NaN;
        return this.factorial(n) / this.factorial(n - r);
    }

    combination(n, r) {
        if (n < 0 || r < 0 || r > n) return NaN;
        return this.factorial(n) / (this.factorial(r) * this.factorial(n - r));
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

    // Number theory functions
    gcd(a, b) {
        while (b !== 0) {
            [a, b] = [b, a % b];
        }
        return Math.abs(a);
    }

    lcm(a, b) {
        return Math.abs(a * b) / this.gcd(a, b);
    }

    isPrime(n) {
        if (n < 2) return false;
        if (n === 2) return true;
        if (n % 2 === 0) return false;
        
        for (let i = 3; i <= Math.sqrt(n); i += 2) {
            if (n % i === 0) return false;
        }
        return true;
    }

    // Conversion functions
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    toDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    // Memory functions
    memoryStore(value) {
        this.memory = value;
        localStorage.setItem('calculatorMemory', value.toString());
    }

    memoryRecall() {
        const stored = localStorage.getItem('calculatorMemory');
        return stored ? parseFloat(stored) : this.memory;
    }

    memoryAdd(value) {
        this.memory += value;
        localStorage.setItem('calculatorMemory', this.memory.toString());
        return this.memory;
    }

    memorySubtract(value) {
        this.memory -= value;
        localStorage.setItem('calculatorMemory', this.memory.toString());
        return this.memory;
    }

    memoryClear() {
        this.memory = 0;
        localStorage.removeItem('calculatorMemory');
    }

    // Complex number operations (basic)
    complexAdd(a, b) {
        // a and b are objects with real and imag properties
        return {
            real: a.real + b.real,
            imag: a.imag + b.imag
        };
    }

    complexMultiply(a, b) {
        return {
            real: a.real * b.real - a.imag * b.imag,
            imag: a.real * b.imag + a.imag * b.real
        };
    }

    complexMagnitude(c) {
        return Math.sqrt(c.real * c.real + c.imag * c.imag);
    }

    // Unit conversions
    conversions = {
        temperature: {
            celsiusToFahrenheit: (c) => (c * 9/5) + 32,
            fahrenheitToCelsius: (f) => (f - 32) * 5/9,
            celsiusToKelvin: (c) => c + 273.15,
            kelvinToCelsius: (k) => k - 273.15
        },
        length: {
            metersToFeet: (m) => m * 3.28084,
            feetToMeters: (f) => f / 3.28084,
            inchesToCm: (i) => i * 2.54,
            cmToInches: (c) => c / 2.54
        },
        weight: {
            kgToPounds: (kg) => kg * 2.20462,
            poundsToKg: (p) => p / 2.20462,
            gramsToOunces: (g) => g * 0.035274,
            ouncesToGrams: (o) => o / 0.035274
        }
    };

    // Financial calculations
    simpleInterest(principal, rate, time) {
        return principal * (rate / 100) * time;
    }

    compoundInterest(principal, rate, time, compound = 1) {
        return principal * Math.pow((1 + rate / (100 * compound)), compound * time) - principal;
    }

    presentValue(futureValue, rate, time) {
        return futureValue / Math.pow(1 + rate / 100, time);
    }

    // Error handling for mathematical operations
    safeOperation(operation, ...args) {
        try {
            const result = operation(...args);
            if (isNaN(result)) {
                throw new Error('Invalid operation');
            }
            if (!isFinite(result)) {
                throw new Error('Result is infinite');
            }
            return result;
        } catch (error) {
            console.error('Mathematical operation error:', error.message);
            return 'Error';
        }
    }

    // Format scientific notation
    formatScientific(number, precision = 6) {
        if (Math.abs(number) >= 1e6 || (Math.abs(number) < 1e-4 && number !== 0)) {
            return number.toExponential(precision);
        }
        return number.toPrecision(precision);
    }
}

// Initialize scientific calculator
document.addEventListener('DOMContentLoaded', () => {
    window.scientificCalc = new ScientificCalculator();
    console.log('Scientific Calculator functions loaded by Yassir Rzigui');
});
