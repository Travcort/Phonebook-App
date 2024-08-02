import axios from 'axios'

const baseUrl = `/api/persons`

const getPersons = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const newPerson = (personObject) => {
    const request = axios
    .post(baseUrl, personObject) 
    .catch(error => {
        alert(`adding ${personObject.name} generated an error`)
      })
    return request.then(response => response.data)
}

const removePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`);
}

const updateNumber = (personObject, id) => {
    const request = axios
    .put(`${baseUrl}/${id}`, personObject)
    return request.then(response => response.data)
}


export default {newPerson, getPersons, removePerson, updateNumber}