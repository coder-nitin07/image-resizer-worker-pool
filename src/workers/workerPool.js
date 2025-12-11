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

    _createWorkers(){
        for(let i = 0; i< this.size; i++){
            const worker = new Worker(this.workerPath);

            // store the worker
            this.workers.push(worker);

            // initially, worker is free
            this.freeworker.push(worker);

            // handle worker finsih task
            worker.on('message', (result)=>{
                worker.isBusy = false; // mark worker free

                // if queue has task, assign  next
                if(this.taskQueue.length > 0){
                    const { data, callback } = this.taskQueue.shift();
                    this._assignWorker(worker, data, callback);
                }
            });

            // Handle worker error
            worker.on("error", (err) => {
                console.error("Worker error:", err);
            });

            // If worker exits → create new one
            worker.on("exit", (code) => {
                if (code !== 0) {
                    console.log("Worker crashed. Restarting...");
                    const newWorker = new Worker(this.workerPath);
                    this.workers[i] = newWorker;
                    this.freeWorkers.push(newWorker);
                }
            });
        }
    }

    runTask(data){
        return new Promise((resolve, reject)=>{
            // check for free worker
            const worker = this.freeworkers.find(w => !w.isBusy);

            if(worker){
                // assign immediately
                this._assignWorker(worker, data, (err, result)=>{
                    if(err) return reject(err);
                    resolve(result);
                })
            } else {
                // queue task
                this.taskQueue.push({
                    data,
                    callback: (err, result)=> {
                        if(err) return reject(err);

                        resolve(result);
                    }
                })
            }
        });
    }

    _assignWorker(worker, data, callback) {
        worker.isBusy = true;

        worker.once('message', (result)=>{
            worker.isBusy = false;

            callback(null, result);
        });

        worker.once('error', (err)=>{
            worker.isBusy = false;

            callback(err);
        });

        worker.postMessage(data);
    }
}

module.exports = WorkerPool;