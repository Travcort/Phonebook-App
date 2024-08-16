import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('Type Here...')
  const [newNumber, setNewNumber] = useState('New number..')
  const [searchQuery, setSearchQuery] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    personService
    .getPersons()
    .then(initialData => {
      setPersons(initialData)
      setMessage('Initial data fetch')
      timeout();
    })
  }, [])

  const searchArray = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleNameInput = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberInput = (event) => {
    setNewNumber(event.target.value)
  }

  // The Timeout function for the notification
  const timeout = () => {
    setTimeout(() => {
      setMessage(null)
      setIsError(false)
    }, 5000);
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      id: String(persons.length + 1),
      name: newName,
      number: newNumber
    }

    const nameExists = persons.some(person => person.name === newName);
    if(nameExists) {
      const confirmation = window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`);
      if(confirmation) {
        const person = persons.find(p => p.name === newName);
        const updatedPerson = {...person, number: newNumber};

        personService
        .updateNumber(personObject, updatedPerson.id)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== person.id ? p:returnedPerson));
          setMessage(`Updated ${updatedPerson.name}'s number`);
          timeout();
        })
        .catch(error => {
          alert(`${newName} does not exist in the database`);
          setIsError(true);
          setMessage(`Error: ${error.message} `);
          timeout();
          setPersons(persons.filter(p => p.id !== person.id));
        })
      }
    }
    else {
      personService
      .newPerson(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setMessage(`Added ${personObject.name}`);
        timeout();
      })
      .catch (error => {
        setIsError(true);
        setMessage(error.response.data.error);
        timeout();
      })
    }
    setNewName('');
    setNewNumber('');
  };

  const filtered = persons.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const removePerson = (id) => {
    const person = persons.find(person => person.id === id);
    const confirm = window.confirm(`Delete ${person.name} ?`)
    if (confirm) {
      personService
      .removePerson(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id));
        setMessage(`Deleted ${person.name} from the database`);
        timeout();
      })
      .catch(error => {
        setIsError(true);
          setMessage(`Error: ${error.message} `);
          timeout();
      }) 
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={ message } isError={isError} />
      <Filter value={searchQuery} onChange={searchArray} />
      <h3>add a new</h3>
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameInput={handleNameInput}
        handleNumberInput={handleNumberInput}
      />
      <h3>Numbers</h3>
      <Persons filtered={filtered} removePerson={removePerson} />
    </div>
  );
};

export default App