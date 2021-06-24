import React, { useState, useEffect } from 'react'
import axios from 'axios'

import './addLink.css'
import DropDown from '../dropDown/dropDown'

const AddLinkContainer = ({ 
    active, 
    setAddLinksActive,
    bookmarks,
    setBookmarks,
    getLinksFromDatabase,
    getPrevious,
    id,
    authToken
    
}) => {
    
    
    const linkObject = {
        linkTitle: "",
        linkURL: "",
        dateAdded: ""
    }
    const userObject = {
        name: ""
    }
    const tagArray = [{
        tag: ""
    }]
    
    const [link, setLink] = useState( linkObject )
    const [user, setUser] = useState( userObject )
    const [tags, setTags] = useState( tagArray )
    const [usersFromDatabase, setusersFromDatabase] = useState([])
    const [tagsFromDatabase, settagsFromDatabase] = useState([])
    const [filteredUsersFromDatabase, setFilteredUsersFromDatabase] = useState()
    const [filteredTagsFromDatabase, setFilteredTagsFromDatabase] = useState()

    useEffect(() => {
        setLink(linkObject)
        setUser(userObject)
        setTags(tagArray)
        setusersFromDatabase(uniqueRecords('users', 'name'))
        settagsFromDatabase(uniqueRecords('tags', 'tag'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active])



    const handleLinkInput = (e) => {
        setLink({...link, linkURL: e.target.value})
    }

    const handleLinkDescriptionInput = (e) => {
        setLink({...link, linkTitle: e.target.value})
    }

    const handleUserInput = (e) => {
        setUser({...user, name: e.target.value})
        let filtered = usersFromDatabase.filter((user) => {
            return user.name.toLowerCase().includes(e.target.value.toLowerCase())
        })
        setFilteredUsersFromDatabase(filtered)

    }

    const handleTagSelect = (e) => {
        setTags([{ tag: e.target.value}]) 
        let filtered = tagsFromDatabase.filter((tag) => {
            return tag.tag.toLowerCase().includes(e.target.value.toLowerCase())
        })
        setFilteredTagsFromDatabase(filtered)
    }

    const getCustomDate = () => {
        const date = new Date()
        const editedDate = `${date.getFullYear()}${checkDateLength(date.getMonth()+1)}${checkDateLength(date.getDate())}${date.getTime()}`
        return editedDate
    }
    
    const checkDateLength = (date) => {
        return `${date}`.length === 1 ? `${'0'+date}` : date
    }

    const checkLinkPrefix = ( x ) => {
        if ( x.includes('http', 'https')){
            setLink({...link, linkURL: x})
            console.log('contains')
            return ''
        } else {
            setLink({...link, linkURL: 'https://'+x})
            console.log('!contains')

            return 'https://'
        }
    }

    const postData = () => {
        if(filteredTagsFromDatabase.length > 0 && (filteredTagsFromDatabase[0].tag === tags[0].tag && filteredTagsFromDatabase.length === 1 && !tags[0][id])){setTags([...filteredTagsFromDatabase])}
        if(filteredUsersFromDatabase.length > 0 && (filteredUsersFromDatabase[0].name === user.name && filteredUsersFromDatabase.length === 1 && !user[id])){setUser({...filteredUsersFromDatabase[0]})}
        const userToPostId = filteredUsersFromDatabase ? filteredUsersFromDatabase.length === 1 ? filteredUsersFromDatabase[0].id : user : user
        const tagToPostId = filteredTagsFromDatabase ? filteredTagsFromDatabase.length === 1 ? filteredTagsFromDatabase[0].id : tags : tags
        const existingUser = filteredUsersFromDatabase && filteredUsersFromDatabase.length === 1
        const existingTag = filteredTagsFromDatabase && filteredTagsFromDatabase.length === 1
        console.log(existingUser, existingTag)
    
        if(existingUser ) {
            axios.post(`${process.env.REACT_APP_SERVER_URL}api/links`, { ...link,
                "linkURL": checkLinkPrefix(link.linkURL)+link.linkURL,
                "user": {"id": userToPostId },
                "dateAdded": `${getCustomDate()}`,
                "tags": existingTag && [{id: tagToPostId }],
                "appUser": {
                    "id": id
                }
            }, authToken)
                .then( res => {
                    !existingTag &&
                    axios.post(`${process.env.REACT_APP_SERVER_URL}api/tags`,{
                        "tag": tags[0].tag,
                        "links": [{
                            "id": res.data.id
                        }]
                    }, authToken)
                    .then( res => {
                        axios.get(`${process.env.REACT_APP_SERVER_URL}api/links/${res.data.links[0].id}`, authToken)
                            .then( res => {
                                setBookmarks([...bookmarks, res.data])
                            })
                    })
                })
        } else if(!existingUser)
        axios.post(`${process.env.REACT_APP_SERVER_URL}api/users`, user, authToken)
            .then( res => {
                axios.post(`${process.env.REACT_APP_SERVER_URL}api/links`, { ...link,
                    "linkURL": checkLinkPrefix(link.linkURL)+link.linkURL,
                    "user": {"id": res.data.id },
                    "dateAdded": `${getCustomDate()}`,
                    "tags": [],
                    "appUser": {
                        "id": id
                    }
                }, authToken)
                    .then( res => {
                        !existingTag &&
                        axios.post(`${process.env.REACT_APP_SERVER_URL}api/tags`,{
                            "tag": tags[0].tag,
                            "links": [{
                                "id": res.data.id
                            }]
                        }, authToken)
                        .then( res => {
                            axios.get(`${process.env.REACT_APP_SERVER_URL}api/links/${res.data.links[0].id}`, authToken)
                                .then( res => {
                                    setBookmarks([...bookmarks, res.data])
                                })
                        })
                    })
            })
            getLinksFromDatabase()

    }

    const handleLinkSubmit = (e) => {
        e.preventDefault()
        postData()
        setAddLinksActive(!active)
    }


    const uniqueRecords = (records, matchCondition) => {
        let lookup = {}
        let previousRecords = getPrevious()
        let previousSpecificRecords = previousRecords[records]
        let result = []

        // eslint-disable-next-line no-cond-assign
        for( let record, i = 0; record = previousSpecificRecords[i++];) {
            let specificMatchCondition = record[matchCondition].toLowerCase();
         
            if(!(specificMatchCondition in lookup)) {
                lookup[specificMatchCondition] = 1
                result.push(record)
            }
        }
        // records === 'users' ? setusersFromDatabase([...result]) : records === 'tags' && settagsFromDatabase([...result])
        return result
        
    }

    const handleFocus = (querySelector) => {
        document.querySelector(querySelector).style.display='unset'
    }

    const handleBlur = (querySelector) => {
        document.querySelector(querySelector).style.display='none'
    }
    if( !active) return null

    return(
        <>
            <form onSubmit={handleLinkSubmit}>
                <div className="add-link-wrapper">
                    <p onClick={() => setAddLinksActive(false)} id="form-close-button">&#10005;</p>
                    <div className="add-link__input-wrapper">
                        <input className="add-link__input" required type="text" placeholder="Enter Link" onChange={handleLinkInput} value={link.linkURL} />
                        <input className="add-link__input add-link__input--description"  required type="text" placeholder="Enter Link description" onChange={handleLinkDescriptionInput} value={link.linkTitle} />
                        <div style={{'display': 'flex', 'flexDirection': 'column'}}>
                            <input className="add-link-user__datalist add-link__input" type="search" required list="user" placeholder="Search users or add new" onChange={handleUserInput} value={user.name} onFocus={() => handleFocus('.dropdown-users')} onBlur={() => handleBlur('.dropdown-users')}></input>
                            {uniqueRecords('users', 'name').length > 0 && 
                            <DropDown 
                                filtered={filteredUsersFromDatabase} 
                                menuItems={uniqueRecords('users', 'name')} 
                                recordKey='name' 
                                className='dropdown-users'
                                setState={setUser}
                                />}
                        </div>
                        {/* <input type="hidden" name="answer"/> */}
                        <div style={{'display': 'flex', 'flexDirection': 'column'}}>
                            <input className="add-link__input add-link-tag__datalist" list="tags" type="search" placeholder="Search tags or add new" onFocus={() => handleFocus('.dropdown-tags')} onBlur={() => handleBlur('.dropdown-tags')} onChange={handleTagSelect} value={tags.length > 0 ? tags[0].tag : ""}/>
                            {uniqueRecords('tags', 'tag').length > 0 && 
                            <DropDown 
                                filtered={filteredTagsFromDatabase} 
                                menuItems={uniqueRecords('tags', 'tag')} 
                                recordKey='tag' 
                                className='dropdown-tags'
                                setState={setTags}
                                />}
                        </div>
                        <button tabIndex type="submit" className="add-link__button">Add new link!</button>
                    </div>
                </div>
            </form>

        </>
        
    )
}

export default AddLinkContainer