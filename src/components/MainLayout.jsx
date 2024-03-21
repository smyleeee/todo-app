import React, { useEffect, useState } from 'react';
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import Stack from 'react-bootstrap/Stack';

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaPlus } from "react-icons/fa6";
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

//components

function MainLayout() {
  // About Date and time
  const currentDate = new Date();
  const currentHour = currentDate.getHours();

  let greeting;
  if (currentHour < 12) {
    greeting = 'Good Morning!';
  } else if (currentHour < 18) {
    greeting = 'Good Afternoon!';
  } else {
    greeting = 'Good Evening!';
  }

  const monthAbbrev = currentDate.toLocaleString('default', { month: 'short' });
  const dayOfMonth = currentDate.getDate();
  //End of date and time

  const [submenuData, setSubmenuData] = useState(() => {
    const storedData = localStorage.getItem('submenuData');
    return storedData ? JSON.parse(storedData) : [];
  });

  //Rerender when submenu changes
  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedData = localStorage.getItem('submenuData');
      if (storedData) {
        setSubmenuData(JSON.parse(storedData));
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const [editingText, setEditingText] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);

  const [showNewListModal, setShowNewListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedList, setSelectedList] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const navigate = useNavigate();

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
    // navigate(`/list/${newList.id}`);
  };

  const handleEditModal = (index, newName) => {
    const updatedData = [...submenuData];
    updatedData[index].name = newName;
    setSubmenuData(updatedData);
    localStorage.setItem('submenuData', JSON.stringify(updatedData));
  };

  const handleEditModalOpen = (index, text) => {
    setEditingText(text);
    setEditingIndex(index);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditingText('');
    setEditingIndex(-1);
  };

  const handleEditModalConfirm = () => {
    if (editingText.trim() === '') {
      alert('Please enter a new name for the list.');
      return;
    }
    const updatedData = [...submenuData];
    updatedData[editingIndex].name = editingText.trim();
    setSubmenuData(updatedData);
    localStorage.setItem('submenuData', JSON.stringify(updatedData));
    setShowEditModal(false);
    setEditingText('');
    setEditingIndex(-1);
  };
  const handleNewListModalClose = () => {
    setShowNewListModal(false);
    setNewListName('');
  };

  const handleNewListModalConfirm = () => {
    handleAddList();
    handleNewListModalClose();
  };

  const handleDeleteModal = (index) => {
    setSelectedList(submenuData[index]);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedList(null);
  };

  const handleModalConfirm = () => {
    const updatedData = submenuData.filter((item) => item.id !== selectedList.id);
    setSubmenuData(updatedData);
    localStorage.setItem('submenuData', JSON.stringify(updatedData));
    setShowModal(false);
    setSelectedList(null);
  };

  useEffect(() => {
    localStorage.setItem('submenuData', JSON.stringify(submenuData));
  }, [submenuData]);



  return (
    <div className='Con d-flex'>
      <div className='sideNav user-select-none'>
        <div className='d-flex justify-content-center'>
          <img src="/lexmeet_logo.png" alt="Lexmeet Logo" className="logo " />
        </div>
        {/* <h1 className='Title'>LexDoIt!</h1> */}

        <Stack gap={1} className="pt-3 fs-5 text-start align-items-center user-select-none">
          <div className="menu-clickable p-2 ps-5 cursor-pointer">
          <NavLink
            to="/home"
            className={({ isActive }) => `text-decoration-none ${isActive ? "text-decoration-underline" : ""}`}
            end
          >
            <p className="navLink">Home</p>
          </NavLink>
          </div>
          <div className="menu p-2 ps-5">My List</div>
          {submenuData.map((item, index) => (
            <li key={item.id} className='submenu p-2 indent20 d-flex justify-content-between align-items-center text-center'>
            <NavLink
              to={`/list/${item.id}`}
              className={({ isActive }) => `text-decoration-none ${isActive ? "text-decoration-underline" : ""}`}
              end
            >
              <p className="navLink">{item.name}</p>
            </NavLink>
            <div className='pe-2'>
            <div className="iconGroup d-flex">
              <FontAwesomeIcon icon={faPenToSquare} className="icon hide-icon me-2" onClick={() => handleEditModalOpen(submenuData.indexOf(item))}/>
              <FontAwesomeIcon icon={faTrashCan} className="icon hide-icon" onClick={() => handleDeleteModal(index)} />
            </div>
              {/* <FontAwesomeIcon icon={faTimes} className="hide-icon" onClick={() => handleEditModalConfirm(index)} /> */}
            </div>
          </li>
          
          ))}

          <div className="menu-clickable p-2 ps-5 cursor-pointer text-center d-flex align-items-center" onClick={() => setShowNewListModal(true)}>
            <FaPlus />
            <p className='ps-2'>New List</p>
          </div>
        </Stack>
      </div>

      <div className='d-flex flex-column w-100 mh-100'>
        <div className='topNav user-select-none d-flex flex-row text-center align-items-center'> 

          <div className='navDate'>
            <p className='subTitle'>
              <span>{monthAbbrev}</span> <br />
              <span>{dayOfMonth}</span>
            </p>
          </div>

          <div className='ps-3 text-start'>
            <h1 className='navTitle'>{greeting}  </h1>
            <p className='subTitle'>What is your plan for today?</p>                  
          </div>              
        </div>

        <main className="flex-grow ">
          <Outlet />
        </main>
      </div>

      {showNewListModal && (
        <div className="modal">
          <div className="modal-content">
            <input
              type="text"
              className="formInput w-100"
              placeholder="Enter new list name..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <div className='d-flex flex-row justify-content-end pt-2'>     
                <button className="btnOutline btn btn-outline-secondary me-1" onClick={handleNewListModalClose}>
                  Cancel
                </button>
                <button className="btn btn-secondary" onClick={handleNewListModalConfirm}>
                  Save changes
                </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this list?</p>
            <div className='d-flex flex-row justify-content-end mt-2'>     
                <button className="btnOutline btn btn-outline-secondary me-2" onClick={handleModalClose}>
                Cancel
               </button>
                <button className="btn btn-secondary" onClick={handleModalConfirm}>
                Delete
                </button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <input
              type="text"
              className="formInput w-100 mb-1"
              placeholder="Edit list name..."
              value={editingText || submenuData[editingIndex]?.name}
              onChange={(e) => setEditingText(e.target.value)}
            />
            <div className='d-flex flex-row justify-content-end pt-2'>     
                <button className="btnOutline btn btn-outline-secondary me-2" onClick={handleEditModalClose}>
                  Cancel
               </button>
                <button className="btn btn-secondary" onClick={handleEditModalConfirm}>
                  Save changes
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainLayout;