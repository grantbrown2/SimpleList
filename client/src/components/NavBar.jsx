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


    return (
        <div className='nav-bar'>
            <div className='header'>
                <h1>TodoList</h1>
                <p className='credits'>by: Grant Brown</p>
            </div>
            <div className='container'>
                <button className='button' onClick={AddList}>Add a list</button>
            </div>
        </div>
    )
}

export default NavBar