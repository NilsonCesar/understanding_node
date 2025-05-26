const DB = require('../src/DB');
const FF = require('./FF');
const util = require('./util');

class JobQueue {
    constructor() {
        this.jobs = [];
        this.currentJob = undefined;
    }

    enqueue(job) {
        this.jobs.push(job);
        this.executeNext();
    }

    dequeue() {
        return this.jobs.shift();
    }

    executeNext() {
        if (this.currentJob || !this.jobs.length) return;
        this.currentJob = this.dequeue();
        this.execute();
    }

    async execute() {
        if (this.currentJob.type === 'resize') {
            DB.update();
            
            const { videoId, width, height } = this.currentJob;
            const video = DB.videos.find(video => video.videoId === videoId);

            video.resizes[`${width}x${height}`]= { processing : true };

            const originalVideoPath = `./storage/${video.videoId}/original.${video.extension}`;
            const targetVideoPath = `./storage/${video.videoId}/${width}x${height}.${video.extension}`;
            
            try {

                await FF.resize(
                  originalVideoPath,
                  targetVideoPath,
                  width,
                  height
                );

                DB.update();
                const video = DB.videos.find(video => video.videoId === videoId);
                video.resizes[`${width}x${height}`].processing = false;

                DB.save();

            } catch (e) {
                util.deleteFile(targetVideoPath);
                return handleErr(e);
            } 
        }

        this.currentJob = undefined;
        this.executeNext();
    }
}

module.exports = JobQueue;