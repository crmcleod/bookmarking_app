import React from 'react'
import './userModal.css'

const UserModal = ({handleSignOut}) => {

    const handleModalSlider = (factor) => {
        const menu = document.querySelector('#user-modal')
        menu.style.transform = `translate(${factor}%)`
    }

    return(
        <>
            <div id='menu-open' className='hidden-1000' aria-label='Menu button' onClick={() => handleModalSlider(0)}>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div className='hidden-1000' onMouseLeave={() => handleModalSlider(110)} id='user-modal'>
                <p id="menu-close" onClick={() => handleModalSlider(110)}>ⓧ</p>
                <button className='filter button-hover' id='modal-sign-out-button' onClick={handleSignOut}>Sign out</button>
                {/* <p className='filter button-hover'>alter user details to be added</p> */}
            </div>
        </>
    )
}

export default UserModal