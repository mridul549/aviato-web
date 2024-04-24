import React from 'react'

const VideoCard = (props) => {

  const generateDate = () => {
    const date = new Date(props.video.publishedTime)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()} `
  }

  return (
    <div className="card w-80 bg-base-100 shadow-md">
      <figure><img src={props.video.thumbnail} className='' style={{ height: "135%" }} alt={props.video.thumbnail} /></figure>
      <div className="card-body p-4">
        <div className='h-full'>
          <h2 className="card-title">{props.video.title}</h2>
          <p className='overflow-auto'>{props.video.description}</p>
        </div>
        <div className=''>
          <strong>{props.video.channel}</strong>
          <p>{generateDate()}</p>
        </div>
      </div>
    </div>
  )
}

export default VideoCard