import React, { useEffect, useState } from 'react';
import Aviato from '../Assets/Images/aviato.svg';
import VideoCard from './VideoCard';
import AddKey from './AddKey';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState({
    pageSize: 10,
    totalRecords: 0,
    currentPage: 1,
    totalPages: 0,
    sortBy: 0
  });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false)
  const [toast, setToast] = useState(false)

  const fetchVideos = async () => {
    setLoading(true);
    const response = await fetch(`http://localhost:8000?page=${page.currentPage}&page_size=${page.pageSize}&sort_by=${page.sortBy}`);
    const json = await response.json();

    setVideos(json.videos);
    setPage(prev => ({
      ...prev,
      totalRecords: json.total_count,
      totalPages: Math.ceil(json.total_count / page.pageSize),
    }));
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, [page.currentPage, page.pageSize, page.sortBy]); 

  const handlePrevious = () => {
    setPage(prev => ({ ...prev, currentPage: Math.max(1, prev.currentPage - 1) }));
  };

  const handleForward = () => {
    setPage(prev => ({ ...prev, currentPage: Math.min(prev.totalPages, prev.currentPage + 1) }));
  };

  const handleChangePageSize = (size) => {
    setPage(prev => ({
      ...prev,
      pageSize: size,
      currentPage: 1 // Reset to page 1 to avoid out-of-bounds page number
    }));
  };

  const handleSortBy = (sortBy) => {
    setPage(prev => ({
      ...prev,
      sortBy: sortBy,
      currentPage: 1 // Reset to page 1 to avoid out-of-bounds page number
    }));
  }

  return (
    <div>
      {modal ? <AddKey modal={modal} setModal={setModal} setToast={setToast} toast={toast} /> : "" }

      <div className='flex justify-between align-middle pl-10 pr-10'>
        <div className='w-[20%]'></div>
        <div className="navbar w-60% bg-base-100 flex justify-center flex-col">
          <img src={Aviato} alt="Aviato Logo" className='w-48' />
          <h1>Catch the latest Cricket Videos!</h1>
        </div>
        <div className='flex w-[20%] justify-end items-center'>
          <button className="btn" onClick={() => setModal(true)}>Add API Key</button>
        </div>
      </div>

      <div className="filters pl-10 pr-10 flex justify-between">
        <div className="dropdown dropdown-bottom p-0">
          <div tabIndex={0} role="button" className="btn">Number of Videos: <span className='font-normal'>{page.pageSize}</span></div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu shadow p-2 bg-base-100 rounded-box w-52">
            {[10, 20, 30, 40, 50].map(size => (
              <li key={size}><a onClick={() => handleChangePageSize(size)}>{size}</a></li>
            ))}
          </ul>
        </div>

        <div className="dropdown dropdown-end p-0">
          <div tabIndex={0} role="button" className="btn">Sort By: <span className='font-normal'>{page.sortBy === 0 ? 'Most Recent First' : 'Least Recent First'}</span></div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu shadow p-2 bg-base-100 rounded-box w-52">
            {['Most Recent First', 'Least Recent First'].map((option, index) => (
              <li key={index}><a onClick={() => handleSortBy(index)}>{option}</a></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="body p-10 pb-0 grid grid-cols-4 gap-4 w-full">
        {loading ? (
          <div className='col-span-4 flex justify-center items-center'>
            <span className="loading loading-circle loading-lg"></span>
          </div>
        ) : (
          videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))
        )}
      </div>

      <div className="join flex justify-center p-10">
        <button className="join-item btn" onClick={handlePrevious} disabled={page.currentPage === 1}>«</button>
        <button className="join-item btn">Page {page.currentPage} of {page.totalPages}</button>
        <button className="join-item btn" onClick={handleForward} disabled={page.currentPage === page.totalPages}>»</button>
      </div>

      {toast && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-success">
            <span>Key added successfully!</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
