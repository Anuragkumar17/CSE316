// Process class definition
function process(processName, burstTime, arrivalTime, pIndex, priority) {
    this.processName = processName;
    this.burstTime = burstTime;
    this.initialBurst = burstTime;
    this.arrivalTime = arrivalTime;
    this.done = false;
    this.hasStarted = false;
    this.finishTime;
    this.priority = priority;
    this.pIndex = pIndex;

    this.finished = function() {
        this.done = true;
        this.finishTime = position;
    }
}

// Helper function to sort by arrival time
function sortArriveTimes() {
    processArray.sort((a, b) => a.arrivalTime - b.arrivalTime);
}

// Helper function to fill idle time
function fillGaps() {
    for (let i = 0; i < processArray.length; i++) {
        if (!processArray[i].done && processArray[i].arrivalTime > position) {
            bar.addItem("idle", processArray[i].arrivalTime - position);
            break;
        }
    }
}

// Helper function to find smallest burst time
function findSmallestBurstIndex() {
    let smallestIndex = 0;
    let smallestBurst = Infinity;

    for (let i = 0; i < processArray.length; i++) {
        if (!processArray[i].done && 
            processArray[i].arrivalTime <= position && 
            processArray[i].burstTime < smallestBurst) {
            smallestIndex = i;
            smallestBurst = processArray[i].burstTime;
        }
    }
    return smallestIndex;
}

// Helper function to find highest priority
function findHighestPriorityIndex() {
    let highestIndex = 0;
    let highestPriority = Infinity;

    for (let i = 0; i < processArray.length; i++) {
        if (!processArray[i].done && 
            processArray[i].arrivalTime <= position && 
            processArray[i].priority < highestPriority) {
            highestIndex = i;
            highestPriority = processArray[i].priority;
        }
    }
    return highestIndex;
}

// 1. First Come First Serve (FCFS)
function FCFS() {
    sortArriveTimes();
    
    for (let i = 0; i < processArray.length; i++) {
        fillGaps();
        bar.addItem(processArray[i].processName, processArray[i].burstTime);
        processArray[i].finished();
    }
}

// 2. Shortest Job First (SJF)
function SJF() {
    sortArriveTimes();
    
    while (!isDone()) {
        fillGaps();
        let i = findSmallestBurstIndex();
        bar.addItem(processArray[i].processName, processArray[i].burstTime);
        processArray[i].finished();
    }
}

// 3. Shortest Remaining Time First (SRTF)
function SRTF() {
    sortArriveTimes();
    
    while (!isDone()) {
        fillGaps();
        let i = findSmallestBurstIndex();
        
        // Check for preemption
        let nextArrival = findNextArrival(position);
        if (nextArrival !== -1 && 
            processArray[nextArrival].burstTime < processArray[i].burstTime) {
            let timeSlice = processArray[nextArrival].arrivalTime - position;
            processArray[i].burstTime -= timeSlice;
            bar.addItem(processArray[i].processName, timeSlice);
        } else {
            bar.addItem(processArray[i].processName, processArray[i].burstTime);
            processArray[i].finished();
        }
    }
}

// Helper function for SRTF to find next arriving process
function findNextArrival(currentTime) {
    let nextIndex = -1;
    let nextTime = Infinity;
    
    for (let i = 0; i < processArray.length; i++) {
        if (!processArray[i].done && 
            processArray[i].arrivalTime > currentTime && 
            processArray[i].arrivalTime < nextTime) {
            nextIndex = i;
            nextTime = processArray[i].arrivalTime;
        }
    }
    return nextIndex;
}

// 4. Priority Scheduling
function Priority() {
    sortArriveTimes();
    
    while (!isDone()) {
        fillGaps();
        let i = findHighestPriorityIndex();
        bar.addItem(processArray[i].processName, processArray[i].burstTime);
        processArray[i].finished();
    }
}

// Helper function to check if all processes are done
function isDone() {
    return processArray.every(process => process.done);
}
