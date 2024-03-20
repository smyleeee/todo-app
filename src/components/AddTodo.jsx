import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

function AddTodo() {
    const { id } = useParams();
    const [listId, setListId] = useState(id);
    
    const [todo, setTodo] = useState('');
    const [todoList, setTodoList] = useState(
        JSON.parse(localStorage.getItem('todoList')) || []
    );
    const [allCompleted, setAllCompleted] = useState(false);

  const completedTodos = todoList.filter((todo) => todo.completed);
  const incompleteTodos = todoList.filter((todo) => !todo.completed);

  const filteredTodoList = todoList.filter(todo => todo.listId === listId);

    useEffect(() => {
        setListId(id);
    }, [id]);

  useEffect(() => {
    localStorage.setItem('todoList', JSON.stringify(todoList));
  }, [todoList]);

  const handleInputChange = (event) => {
    setTodo(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      addTodoToList();
    }
  };

  const addTodoToList = () => {
    if (todo.trim() !== '') {
      const newTodo = {
        text: todo,
        dateTimeCreated: new Date().toLocaleString(),
        completed: false,
        id: new Date().getTime(),
        listId: listId, 
      };
      setTodoList([...todoList, newTodo]);
      setTodo('');
    }
  };

  const handleCheckboxChange = (index) => {
    const updatedTodoList = [...todoList];
    updatedTodoList[index].completed = !updatedTodoList[index].completed;
    setTodoList(updatedTodoList);

    if (allCompleted && updatedTodoList.some((todo) => !todo.completed)) {
        setAllCompleted(false);
    }

    if (!allCompleted && updatedTodoList.every((todo) => todo.completed)) {
        setAllCompleted(true);
    }
};

const handleDeleteClick = (index) => {
    const updatedTodoList = [...todoList];
    updatedTodoList.splice(index, 1);
    setTodoList(updatedTodoList);
};

  const handleDeleteModal = (index) => {
    setSelectedIndex(index);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalConfirm = () => {
    handleDeleteClick(selectedIndex);
    setShowModal(false);
  };

  //MARK ALL AS DONE
  const toggleAllCompleted = () => {
    const areAllCompleted = filteredTodoList.every(todo => todo.completed);
    const updatedTodoList = filteredTodoList.map(todo => ({ ...todo, completed: !areAllCompleted }));
    setTodoList(prevTodoList => {
        const filteredOut = prevTodoList.filter(todo => todo.listId !== listId);
        return [...filteredOut, ...updatedTodoList];
    });
    setAllCompleted(!areAllCompleted);
};


  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showModal, setShowModal] = useState(false);

  //DELETE ALL MODAL & FUNCTION
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

  const handleDeleteAll = () => {
    const updatedTodoList = todoList.filter(todo => todo.listId !== listId);
    setTodoList(updatedTodoList);
    setShowDeleteAllModal(false);
};


  const handleDeleteAllModalClose = () => {
    setShowDeleteAllModal(false);
  };

  const handleDeleteAllModalConfirm = () => {
    handleDeleteAll();
    setShowDeleteAllModal(false);
  };

  //DISABLE BUTTON WHEN ARRAY IS EMPTY
  const handleAllDeleteDisabled = todoList.length === 0;

  //EDITING EACH ITEM
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingText, setEditingText] = useState('');

  const handleEditModal = (index) => {
    setEditingIndex(index);
    setEditingText(todoList[index].text);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
  };

  const handleEditModalConfirm = () => {
    if (editingText.trim() !== '') {
      const updatedTodoList = [...todoList];
      updatedTodoList[editingIndex] = {
        ...updatedTodoList[editingIndex],
        text: editingText
      };
      setTodoList(updatedTodoList);
      setShowEditModal(false);
    }
  };

  const [showEditModal, setShowEditModal] = useState(false);

  const sortedTodoList = filteredTodoList.sort((a, b) => {
    if (a.completed && !b.completed) {
        return 1;
    }
    if (!a.completed && b.completed) {
        return -1;
    }
    return 0;
});


  return (
    <div className="AddTodo d-flex flex-column flex-grow-1 pt-2">
      <div className="btnCon d-flex flex-row justify-content-end">
        <button type="button" className="btn btn-secondary align-items-center text-center mt-3 me-1 ${handleAllDeleteDisabled ? 'disabled' : ''}" onClick={toggleAllCompleted} disabled={handleAllDeleteDisabled}>
          {allCompleted ? 'Mark all as undone' : 'Mark all as done'}
        </button>
        <button type="button" className="btn btn-secondary align-items-center text-center mt-3 ${handleAllDeleteDisabled ? 'disabled' : ''}" onClick={() => setShowDeleteAllModal(true)} disabled={handleAllDeleteDisabled}>
          Delete all
        </button>
      </div>
      <div className="pt-2 d-flex justify-content-center">
        <input
          type="text"
          className="formInput"
          placeholder="Add to do... "
          value={todo}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
      </div>

      <div className="todo-list d-flex flex-column align-items-center pt-3">
      {sortedTodoList.map((todoItem) => (
                    <div key={todoItem.id} className="formInput d-flex flex-row justify-content-between align-items-center mb-2">
                        <div className="d-flex flex-row align-items-center">
                            <input
                                type="checkbox"
                                className="checkBox me-2"
                                checked={todoItem.completed}
                                onChange={() => handleCheckboxChange(todoList.indexOf(todoItem))}
                            />
                            <div className={`d-flex flex-column ${todoItem.completed ? 'completed' : ''}`}>
                                <p className="pt-1">{todoItem.text}</p>
                                <p className="dateCreated">{todoItem.dateTimeCreated}</p>
                            </div>
                        </div>
                        <div className="iconGroup d-flex">
                            <FontAwesomeIcon icon={faPenToSquare} className="icon me-2" onClick={() => handleEditModal(todoList.indexOf(todoItem))}/>
                            <FontAwesomeIcon icon={faTrashCan} className="icon" onClick={() => handleDeleteModal(todoList.indexOf(todoItem))} />
                        </div>
                    </div>
                ))}
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this todo?</p>
            <div className='d-flex flex-row justify-content-end'>     
                <button className="btnOutline btn btn-outline-secondary me-1" onClick={handleModalClose}>
                Cancel
               </button>
                <button className="btn btn-secondary" onClick={handleModalConfirm}>
                Delete
                </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteAllModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete all todos?</p>
            <div className='d-flex flex-row justify-content-end'>     
                <button className="btnOutline btn btn-outline-secondary me-1" onClick={handleDeleteAllModalClose}>
                Cancel
               </button>
                <button className="btn btn-secondary" onClick={handleDeleteAllModalConfirm}>
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
              className="formInput w-100"
              placeholder="Edit todo..."
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
            />
            <div className='d-flex flex-row justify-content-end pt-2'>     
                <button className="btnOutline btn btn-outline-secondary me-1" onClick={handleEditModalClose}>
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

export default AddTodo;