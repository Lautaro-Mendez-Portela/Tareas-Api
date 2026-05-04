require('dotenv').config();

const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Conexión a MongoDB exitosa');
}).catch((error) => console.log(error));

const taskSchema = new mongoose.Schema({
  title: String,
  completed: Boolean
});

const Task = mongoose.model('Task', taskSchema);

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
}

app.use(express.json());


app.get('/', (req, res) => {
  res.send('API funcionando');
});

app.get('/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tareas' });
  }
});

app.post('/tasks', auth, async (req, res) => {
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

const bcrypt = require('bcrypt');

app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      email: req.body.email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: 'Usuario registrado exitosamente' });

  } catch (error) {
    console.log("ERROR REGISTER:", error); // borrar
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

const jwt = require('jsonwebtoken');

app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });

  } catch (error) {
    res.status(500).json({ message: 'Error en login' });
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


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
