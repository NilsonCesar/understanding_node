const factorial = n => {
    n = BigInt(n);
    if (n < 1n) return 0n;
    if (n == 1n) return 1n;
    return n * factorial(n - 1n);
}

module.exports = factorial;