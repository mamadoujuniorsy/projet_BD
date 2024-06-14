const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connexion à MongoDB avec Mongoose
mongoose.connect('mongodb://127.0.0.1:27017,127.0.0.1:27017:27018,127.0.0.1:27017:27019/DBLP?replicaSet=myReplicaSet', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connecté à MongoDB');
}).catch((error) => {
    console.error('Erreur lors de la connection à MongoDB:', error);
});

// Définition du schéma Mongoose pour les publications
const publisSchema = new mongoose.Schema({}, { strict: false });
const Publis = mongoose.model('publis', publisSchema);

// Route pour récupérer tous les auteurs distincts
app.get('/authors', async (req, res) => {
    try {
        const authors = await Publis.distinct('authors');
        res.json(authors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route pour récupérer les œuvres d'un auteur spécifique
app.get('/author-works/:author', async (req, res) => {
    const author = req.params.author;
    try {
        // Récupération des œuvres de l'auteur depuis la base de données
        const works = await Publis.find({ authors: author },{ title: 1, _id: 0 });
        res.json(works);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Écoute du serveur sur le port spécifié
app.listen(port, () => {
    console.log(`Serveur en marche sur http://localhost:${port}`);
});
