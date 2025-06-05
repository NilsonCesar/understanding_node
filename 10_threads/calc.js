const fs = require('fs');

setTimeout(
    fs.writeFile('./text.txt', 'This is a threading test, follow the thread!', (e) => {
        if (e) return console.error(e);
        console.log('File was created');
}), 3000);