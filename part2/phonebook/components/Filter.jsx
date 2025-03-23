const Filter = ({ filter, handleFilterChange }) => {
  return (
    <p>
      filter shown with{' '}
      <input
        type='text'
        value={filter}
        onChange={(e) => handleFilterChange(e.target.value)}
      />
    </p>
  );
};

export default Filter;
