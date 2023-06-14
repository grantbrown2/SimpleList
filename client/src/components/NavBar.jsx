import React from 'react'
import '../NavBar.css';
import axios from 'axios'

const NavBar = (props) => {

    const { list, setList } = props;

    const AddList = () => {
        axios.post('http://localhost:8000/api/create/list')
            .then((res) => {
                const newList = res.data
                setList([...list, newList]);
                })
            .catch((err) => console.log(err))
    }

    const deleteAllLists = () => {
        const confirmation = window.confirm("Are you sure you want to delete all lists? This Cannot be undone!")
        if (confirmation) {
            axios.delete('http://localhost:8000/api/delete/all')
            .then((res) => {
                setList([])
            })
            .catch((err) => console.log(err))
        }
    };

    return (
        <div className='nav-bar'>
            <div className='header'>
                <h1>TodoList</h1>
                <p className='credits'>by: Grant Brown</p>
            </div>
            <div className='container'>
                {list.length > 0 && (
                    <button className='button' onClick={deleteAllLists}>Delete All Lists</button>
                )}
                <button className='button' onClick={AddList}>Add a list</button>
            </div>
        </div>
    )
}

export default NavBar