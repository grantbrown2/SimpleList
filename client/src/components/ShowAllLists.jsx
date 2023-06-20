import React, {useEffect} from 'react'
import '../Lists.css';
import axios from 'axios'
import AddItem from './AddItem';
import EditItem from './EditItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const ShowAllLists = (props) => {

    const { list, setList} = props;

    useEffect(()=> {
        axios.get('http://localhost:8000/api/list')
        .then((res) => {
            //sort items by category
            const sortedLists = res.data.map((listItem) => ({
                ...listItem,
                items: listItem.items.sort((a, b) => a.category.localeCompare(b.category))
            }));
            setList(sortedLists);
        })
        .catch((err) => console.log(err))
    }, [setList]);

    const handleAddItemClick = (listItemId) => {
        setList(list.map((listItem) => {
            if (listItem._id === listItemId) {
                return {
                    ...listItem,
                    showForm: true,
                    isEditing: false
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

    const handleUpdateItemClick = (listItemId, itemId) => {
        setList(list.map((listItem) => {
            if (listItem._id === listItemId) {
                return {
                    ...listItem,
                    isEditing: true,
                    showForm: false,
                    selectedItem: itemId
                };
            }
            return {
                ...listItem,
                isEditing: false,
                selectedItem: null
            };
        }));
    };

    const handleUpdateItemClose = (listItemId) => {
        setList(list.map(listItem => {
            if (listItem._id === listItemId) {
                return {
                    ...listItem,
                    isEditing: false
                };
            }
            return listItem;
        }));
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

    const deleteList = (id) => {
        return axios.delete(`http://localhost:8000/api/delete/list/${id}`);
    };

    const deleteItem = (id, itemId) => {
        return axios.delete(`http://localhost:8000/api/delete/item/${id}/${itemId}`);
    }

    const handleDeleteItemClick = (listItemId, itemId) => {
        deleteItem(listItemId, itemId)
        .then(() => {
            setList(list.map(listItem => {
                if (listItem._id === listItemId) {
                    return {
                    ...listItem,
                    isEditing: false,
                    items: listItem.items.filter((item) => item._id !== itemId)
                };
            }
            return listItem;
            }));
        })
        .catch(err => {
            console.log(err);
        });
    }

    const handleUpdateList = () => {
        axios.get('http://localhost:8000/api/list')
        .then(res => {
            const sortedLists = res.data.map(listItem => ({
                ...listItem,
                items: listItem.items.sort((a, b) => a.category.localeCompare(b.category))
            }));
            setList(sortedLists);
        })
        .catch((err) => console.log(err));
    }

    const handleCheckBoxClick = (event, listItemId, itemId) => {
        const isChecked = event.target.checked;
        axios.put(`http://localhost:8000/api/update/item/${listItemId}/${itemId}`, {
                isFinished: isChecked,
            })
            .then(() => {
                //update the state of the list
                setList(list.map(listItem => {
                    if (listItem._id === listItemId) {
                        return {
                            ...listItem,
                            items: listItem.items.map(item => {
                                if (item._id === itemId) {
                                    return {
                                        ...item,
                                        isFinished: isChecked
                                    };
                                }
                                return item;
                            }),
                        };
                    }
                    return listItem;
                })
                );
            })
            .catch((err) => {console.log(err)});
    };

    const handleColorChange = (listItemId, color) => {
        axios.put(`http://localhost:8000/api/update/list/${listItemId}`, {
            colorChoice: color
        })
        .then((res) => {
            setList((prevList) => 
            prevList.map((listItem) => 
                listItem._id === listItemId ? {...listItem, colorChoice: color} : listItem
            ));
        })
        .catch((err) => {console.log(err)});
    };

    return (
        <div className='list-container'>
            {list.map((listItem) => (
                <div key={listItem._id} className='list' style={{backgroundColor: listItem.colorChoice}}>
                    <div className='list-header'>
                        <input className='color-picker' type='color' value={listItem.colorChoice || '#000000'} onChange={(e) => handleColorChange(listItem._id, e.target.value)} />
                        <label className="switch">
                            <input type="checkbox" />
                                <span className="slider round"></span>
                        </label>
                        <h2 className='list-date'>{new Date(listItem.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric' })}</h2>
                        <button className='delete-button' onClick={()=> handleDeleteClick(listItem._id)}>X</button>
                    </div>
                    <ul>
                        {listItem.items.map((item) => (
                            <li key={item._id}>
                                <span className={`item-category ${item.isFinished ? 'finished' : ''}`}>{item.category}</span>
                                <span className={`item-name ${item.isFinished ? 'finished' : ''}`}>{item.itemName}</span>
                                <input className='checkbox' type="checkbox" checked={item.isFinished} onChange={(event) => handleCheckBoxClick(event, listItem._id, item._id)} data-list-id={listItem._id}/>
                                <button className='pencil' onClick={() => handleUpdateItemClick(listItem._id, item._id)}><FontAwesomeIcon icon={faPencilAlt} /></button>
                                {listItem.isEditing && <button className='delete-button2' onClick={()=> handleDeleteItemClick(listItem._id, item._id)}>X</button>}
                            </li>
                        ))}
                    </ul>
                    {listItem.isEditing && <EditItem onClose={() => handleUpdateItemClose(listItem._id)} updateList={handleUpdateList} listItemId={listItem._id} itemId={listItem.selectedItem} list={list} setList={setList}/>}
                    {listItem.showForm && <AddItem onClose={() => handleAddItemClose(listItem._id)} updateList={handleUpdateList} listItemId={listItem._id} list={list} setList={setList}/>}
                    {!listItem.showForm && !listItem.isEditing && <button className='button' onClick={() => handleAddItemClick(listItem._id)}>Add Item</button>}
                </div>
            ))}
        </div>
    )
}

export default ShowAllLists
