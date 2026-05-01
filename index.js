const express = require('express');
const app = express();

let tasks = [
  { id: 1, title: 'Aprender Node', completed: false },
  { id: 2, title: 'Hacer proyecto', completed: false }
];

app.use(express.json());


app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
    completed: false
  };

  tasks.push(newTask);

  res.json(newTask);
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);

  const initialLength = tasks.length;

  tasks = tasks.filter(task => task.id !== taskId);

  if (tasks.length === initialLength) {
    return res.status(404).json({ message: 'Tarea no encontrada' });
  }

  res.json({ message: 'Tarea eliminada correctamente' });
});

app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);

    const task = tasks.find(task => task.id === taskId);
    
    if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }
}); 


app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
