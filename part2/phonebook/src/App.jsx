import { useEffect, useState } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState('');
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    personService.getAll().then((initialPersons) => setPersons(initialPersons));
  }, []);

  const addPerson = (e) => {
    e.preventDefault();

    if (persons.some((person) => person.name === newName)) {
      const confirmString = `${newName} is already added to phonebook, replace the old number with a new one?`;

      if (confirm(confirmString)) {
        const personToUpdate = persons.find(
          (person) => person.name === newName,
        );

        personService
          .update({ ...personToUpdate, number: newNumber })

          .then((updatedPerson) => {
            const newPersons = persons.map((person) =>
              person.id !== updatedPerson.id ? person : updatedPerson,
            );

            setPersons(newPersons);
            setNewName('');
            setNewNumber('');

            setMessage(`Updated ${updatedPerson.name}'s number`);
            setIsError(false);
            setTimeout(() => setMessage(null), 5000);
          })

          .catch((error) => {
            console.error(error);

            if (error.status === 404) {
              setMessage(
                `Information of ${newName} has already been removed from server`,
              );

              setPersons(
                persons.filter((person) => person.id !== personToUpdate.id),
              );
            } else {
              setMessage(error.response.data.error);
            }

            setIsError(true);
            setTimeout(() => setMessage(null), 5000);
          });
      }

      return;
    }

    personService
      .create({ name: newName, number: newNumber })

      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName('');
        setNewNumber('');

        setMessage(`Added ${returnedPerson.name}`);
        setIsError(false);
        setTimeout(() => setMessage(null), 5000);
      })

      .catch((error) => {
        console.error(error);
        setMessage(error.response.data.error);
        setIsError(true);
        setTimeout(() => setMessage(null), 5000);
      });
  };

  const handleDelete = ({ name, id }) => {
    if (window.confirm('Delete this person?')) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setMessage(`Deleted ${name}`);
          setIsError(false);
          setTimeout(() => setMessage(null), 5000);
        })

        .catch(() => {
          setMessage(
            `Information of ${name} has already been removed from server`,
          );

          setPersons(persons.filter((person) => person.id !== id));
          setIsError(true);
          setTimeout(() => setMessage(null), 5000);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} isError={isError} />
      <Filter filter={filter} handleFilterChange={setFilter} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={setNewName}
        newNumber={newNumber}
        handleNumberChange={setNewNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
