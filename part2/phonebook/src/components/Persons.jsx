const Persons = ({ persons, filter, handleDelete }) => {
  return (
    <div>
      {persons
        .filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase()),
        )

        .map((person) => (
          <div key={person.id}>
            <span>
              {person.name} {person.number}
            </span>
            <button onClick={() => handleDelete(person)}>delete</button>
          </div>
        ))}
    </div>
  );
};

export default Persons;
