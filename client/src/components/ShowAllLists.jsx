import React, { useEffect, useState} from 'react'
import '../Lists.css';
import axios from 'axios'
import AddItem from './AddItem';
import EditItem from './EditItem';

const ShowAllLists = (props) => {

    const { list, setList } = props;
    const [selectedItemId, setSelectedItemId] = useState(null);

    useEffect(()=> {
        axios.get('http://localhost:8000/api/list')
        .then((res) => {
            setList(res.data);
        })
        .catch((err) => console.log(err))
    }, []);

    const handleAddItemClick = (listItemId) => {
        setList(list.map((listItem) => {
            if (listItem._id === listItemId) {
                return {
                    ...listItem,
                    showForm: true
                };
            }
            return {
                ...listItem,
                showForm: false
            };
        }));
    };
    

    const handleAddItemClose = (listItemId) => {
        setList(list.map(listItem => {
            if (listItem._id === listItemId) {
                return {
                    ...listItem,
                    showForm: false
                };
            }
            return listItem;
        }));
    };

    const deleteList = (id) => {
        return axios.delete(`http://localhost:8000/api/delete/list/${id}`);
    };

    const handleDeleteClick = (id) => {
        deleteList(id)
            .then(() => {
                setList(list.filter(listItem => listItem._id!== id));
            })
            .catch(err => {
                console.log(err);
            });
    };

    const handleUpdateList = () => {
        axios.get('http://localhost:8000/api/list')
        .then(res => {
            setList(res.data);
            setSelectedItemId(null);
        })
        .catch((err) => console.log(err));
    }

    return (
        <div className='list-container'>
            {list.map((listItem) => (
                <div key={listItem._id} className='list'>
                    <div className='test'>
                        <h2 className='list-date'>{new Date(listItem.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric' })}</h2>
                        <button className='delete-button' onClick={()=> handleDeleteClick(listItem._id)}>X</button>
                    </div>
                    <ul>
                        {listItem.items.map((item) => (
                            <li key={item._id}>
                                <span className='item-category'>Category: {item.category}</span>
                                <br />
                                <span className='item-name'>{item.itemName}</span>
                                <input type="checkbox"/>
                                <button onClick={() => handleAddItemClick(listItem._id)}>Edit</button>
                                <button>Delete</button>
                            </li>
                        ))}
                    </ul>
                    {listItem.showForm && <EditItem onClose={() => handleAddItemClose(listItem._id)} updateList={handleUpdateList} listItemId={listItem._id} list={list} setList={setList}/>}
                    {listItem.showForm && <AddItem onClose={() => handleAddItemClose(listItem._id)} updateList={handleUpdateList} listItemId={listItem._id} list={list} setList={setList}/>}
                    {!listItem.showForm && <button className='button' onClick={() => handleAddItemClick(listItem._id)}>Add Item</button>}
                </div>
            ))}
        </div>
    )
}

export default ShowAllLists
