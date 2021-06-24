import React from 'react'
import './dropDown.css'

const DropDown = ({menuItems, className, recordKey, filtered, setState}) => {

    const handleClick = (id, record) => {
        setState(
            recordKey === 'tag' ? [{id, [recordKey] : record}] : {id, [recordKey]: record})}
    const options = (filtered ? filtered.length > 0 ? filtered : menuItems : menuItems).map((item) => {
            return <li onMouseDown={() => handleClick(item.id, item[recordKey])} className='user-datalist-option' key={item.id} value={item.id}>{item[recordKey]}</li>
        })

    return(
        <>
            <div id='dropdown-menu' className={className}>
                {options}
            </div>
        </>
    )
}

export default DropDown