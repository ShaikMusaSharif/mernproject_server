const User = require('../../database/model/user.model');
const Task = require('../../database/model/task.model');

const addTask = async (req, res) => {
	const { task, id } = req.body;

	try {
		if (!task) return res.status(400).send('please enter the task');
		if (task.length < 0) res.status(400).send('add minimum 10 char');
		const taskDetail = await new Task({
			task,
			createdBy: id,
		});
		await taskDetail.save();
		return res.status(200).send(taskDetail);
	} catch (error) {
		return res.status(400).send('task addition failed');
	}
};

const getAllTasks = async (req, res) => {
	const { id } = req.query;
	try {
		let tasklist = await Task.find({ createdBy: id });
		return res.status(200).send(tasklist);
	} catch (error) {
		return res.status(400).send(error);
	}
};

const editTask = async (req, res) => {
	console.log(req.body);
    try {
        const { name } = req.body;
		const {id}=req.params;
		console.log(req.body);
        if (!name) {
            return res.status(400).send('Please provide a name for the task.');
        }
        let task = await Task.findById(id);
        if (!task) {
            return res.status(404).send('Task not found.');
        }
        task.task = name;
        await task.save();
        return res.status(200).send(task);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};

const statusChange = async (req, res) => {
	const {id, status, string} = req.body;

	try{
		let task = await Task.findById({ _id: id });
		if (string === 'right') {
			if (task.status === 'backlog') {
				task.status = 'todo';
				task.save();
				return res.send(task);
			}else if (task.status === 'todo') {
				task.status = 'in progress';
				task.save();
				return res.send(task);
			} else if (task.status === 'in progress') {
				task.status = 'done';
				task.save();
				return res.send(task);
			}
		} else {
			if (task.status === 'done') {
				task.status = 'in progress';
				task.save();
				return res.send(task);
			} else if (task.status === 'in progress') {
				task.status = 'todo';
				task.save();
				return res.send(task);
			} else if (task.status === 'todo') {
				task.status = 'backlog';
				task.save();
				return res.send(task);
			}
		}
	} catch(error){}
	
};

const deleteTask = async (req, res) => {
	const { id } = req.params;
	try {
		let response = await Task.findByIdAndDelete(id);
		return res.status(200).send(response);
	} catch (error) {
		return res.status(400).send('deleteFailed');
	}
};





module.exports = {
	addTask,
	getAllTasks,
	editTask,
	statusChange,
	deleteTask,
};