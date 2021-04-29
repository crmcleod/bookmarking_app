import axios from 'axios'
import React, {useEffect, useState} from 'react'
import AddLinkContainer from '../AddLink/addLinkContainer'
import Filters from '../Filters/filters'

const MainContainer = () => {

    const [ addLinksActive, setAddLinksActive ] = useState( false )
    const [ bookmarks, setBookmarks ] = useState([])
    const [ filteredBookmarks, setFilteredBookmarks ] = useState([])
    const [ tags, setTags ] = useState([])
    const [ users, setUsers ] = useState([])
    const [ filters, setFilters ] = useState([])
    const [ userFilters, setUserFilters ] = useState([])
    const [ dateNewFirst, setDateNewFirst ] = useState(true)


    const handleDeleteFilter = (e) => {
        const newFilters = filters.filter(x => x !== e.target.previousSibling.data)
        const uniqueFilters = [...new Set(newFilters)];
        setFilters(uniqueFilters)
    }

    const filterDisplay = filters.map((filter) => {
        return(
            <div key={filter} className='filter'>{filter}<span className='delete-cross' onClick={handleDeleteFilter}>&nbsp; &#x2717;</span></div>
        )
    })

    const dateSortLinks = (dates) => {
        const newDates = dates.sort((a, b) => {
            return b.dateAdded - a.dateAdded
        })
        return newDates
    }

    useEffect(() => {
        getLinksFromDatabase()
    }, [setAddLinksActive])
    
    const getLinksFromDatabase = () => {
        axios.get('https://bookmarko-server.herokuapp.com/links')
            .then(res => dateSortLinks(res.data))
            .then(res => {
                setBookmarks(res)
                setFilteredBookmarks(res)
            })

        axios.get('https://bookmarko-server.herokuapp.com/tags')
            .then(res => {
                const newTags = res.data.map((tag) => {
                    return <option key={tag.id} value={tag.id}>{tag.tag}</option>
                })
                setTags(newTags)
            })

        axios.get('https://bookmarko-server.herokuapp.com/users')
            .then(res => {
                const newUsers = res.data.map((user) => {
                    return <option key={user.id} value={user.id}>{user.name}</option>
                })
                setUsers(newUsers)
             })
    }

    const filterBookmarks = () => {
        let newFilteredBookmarks = []
        let tempFilteredBookmarks

        if(filters.length === 0) {
            setFilteredBookmarks(dateSortLinks(bookmarks))
            setDateNewFirst(true)
        } else {
            for(let filter of filters) {
                tempFilteredBookmarks = bookmarks.filter((bookmark) => {
                    return bookmark.tags[0].tag === filter || bookmark.user.name === filter
                })
                newFilteredBookmarks.push(...tempFilteredBookmarks)
                setFilteredBookmarks(dateSortLinks([...new Set(newFilteredBookmarks)]))
            }
    }
}

    const reverseOrder = () => {
        if(filteredBookmarks.length === 0){
            setFilteredBookmarks([...bookmarks.reverse()])
        } else {
            setFilteredBookmarks([...filteredBookmarks.reverse()])
        }
    }

    useEffect(() => {
        filterBookmarks()
    }, [filters, bookmarks])

    const bookmarkConditional = () => (filteredBookmarks.length > 0 ? filteredBookmarks : bookmarks)

    const formatDate = (date) => {
        return `${ date.slice(6, 8) + "-" + date.slice(4, 6) + "-" + date.slice(0, 4) }`
    } 

    const bookmarksToDisplay = bookmarkConditional().length === 0 ? 
        <h2 id='nothing-to-see'>Nothing to see here at the moment &nbsp;  👀</h2> :
        bookmarkConditional().map((bookmark) => {
            return(
                <div className='link' key={bookmark.id}>
                    <a className="link-anchor" noopener rel="noreferrer" target="_blank" href={bookmark.linkURL}>{bookmark.linkTitle}</a>
                    <p>{bookmark.tags[0].tag}</p>
                    <p>{bookmark.user.name}</p>
                    <p className="link-date">{formatDate(bookmark.dateAdded)}</p>
                </div>
            )
        })

    return(
        <>
            <AddLinkContainer 
                setAddLinksActive={setAddLinksActive} 
                active={addLinksActive}
                bookmarks={bookmarks}
                setBookmarks={setBookmarks}
                getLinksFromDatabase={getLinksFromDatabase}
            />
            
            <div id="header-wrapper">
                <Filters
                    filters={ filters }
                    setFilters={ setFilters }
                    active={!addLinksActive}
                    tags={tags.length > 0 ? tags : null} 
                    users={users.length > 0 ? users : null}
                    filteredBookmarks={filteredBookmarks}
                    setFilteredBookmarks={setFilteredBookmarks}
                    bookmarks={bookmarks}
                    setBookmarks={setBookmarks}
                    reverseOrder={reverseOrder}
                    dateNewFirst={dateNewFirst}
                    setDateNewFirst={setDateNewFirst}
                />
                {addLinksActive ? 
                    null : 
                    <button id="add-link-button" className="filter button-hover" onClick={()=> setAddLinksActive(true)}>add new bookmark</button>
                }
                </div>
                {addLinksActive ? 
                    null : 
                    <>
                        <div id="filter__wrapper">
                            <p>
                                {filters.length === 0 && 'No filters selected'}
                            </p>
                            {filterDisplay}
                        </div>
                    </>
                }
            {addLinksActive ? 
                null : 
                <div id='link-wrapper'>
                    {bookmarksToDisplay}
                </div>
            }
        </>
    )
}

export default MainContainer