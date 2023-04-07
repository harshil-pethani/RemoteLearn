import React from 'react'

const Loader = ({ adminLoader, height }) => {
    return (
        <div style={(adminLoader && { paddingLeft: "250px", paddingTop: "120px" }) || (height && { height: `calc(100vh - ${height})` })} className="loaderMain" >
            <div className="lds-roller">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div >
    )
}

export default Loader