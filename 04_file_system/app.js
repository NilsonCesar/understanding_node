const fs = require('fs/promises');

(async () => {
  const CREATE_FILE = 'create a file';
  const DELETE_FILE = 'delete the file';
  const RENAME_FILE = 'rename the file';
  const ADD_TO_FILE = 'add to the file';

  const createFile = async filePath => {
    filePath = filePath.trim()
    try {
	file = await fs.open(filePath, 'r');
	file.close()
	return console.log('The file already exists');
    } catch (e) {
	file = await fs.open(filePath, 'w');
	file.close()
	return console.log('File created');
    }
  }

  const deleteFile = async filePath => {}
 
  const addToFile = async (filePath, content) => {
    filePath = filePath.trim();
    content = content.trim();
  } 

  const renameFile = async (oldPath, newPath) => {
    oldPath = oldPath.trim();
    newPath = newPath.trim();
  }

  const fileHandler = await fs.open('./command.txt', 'r');
  const watcher = fs.watch('./');
  
  fileHandler.on('change', async (event) => {
      const contentSize = (await fileHandler.stat()).size;
      const buffer = Buffer.alloc(contentSize);
      const length = buffer.byteLength;
      const offset = 0
      const position = 0;
      const content = await fileHandler.read(buffer, offset, length, position);
      
      const textContent = content.buffer.toString();
      
      if (textContent.includes(CREATE_FILE)) {
        const filePath = textContent.substring(CREATE_FILE.length + 1);
	console.log(filePath);
	createFile(filePath);	
      }

      if (textContent.includes(ADD_TO_FILE)) {
	const strDivisor = ' this content: ';
        const divisor = textContent.indexOf(strDivisor);
	const filePath = textContent.substring(ADD_TO_FILE.length + 1, divisor);
	const content = textContent.substring(divisor + strDivisor.length);
	addToFile(filePath, content);
      }

      if (textContent.includes(RENAME_FILE)) {
	const strDivisor = ' to ';
	const divisor = textContent.indexOf(strDivisor);
	const oldFilePath = textContent.substring(RENAME_FILE.length + 1, divisor);
	const newFilePath = textContent.substring(divisor + strDivisor.length);
	renameFile(oldFilePath, newFilePath);
      }
    }
  )
     

  for await (const event of watcher) {
    if (event.eventType === 'change') {
      fileHandler.emit('change');
    }
  }
})();
