import React, { useState, useEffect } from 'react'
import axios from 'axios'

import './addLink.css'

const AddLinkContainer = ({ 
    active, 
    setAddLinksActive,
    bookmarks,
    setBookmarks,
    getLinksFromDatabase

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

    useEffect(() => {
        setLink(linkObject)
        setUser(userObject)
        setTags(tagArray)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active])


    const [link, setLink] = useState( linkObject )
    const [user, setUser] = useState( userObject )
    const [tags, setTags] = useState( tagArray )

    const handleLinkInput = (e) => {
        setLink({...link, linkURL: e.target.value})
    }

    const handleLinkDescriptionInput = (e) => {
        setLink({...link, linkTitle: e.target.value})
    }

    const handleUserInput = (e) => {
        setUser({...user, name: e.target.value})
    }

    const handleTagSelect = (e) => {
        setTags([{ tag: e.target.value}]) 
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
        axios.post('http://localhost:8080/users', user)
            .then( res => {
                axios.post('http://localhost:8080/links', { ...link,
                    "linkURL": checkLinkPrefix(link.linkURL)+link.linkURL,
                    "user": {"id": res.data.id },
                    "dateAdded": `${getCustomDate()}`,
                    "tags": []
                })
                    .then( res => {
                        axios.post('http://localhost:8080/tags',{
                            "tag": tags[0].tag,
                            "links": [{
                                "id": res.data.id
                            }]
                        })
                        .then( res => {
                            axios.get(`http://localhost:8080/links/${res.data.links[0].id}`)
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

    if( !active) return null

    return(
        <form onSubmit={handleLinkSubmit}>
            <div className="add-link-wrapper">
                <p onClick={() => setAddLinksActive(false)} id="form-close-button">&#10005;</p>
                <div className="add-link__input-wrapper">
                    <input className="add-link__input" required="true" type="text" placeholder="Enter Link" onChange={handleLinkInput} value={link.linkURL} />
                    <input className="add-link__input add-link__input--description"  required type="text" placeholder="Enter Link description" onChange={handleLinkDescriptionInput} value={link.linkTitle} />
                    <input className="add-link-user__datalist add-link__input" type="search" required list="user" placeholder="Search users or add new" onChange={handleUserInput} value={user.name}></input>
                    <datalist id="user" >
                        <option data-value='NOT SHOWN' value="No user">No user</option>
                        <option value="sherry"></option>
                        <option value="alex"></option>
                    </datalist>
                    <input type="hidden" name="answer"></input>
                    <input className="add-link__input" list="tags" type="search" placeholder="Search tags or add new" onChange={handleTagSelect} value={tags.length > 0 ? tags[0].tag : ""}/>
                    <datalist id="tags" className="add-link-tag__select" >
                        <option value="Untagged"></option>
                        <option value="something1">something1</option>
                        <option value="something2">something2</option>
                    </datalist>
                    <button type="submit" className="add-link__button">Add new link!</button>
                </div>
            </div>
        </form>
    )
}

export default AddLinkContainer