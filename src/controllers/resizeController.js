const fs = require('fs');
const path = require('path');
const WorkerPool = require('../workers/workerPool');

// create worker pool
const pool = new WorkerPool(4, path.join(__dirname, '../workers/imageWorker.js'));

const resizeImage  = async (req, res)=>{
    try {
        // check if file exists
        if(!req.file){
            return res.status(400).json({ message: 'Image file required' });
        }

        // validate width & height
        const { width, height } = req.body;
        if(!width, !height){
            return res.status(400).json({ message: 'width & height are required' });
        }

        // send task to worker pool
        const result = await pool.runTask({
            filePath: req.file.path,
            width,
            height
        });

        if(result.error){
            return res.status(500).json({ message: result.error });
        }

        // save image to output folder
        const outputPath = path.join('output', `resized-${ Date.now() }.jpg`);
        fs.writeFileSync(outputPath, result.buffer);

        
        // send file back to user
        res.download(outputPath);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
};

module.exports = resizeImage;