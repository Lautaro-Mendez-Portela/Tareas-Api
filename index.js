const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://lautaromendezportela_db_user:J4yIVns2UCgHtKIf@cluster0.howmkkw.mongodb.net/?appName=Cluster0').then(() => {
  console.log('Conexión a MongoDB exitosa');
}).catch((error) => console.log(error));

const taskSchema = new mongoose.Schema({
  title: String,
  completed: Boolean
});

const Task = mongoose.model('Task', taskSchema);

let tasks = [
  { id: 1, title: 'Aprender Node', completed: false },
  { id: 2, title: 'Hacer proyecto', completed: false }
];

app.use(express.json());


app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tareas' });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const newTask = new Task({
      title: req.body.title,
      completed: false
    });

    const savedTask = await newTask.save();

    res.json(savedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear tarea' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.json({ message: 'Tarea eliminada correctamente' });

  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar tarea' });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title: req.body.title,
        completed: req.body.completed
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.json(updatedTask);

  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar tarea' });
  }
});


app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
