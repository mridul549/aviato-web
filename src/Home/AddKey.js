import React, { useState, useEffect } from 'react';

const AddKey = ({ setModal, modal, setToast, toast }) => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [apis, setApis] = useState([])

  const closeModal = () => {
    setModal(false);
  };

  const handleSubmit = async () => {
    if(apiKey === '') { 
      // Handle empty API key here, e.g., display error message
      console.error('API key is empty');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/key/${apiKey}`, {
        method: 'POST'
      });

      if (response.ok) {
        setToast(true)
        setTimeout(() => setToast(false), 3000); 
        setModal(false); 
      } else {
        // Handle errors or unsuccessful attempts here, e.g., display error message
        console.error('Failed to add API key');
      }
    } catch (error) {
      console.error('Error submitting API key:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchKeys = async () => {
      const response = await fetch('http://localhost:8000/key');
      const json = await response.json();
      console.log(json);
      setApis(json);
    };

    fetchKeys();
  }, []);


  useEffect(() => {
    const dialog = document.getElementById('my_modal_4');
    if (modal) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [modal]);

  return (
    <div>
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box">
          <div className='flex justify-center'>
            <h3 className="font-bold text-2xl">Add Google API Key</h3>
          </div>
          <div className='pt-5'>
            <input
              type="text"
              required
              placeholder="Type API Key here..."
              className="input input-bordered w-full"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className='pt-4'>
            <strong>Current API Keys:</strong>
            <div className='pt-2'>
              {apis.map((api, index) => (
                <div className='flex justify-between pt-1' key={index}>
                  <p className='w-[80%]'>{api.keyValue}</p>
                  {api.active === false ?
                    <div className="badge badge-secondary">Inactive</div> :
                    <div className="badge badge-accent">Active</div>
                  }
                </div>
              ))}
            </div>

          </div>

          <div className="modal-action flex justify-between">
            <button className="btn" onClick={closeModal} disabled={loading}>Close</button>
            <button className="btn btn-accent w-20" onClick={handleSubmit} disabled={loading || apiKey === ""}>
              {loading ? <span className="loading loading-circle loading-sm"></span> : 'Submit'}
            </button>
          </div>
        </div>
      </dialog>
      
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

export default AddKey;
