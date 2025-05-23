const { spawn } = require('node:child_process');

const makeThumbnail = (fullPath, thumbnailPath) => {
    return new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', ['-i', fullPath, '-ss', '5', '-vframes', '1', thumbnailPath]);
        ffmpeg.on('close', (code) => {
            !code ? resolve() : reject(`ffmpeg exited with this code: ${code}`);
        });

        ffmpeg.on('error', (err) => {
            reject(err);
        })
    });
}

const getDimensions = (fullPath) => {
    return new Promise((resolve, reject) => {
        let dimensions;
        const ffprobe = spawn('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', fullPath]);

        ffprobe.stdout.on('data', (data) => {
            const ans = data.toString().trim();
            dimensions = ans.split(',');
        });

        ffprobe.on('close', (code) => {
            if (!code) {
                console.log(dimensions);
                resolve({
                    width: Number(dimensions[0]),
                    height: Number(dimensions[1])
                });
            } else {
                reject(`ffprobe exited with this code: ${code}`);
            }
        });

        ffprobe.on('error', (err) => {
            reject(err);
        });
    })
}

module.exports = { makeThumbnail, getDimensions };