import React from 'react'
import './loader.scss';
const loader = () => {
  return (
    <div className="loading-screen">
    <div class="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
  )
}

export default loader
