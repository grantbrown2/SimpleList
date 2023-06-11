import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import '../AddList.css'

const EditItem = ({onClose, listItemId, itemId, list, setList, updateList}) => {

    const [itemName, setItemName] = useState('')
    const [category, setCategory] = useState('')

    const [NameErrorMessage, setNameErrorMessage] = useState('');
    const [CategoryErrorMessage, setCategoryErrorMessage] = useState('');

    const navigate = useNavigate();

    useEffect(()=> {
         // Fetch the existing item data and set it in the component state
        axios.get(`http://localhost:8000/api/item/${listItemId}/${itemId}`)
        .then(res => {
            setItemName(res.data.itemName);
            setCategory(res.data.category);
        })
        .catch(err => console.log(err));
    }, [listItemId, itemId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validation()) {
            axios.put(`http://localhost:8000/api/update/item/${listItemId}/${itemId}`, {
                itemName,
                category
            })
            .then(res => {
                const updatedItem = res.data;
                setList(prevList => {
                    const updatedList = prevList.map(listItem => {
                        if (listItem.id === listItemId) {
                            return {
                                ...listItem,
                                items: listItem.items.map(item => {
                                    if (item.id === itemId) {
                                        return {
                                            ...item,
                                            itemName: updatedItem.itemName,
                                            category: updatedItem.category
                                        };
                                    }
                                    return item;
                                }),
                            };
                        }
                        return listItem;
                    });
                    return updatedList;
                });
                updateList();
                onClose();
            })
            .catch(err => console.log(err))
        }
    };

    const validation = () => {
        let isValid = true
        if (itemName.length < 3) {
            isValid = false
            setNameErrorMessage("Item name must have at least 3 letters!")
        } else {
            setNameErrorMessage("")
        }
        if (category.length < 3) {
            isValid = false
            setCategoryErrorMessage("Category length must be at least 3 characters!")
        } else {
            setCategoryErrorMessage("")
        }
        return isValid
    }

    return (
        <div className='add-list'>
            <form onSubmit={handleSubmit} className='add-form'>
                    {NameErrorMessage && <span className='error'>{NameErrorMessage}</span>}
                <div className="itemName">
                    <label htmlFor="itemName" className='itemName-label'>Item Name:</label>
                    <input type="text" onChange={(e)=>{setItemName(e.target.value)}} value={itemName} onBlur={validation} className='itemName-input'/>
                </div>
                    {CategoryErrorMessage && <span className='error'>{CategoryErrorMessage}</span>}
                <div className="category">
                    <label htmlFor="category" className='category-label'>Category:</label>
                    <input type="text" onChange={(e)=>{setCategory(e.target.value)}} value={category} onBlur={validation} className='category-input'/>
                </div>
                <input type="submit" value="Update Item" className='submit-button'/>
            </form>
        </div>
    )
}

export default EditItem