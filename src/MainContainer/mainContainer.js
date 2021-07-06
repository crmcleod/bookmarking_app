import axios from 'axios'
import React, {useEffect, useState} from 'react'
import AddLinkContainer from '../AddLink/addLinkContainer'
import Bookmark from '../bookmark/bookmark'
import Filters from '../Filters/filters'
import UserModal from '../Filters/userModal'

const MainContainer = ({id, authToken, active, setID, setSignedIn, setSignedOut, setExistingUser, setEncryptedPassword, setUserName, setPassword}) => {

    const [ addLinksActive, setAddLinksActive ] = useState( false )
    const [ bookmarks, setBookmarks ] = useState([])
    const [ filteredBookmarks, setFilteredBookmarks ] = useState([])
    const [ tags, setTags ] = useState([])
    const [ users, setUsers ] = useState([])
    const [ filters, setFilters ] = useState([])
    const [ userFilters, setUserFilters ] = useState([])
    const [ dateNewFirst, setDateNewFirst ] = useState(true)

    const resetSelect = ( cssSelector ) => {
        document.querySelector( `#${cssSelector}` ).selectedIndex = 0
    }

    useEffect(() => {
        resetSelect('tags')
        resetSelect('user')
    }, [active, filters, userFilters])

    const handleDeleteFilter = (e) => {
        const newFilters = filters.filter(x => x !== e.target.previousSibling.data)
        const newUserFilters = userFilters.filter(x => x !== e.target.previousSibling.data)
        const uniqueFilters = [...new Set(newFilters)];
        const uniqueUserFilters = [...new Set(newUserFilters)]
        setFilters(uniqueFilters)
        setUserFilters(uniqueUserFilters)
    }

    const allFilters = [...filters, ...userFilters]
    const filterDisplay = allFilters.map((filter) => {
        return(
            <div key={filter} className='filter'>{filter}<span className='delete-cross' onClick={handleDeleteFilter}>&nbsp; &#x2717;</span></div>
        )
    })

    const getPreviousUsersAndTags = () => {

        const users = bookmarks.map((bookmark) => {
            return bookmark.user
        })
        const tags = bookmarks.map((bookmark) => {
            return bookmark.tags[0]
        })

        return {
            users,
            tags
        }
    }

    const dateSortLinks = (dates) => {
        const newDates = dates.sort((a, b) => {
            return b.dateAdded - a.dateAdded
        })
        return newDates
    }

    useEffect(() => {
        getLinksFromDatabase()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active,setAddLinksActive])

    useEffect(() => {
        getLinksFromDatabase()
        return() => {
            setBookmarks('')
            setID('')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const config = {
        headers: {
            "Authorization": authToken
        }
    }
    const getLinksFromDatabase = () => {
       
        axios.get(`${process.env.REACT_APP_SERVER_URL}api/links?id=${id}`, config)
            .then(res => dateSortLinks(res.data))
            .then(res => {
                setBookmarks(res)
                setFilteredBookmarks(res)
            })
            .then(() => {
                axios.get(`${process.env.REACT_APP_SERVER_URL}api/tags?id=${id}`, config)
                    .then(res => {
                        if(res.data.length > 0){
                            const tags = res.data.map((tag) => tag.tag.toLowerCase())
                            const uniqueTags = [...new Set(tags)]
                            const newTags = uniqueTags.map((tag) => {
                                return <option key={tag} value={tag}>{tag}</option>
                            })
                            setTags(newTags)
                        } else {
                            return null
                        }
                    })
            })
            .then(() => {
                axios.get(`${process.env.REACT_APP_SERVER_URL}api/users?id=${id}`, config)
                    .then(res => {
                        if(res.data.length > 0){
                            const users = res.data.map((user) => user.name.toLowerCase())
                            const uniqueUsers = [...new Set(users)]
                            const newUsers = uniqueUsers.map((user) => {
                                return <option key={user} value={user}>{user}</option>
                            })
                            setUsers(newUsers)
                        } else {
                            return null
                        }
                     })
            })


    }

    const filterBookmarks = () => {
        let newFilteredBookmarks = []
        let tempFilteredBookmarks

        if(filters.length === 0 && userFilters.length === 0) {
            setFilteredBookmarks(dateSortLinks(bookmarks))
            setDateNewFirst(true)
        } else if (
            userFilters.length > 0 && filters.length === 0
        ) {
            for(let filter of userFilters) {
                tempFilteredBookmarks = bookmarks.filter((bookmark) => {
                    return bookmark.user.name.toLowerCase() === filter.toLowerCase()
                })
                newFilteredBookmarks.push(...tempFilteredBookmarks)
                setFilteredBookmarks(dateSortLinks([...new Set(newFilteredBookmarks)]))
            }
        } else if (
            userFilters.length === 0 && filters.length > 0
        ){
            for(let filter of filters) {
                tempFilteredBookmarks = bookmarks.filter((bookmark) => {
                    return bookmark.tags[0].tag.toLowerCase() === filter.toLowerCase() || bookmark.user.name.toLowerCase() === filter.toLowerCase()
                })
                newFilteredBookmarks.push(...tempFilteredBookmarks)
                setFilteredBookmarks(dateSortLinks([...new Set(newFilteredBookmarks)]))
            }
    } else {
        newFilteredBookmarks = []
        tempFilteredBookmarks = null
        for(let filter of filters) {
            for(let user of userFilters) {

                tempFilteredBookmarks = bookmarks.filter((bookmark) => {
                    return (bookmark.tags[0].tag.toLowerCase() === filter.toLowerCase() && bookmark.user.name.toLowerCase() === user.toLowerCase())
                })
                newFilteredBookmarks.push(...tempFilteredBookmarks)
                setFilteredBookmarks(dateSortLinks([...new Set(newFilteredBookmarks)]))
            }
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
        bookmarks.length > 0 && filterBookmarks() 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, userFilters, bookmarks])

    const bookmarkConditional = () => (filteredBookmarks.length > 0 ? filteredBookmarks : bookmarks)

    const formatDate = (date) => {
        return `${ date.slice(6, 8) + "-" + date.slice(4, 6) + "-" + date.slice(0, 4) }`
    } 

    const bookmarksToDisplay = bookmarkConditional().length === 0 ? 
        <h2 id='nothing-to-see'>Nothing to see here at the moment &nbsp;  👀</h2> :
        bookmarkConditional().map((bookmark) => {
            return(
                <Bookmark
                    key={bookmark.id}
                    bookmark={bookmark}
                    formatDate={formatDate}
                    getLinksFromDatabase={getLinksFromDatabase}
                    config={config}
                />
            )
        })

        const handleSignOut = () => {
            localStorage.setItem('keep-signed-in-bookmarko', false)
            setSignedIn(false)
            setSignedOut(true)
            setExistingUser(true)
            setUserName('')
            setEncryptedPassword('')
            setPassword('')
        }

        if(!active) {
            return null
        }
    return(
        <>
            <AddLinkContainer 
                setAddLinksActive={setAddLinksActive} 
                active={addLinksActive}
                bookmarks={bookmarks}
                setBookmarks={setBookmarks}
                getLinksFromDatabase={getLinksFromDatabase}
                getPrevious={getPreviousUsersAndTags}
                id={id}
                authToken={config}
            />
            
            <div id="header-wrapper">
                <Filters
                    filters={ filters }
                    setFilters={ setFilters }
                    userFilters={ userFilters }
                    setUserFilters={ setUserFilters }
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
                    <>  
                        <button id="add-link-button" className="filter button-hover" onClick={()=> setAddLinksActive(true)}>
                            <p className='hidden-600'>add new bookmark</p>
                            <p className='show-600'>+</p>
                        </button>
                        <button className='filter button-hover' id='sign-out-button' onClick={handleSignOut}>Sign out</button>
                    </>
                }
                </div>
                {addLinksActive ? 
                    null : 
                    <>
                        <div id="filter__wrapper">
                            <p>
                                {filters.length === 0 && userFilters.length === 0 && 'No filters selected'}
                            </p>
                            {filterDisplay}
                        </div>
                    </>
                }
            {addLinksActive ? 
                null : 
                <div id='link-wrapper'>
                    <ul>
                        {bookmarksToDisplay}
                    </ul>
                </div>
            }
            <UserModal handleSignOut={handleSignOut}/>
        </>
    )
}

export default MainContainer