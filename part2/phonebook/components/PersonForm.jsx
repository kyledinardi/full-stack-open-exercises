const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name:{' '}
        <input
          type='text'
          value={newName}
          onChange={(e) => handleNameChange(e.target.value)}
        />
      </div>
      <div>
        number:{' '}
        <input
          type='tel'
          value={newNumber}
          onChange={(e) => handleNumberChange(e.target.value)}
        />
      </div>
      <div>
        <button type='submit'>add</button>
      </div>
    </form>
  );
};

export default PersonForm;
