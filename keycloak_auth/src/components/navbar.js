import React from 'react'
import { Link } from "react-router-dom"
const navbar=()=>{
    return(
        <div>
            <li><Link to="/todo">Todo</Link></li>
        </div>
    )
}
export default navbar