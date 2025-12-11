const { Worker } = require('worker_threads');
const path = require('path');

class WorkerPool {
    constructor (size, workerPath) {
        this.size = size;                   // total workers
        this.workerPath = workerPath;       // path to imageWorker.js
        this.worker =  [];                  // active workers
        this.freeworker = [];               // available workers
        this.taskQueue = [];                // pending task queue

        this._createWorkers();
    }

    _createWorkers(){}

    runTask(data){}

    _assignWorkers(worker, data, callback) {}
}

module.exports = WorkerPool;