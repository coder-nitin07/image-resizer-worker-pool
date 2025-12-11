const { parentPort } = require('worker_thread');
const sharp = require('sharp');

parentPort.on('message', async (data)=>{
    const { filePath, width, height } = data;

    try {
        const resizedBuffer = await sharp(filePath)
                                        .resize({
                                            width: parseInt(width),
                                            height: parseInt(height),
                                            fit: 'cover'
                                        })
                                        .toBuffer();
        
        parentPort.postMessage({ buffer: resizedBuffer });
    } catch (err) {
        parentPort.postMessage({ error: error.message });
    }
});