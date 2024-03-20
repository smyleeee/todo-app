import React, { useEffect, useState } from 'react';
import AddNew from './AddNew';
import Card from 'react-bootstrap/Card';
import { NavLink } from 'react-router-dom';

function Home() {
  const [submenuData, setSubmenuData] = useState(() => {
    const storedData = localStorage.getItem('submenuData');
    return storedData ? JSON.parse(storedData) : [];
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedData = localStorage.getItem('submenuData');
      if (storedData) {
        setSubmenuData(JSON.parse(storedData));
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const renderCards = () => {
    const todoList = JSON.parse(localStorage.getItem('todoList')) || [];
    
    return (
        <div className="d-flex flex-wrap justify-content-start p-3 ms-5">
            {submenuData.map((item, index) => {
                // Convert item.id to string for comparison
                const itemTodos = todoList.filter(todo => todo.listId.toString() === item.id.toString());
                
                return (
                    <div key={index} className=" m-1">
                        {item && (
                            <NavLink to={`/list/${item.id}`} className={"text-decoration-none"}>
                                <Card className='Cards'>
                                    <Card.Body>
                                        <Card.Title>{item.name}</Card.Title>
                                        <Card.Text>
                                            {itemTodos.map((todo, id) => (
                                                <p key={id}>{todo.text}</p>
                                            ))}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </NavLink>
                        )}
                    </div>
                );
            })}
        </div>
    );
};



  return (
    <div>
      {submenuData.length === 0 && <AddNew btnName={"New List"} />}
      
        {renderCards()}
      
    </div>
  );
}

export default Home;