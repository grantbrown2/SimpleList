import React, {useState} from 'react'
import axios from 'axios'
import '../AddList.css'

const AddItem = ({onClose, listItemId, list, setList, updateList}) => {

    const [itemName, setItemName] = useState('')
    const [category, setCategory] = useState('')

    const [NameErrorMessage, setNameErrorMessage] = useState('');
    const [CategoryErrorMessage, setCategoryErrorMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validation()) {
            axios.post(`http://localhost:8000/api/create/item/${listItemId}`, {
                itemName,
                category
            })
            .then(res => {
                const newItem = res.data;
                setList(prevList => {
                    const updatedList = prevList.map(listItem => {
                        if (listItem._id === listItemId) {
                            return {
                                ...listItem,
                                items: [...listItem.items, newItem]
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

    const handleCancel = () => {
        onClose();
    }

    return (
        <div className='add-list'>
            <form onSubmit={handleSubmit} className='add-form'>
                    {NameErrorMessage && <span className='error'>{NameErrorMessage}</span>}
                <div className="itemName">
                    <label htmlFor="itemName" className='itemName-label'>Item Name:</label>
                    <input type="text" onChange={(e)=>{setItemName(e.target.value)}} onBlur={validation} className='itemName-input'/>
                </div>
                    {CategoryErrorMessage && <span className='error'>{CategoryErrorMessage}</span>}
                <div className="category">
                    <label htmlFor="category" className='category-label'>Category:</label>
                    <input type="text" onChange={(e)=>{setCategory(e.target.value)}} onBlur={validation} className='category-input'/>
                </div>
                <div className="buttons">
                    <input type="submit" value="Add Item To List" className='submit-button'/>
                    <button className='cancel-button' onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default AddItem