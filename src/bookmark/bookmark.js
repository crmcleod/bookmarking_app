import axios from 'axios'
import React from 'react'

const Bookmark = ({
    bookmark,
    formatDate,
    getLinksFromDatabase,
    config
}) => {

    const handleEllipsesClick = (id) => {
        if(window.confirm('Delete this bookmark?')){
            axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/links/${id}`, config)
                .then(() => getLinksFromDatabase())
                .catch(err => console.error(err))
        }
    }
    if(!bookmark) {
        return(
            <li className='link'>Loading...</li>
        )
    }
    return(
        <li className='link' key={bookmark.id}>
            <a className="link-anchor" noopener='true' rel="noreferrer" target="_blank" href={bookmark.linkURL}>{bookmark.linkTitle}</a>
            <p>{bookmark ? bookmark.tags[0].tag : '....'}</p>
            <p>{bookmark.user.name}</p>
            <p className="link-date">{formatDate(bookmark.dateAdded)}</p>
            <div onClick={() => handleEllipsesClick(bookmark.id)} id='more-info-ellipses'>
                <span>●</span>
                <span>●</span>
                <span>●</span>
            </div>
        </li>
    )
}

export default Bookmark