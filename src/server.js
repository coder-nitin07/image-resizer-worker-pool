const express = require('express');
const app = express();
const path = require('path');
const resizeRouter = require('./routes/resizeRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// user can download image with this route
app.use('/output', express.static(path.join(__dirname, '../output')));

// routes
app.use('/api', resizeRouter);

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`Server is listening on PORT ${ PORT }`);
});