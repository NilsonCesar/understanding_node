const path = require("node:path");
const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const { pipeline } = require("node:stream/promises");
const util = require("../../lib/util");
const DB = require("../DB");
const FF = require("../../lib/FF");

const getVideos = (req, res, handleErr) => {
  DB.update();

  const videos = DB.videos.filter(video => video.userId === req.userId);

  res.status(200).json(videos);
};

// Upload a video file
const uploadVideo = async (req, res, handleErr) => {
  const specifiedFileName = req.headers.filename;
  const extension = path.extname(specifiedFileName).substring(1).toLowerCase();
  const name = path.parse(specifiedFileName).name;
  const videoId = crypto.randomBytes(4).toString("hex");

  const FORMATS_SUPPORTED = ["mov", "mp4", 'webm'];

  if (FORMATS_SUPPORTED.indexOf(extension) == -1) {
    return handleErr({
      status: 400,
      message: "Only these formats are allowed: mov, mp4",
    });
  }

  try {
    await fs.mkdir(`./storage/${videoId}`, { recursive: true });
    const fullPath = `./storage/${videoId}/original.${extension}`; // the original video path
    const file = await fs.open(fullPath, "w");
    const fileStream = file.createWriteStream();
    const thumbnailPath = `./storage/${videoId}/thumbnail.jpg`;

    await pipeline(req, fileStream);

    // Make a thumbnail for the video file
    await FF.makeThumbnail(fullPath, thumbnailPath);

    // Get the dimensions
    const dimensions = await FF.getDimensions(fullPath);

    DB.update();
    DB.videos.unshift({
      id: DB.videos.length,
      videoId,
      name,
      extension,
      dimensions,
      userId: req.userId,
      extractedAudio: false,
      resizes: {},
    });
    DB.save();

    res.status(201).json({
      status: "success",
      message: "The file was uploaded successfully!",
    });
  } catch (e) {
    // Delete the folder
    util.deleteFolder(`./storage/${videoId}`);
    if (e.code !== "ECONNRESET") return handleErr(e);
  }
};

const getVideoAsset = async (req, res, handleErr) => {
  const videoId = req.params.get('videoId');
  const type = req.params.get('type');

  DB.update();
  const video = DB.videos.find(video => video.videoId === videoId);

  if (!video) {
    return handleErr({
      status: 404,
      message: 'video not found'
    })
  }

  let file, mimeType, filename;

  switch (type) {
    case 'thumbnail':
      file = await fs.open('./storage/' + videoId + '/thumbnail.jpg', 'r');
      mimeType = 'image/jpeg';
      break;

    case 'audio':
      file = await fs.open('./storage/' + videoId + '/audio.aac', 'r');
      mimeType = 'audio/aac';
      filename = video.name + '-audio.aac';
      break;

    case 'resize':
      const dimensions = req.params.get('dimensions');
      file = await fs.open('./storage/' + videoId + '/' + dimensions + '.' + video.extension, 'r');
      mimeType = 'video/' + video.extension;
      filename = video.name + '-' + dimensions + '.' + video.extension;
      break

    case 'original':
      file = await fs.open('./storage/' + videoId + '/original.' + video.extension, 'r');
      mimeType = 'video/' + video.extension;
      filename = video.name + '.' + video.extension;
      break;
  }

  try {
    const stat = await file.stat();
    const fileStream = file.createReadStream();

    if (type !== 'thumbnail') {
      res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
    }

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Lenght', stat.size);

    res.status(200);
    await pipeline(fileStream, res);
    file.close();
  } catch (e) {
    console.log(e);
  }
}

const extractAudio = async (req, res, handleErr) => {
  const videoId = req.params.get('videoId');

  DB.update();
  const video = DB.videos.find(video => video.videoId === videoId);

  if (!video) {
    return handleErr({
      status: 404,
      message: 'video not found'
    })
  }

  if (video.extractedAudio) {
    return handleErr({
      status: 400,
      message: 'The audio has already been extracted for this video'
    })
  }

  const originalVideoPath = './storage/' + videoId + '/original.' + video.extension;
  const targetAudioPath = './storage/' + videoId + '/audio.aac'; 

  try {
    await FF.extractAudio(originalVideoPath, targetAudioPath);

    video.extractedAudio = true;
    DB.save();

    res.status(200).json({
      status: 'success',
      message: 'The audio was extracted successfully!'
    })
  } catch (e) {
    util.deleteFile(targetAudioPath);
    return handleErr(e);
  }
}

const resizeVideo = async (req, res, handleErr) => {
  const videoId = req.body.videoId;
  const width = Number(req.body.width);
  const height = Number(req.body.height);

  DB.update();

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

    video.resizes[`${width}x${height}`].processing = false;

    DB.save();

    res.status(200).json({
      status: 'success',
      message: 'video is now being processed'
    })
  } catch (e) {
    util.deleteFile(targetVideoPath);
    return handleErr(e);
  } 

}

const controller = {
  getVideos,
  uploadVideo,
  getVideoAsset,
  extractAudio,
  resizeVideo
};

module.exports = controller;
