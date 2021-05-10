import React, {useState} from 'react'

import './filters.css'

const Filters = ({ 
    tags, 
    users, 
    active, 
    filters, 
    setFilters,
    reverseOrder,
    dateNewFirst,
    setDateNewFirst,
    userFilters,
    setUserFilters
}) => {
   
    const handleTagSelect = (e) => {
        const sel = e.target.options
        const newFilters = [...filters]
        newFilters.push(sel[sel.selectedIndex].text)
        const uniqueFilters = [...new Set(newFilters)];
        setFilters(uniqueFilters)
    }

    const handleUserSelect = (e) => {
        const sel = e.target.options
        const newFilters = [...userFilters]
        newFilters.push(sel[sel.selectedIndex].text)
        const uniqueFilters = [...new Set(newFilters)];
        setUserFilters(uniqueFilters)
    } 

    const handleDateSortClick = () => {
        setDateNewFirst(!dateNewFirst)
        reverseOrder()
    }

    if(!active) {
        return null
    }
    return(
        <>
            <select id="tags" className="add-link__input add-link-tag__select" placeholder="Search tags" onChange={handleTagSelect}>
                <option disabled selected>Filter by tag</option>
                {tags}
            </select>

            <select id="user" className="add-link-tag__select add-link__input" placeholder="Search users" onChange={handleUserSelect}>
                <option disabled selected>Filter by user</option>
                
                {users}
            </select>
            <button className="toggle-order__button button-hover" onClick={ handleDateSortClick }>{dateNewFirst ? `Newest First ⬆` : 'Oldest first ⬇'}</button>
        </>
    )
}

export default Filters