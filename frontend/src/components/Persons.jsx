const Persons = ({ filtered, removePerson }) => {
    return(
      <div>
          {
            filtered.map(person => 
                <p key={ person.id }>{ person.name } { person.number }
                  <button onClick={ () => removePerson(person.id) }>delete</button>
                </p>
            )
          }
        </div>
    );
}

export default Persons