import React, { useState } from 'react'
import NavBar from '../components/NavBar';
import ShowAllLists from '../components/ShowAllLists';

const Main = () => {

    const [list, setList] = useState([]);
    const [showAddItemForm, setShowItemForm] = useState(false);
    const handleAddItemClick = () => {};

    return (
        <div>
            <NavBar list={list} setList={setList} />
            <ShowAllLists list={list} setList={setList} handleAddItemClick={handleAddItemClick}/>
        </div>
    )
}

export default Main