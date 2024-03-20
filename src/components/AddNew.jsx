import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck, faPlus } from '@fortawesome/free-solid-svg-icons';

function AddNew({ btnName }) {
  const [submenuData, setSubmenuData] = useState(() => {
    const storedData = localStorage.getItem('submenuData');
    return storedData ? JSON.parse(storedData) : [];
  });

  const [showNewListModal, setShowNewListModal] = useState(false);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    localStorage.setItem('submenuData', JSON.stringify(submenuData));
  }, [submenuData]);

  const handleAddList = () => {
    const trimmedName = newListName.trim();
    if (trimmedName === '') {
      alert('Please enter a list name.');
      return;
    }
    const newList = {
      id: new Date().getTime(),
      name: trimmedName,
      todos: []
    };
    setSubmenuData([...submenuData, newList]);
    setShowNewListModal(false);
    setNewListName('');
  };

  return (
    <div className='addNew fs-1 d-flex flex-column justify-content-center align-items-center'>
      <FontAwesomeIcon icon={faListCheck} className='icon'/>
      <p className='fs-5 fw-bold mt-2'>No to do list yet...</p>
      
      <button type="button" className="btn btn-outline-primary align-items-cenetr text-center mt-3" onClick={() => setShowNewListModal(true)}>
        <FontAwesomeIcon icon={faPlus} /> {btnName}
      </button>

      {showNewListModal && (
        <div className="modal">
          <div className="modal-content">
            <input
              type="text"
              className="formInput w-100"
              placeholder="Enter list name..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <div className='d-flex flex-row justify-content-end pt-2'>
                <button className="btnOutline btn btn-outline-secondary me-1" onClick={() => setShowNewListModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-secondary" onClick={handleAddList} disabled={newListName.trim() === ''}>
                  Add
                </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AddNew