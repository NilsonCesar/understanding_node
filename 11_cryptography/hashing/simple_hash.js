// insecure
function simpleHash(message) {

    const primes = [33247961, 71861827, 35708879, 11477993, 90923579, 23197381, 36604153, 34206157, 13673467, 92847331];
    let result = 0;

    for (let i = 0; i < message.length; i++) {
        let temp = message[i] * primes[i % 10];
        message[i] = message[i] ^ temp;
        message[i] = message[i] >> 2;
        result += message[i] * primes[i % 10]
        result = result % 1000000;
    }

    const resultBuffer = Buffer.alloc(4);
    resultBuffer.writeUInt32BE(result, 0);

    return resultBuffer;
}

const digest = simpleHash(Buffer.from('Helloo'));

console.log(digest.toString('hex'));