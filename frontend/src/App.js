import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [authors, setAuthors] = useState([]);
    const [filteredAuthors, setFilteredAuthors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [authorWorks, setAuthorWorks] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/authors')
            .then(response => {
                setAuthors(response.data);
                setFilteredAuthors(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des auteurs!', error);
            });
    }, []);

    useEffect(() => {
        if (!selectedAuthor) {
            setAuthorWorks([]);
            return;
        }

        // Fetch works of selected author
        axios.get(`http://localhost:5000/author-works/${selectedAuthor}`)
            .then(response => {
                setAuthorWorks(response.data);
            })
            .catch(error => {
                console.error(`Erreur lors de la recupération des données ${selectedAuthor}:`, error);
            });
    }, [selectedAuthor]);

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setSearchTerm(searchTerm);
        const filteredAuthors = authors.filter(author =>
            author.toLowerCase().includes(searchTerm)
        );
        setFilteredAuthors(filteredAuthors);
    };

    const handleAuthorClick = (author) => {
        if (author === selectedAuthor) {
            setSelectedAuthor(null);
        } else {
            setSelectedAuthor(author);
        }
    };

    return (
        <div className="App bg-gray-100 min-h-screen flex flex-col justify-center items-center">
            <header className="App-header bg-blue-500 text-white p-4 w-full">
                <h1 className="text-3xl font-bold">Liste des auteurs</h1>
                <input
                    type="text"
                    placeholder="rechercher auteurs..."
                    className="mt-4 p-2 rounded border border-gray-300 text-black"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </header>
            <main className="flex-grow p-4">
                <div className="grid grid-cols-3 gap-4">
                    {filteredAuthors.slice(0, 30).map((author, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-lg border border-gray-300 cursor-pointer ${selectedAuthor === author ? 'bg-blue-200' : 'bg-white hover:bg-gray-100'}`}
                            onClick={() => handleAuthorClick(author)}
                        >
                            <h2 className="text-lg font-bold">{author}</h2>
                            {selectedAuthor === author && (
                                <ul className="mt-2">
                                    {authorWorks.map((work, idx) => (
                                        <li key={idx} className="text-sm">{work.title}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default App;
