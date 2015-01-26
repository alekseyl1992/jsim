var UUIDGenerator = require('../util/UUIDGenerator');

function Task(model) {
    this.id = UUIDGenerator.generate();
    this.model = model;

    this.progress = 0;
    this.status = Task.Status.CREATED;
    this.stats = null;
    this.error = null;
}

Task.Status = {
    CREATED: "created",
    SENT: "sent",
    IN_PROGRESS: "inProgress",
    DONE: "done",
    ERROR: "error"
};

module.exports = Task;