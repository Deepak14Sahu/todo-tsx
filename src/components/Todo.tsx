import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Button, CloseButton, ListGroup } from "react-bootstrap";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

interface TodoFormat {
  id: number | null;
  title: string;
  description: string;
}


const baseURL: string = 'http://127.0.0.1:8000/api/todo/';

const Todo: React.FC = () => {

  // Initial form data
  const initialFormData: TodoFormat = {
    id: null,
    title: "",
    description: "",
  };
  // State variable
  const [formInputData, setFormInputData] = useState<TodoFormat>(initialFormData);

  // state for handle fetched todos
  const [todos, setTodos] = useState<TodoFormat[]>([]);

  // Fetch todos from API
  const fetchTodos = (): void => {
    fetch(baseURL)
      .then(res => {
        if (!res.ok) {
          throw new Error("Unable to fetch data!! refresh");
        }
        return res.json();
      })
      .then((json: TodoFormat[]) => {
        setTodos(json);
      })
      .catch(() => toast.error("Some error occured."));

  }

  // Add a new todo
  const addNewTodo = (): void => {
    try {
      fetch(baseURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formInputData)
      })
        .then(res => {
          if (res.ok) {
            fetchTodos();
            setFormInputData(initialFormData);  // clean form data
            toast.success("Todo added successfully");
          }
        })
    } catch (error) {
      toast.error('Failed to add todo');
    }
  }

  // Update an existing todo
  const updateTodo = (): void => {
    try {
      fetch(`${baseURL}${formInputData.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formInputData)
      })
        .then(res => {
          if (res.ok) {
            fetchTodos();
            setFormInputData(initialFormData);  // clean form data
            toast.info("Todo updated successfully");
          }
        })
    } catch (error) {
      toast.error('Failed to update todo');
    }
  }

  // Delete a todo
  const handleDelete = (id: number | null): void => {
    try {
      fetch(`${baseURL}${id}/`, { method: "DELETE" })
        .then(res => {
          if (res.ok) {
            fetchTodos();
            toast.info("Todo removed.");
          }
        })
    } catch (error) {
      toast.error('Failed to delete todo');
    }
  }

  // Handle editing a todo
  const handleEdit = (todo: TodoFormat): void => setFormInputData(todo)

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormInputData({ ...formInputData, [name]: value });
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    formInputData.id ? updateTodo() : addNewTodo()
  };

  // Fetch todos on initial render
  useEffect(() => fetchTodos(), []);

  // Render todo component
  return (
    <>
      {/* Todo form  */}
      <Form className="my-3 " onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            name="title"
            value={formInputData.title}
            onChange={handleChange}
            type="text"
            placeholder="Enter the title"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            name="description"
            placeholder=" Enter the description"
            value={formInputData.description}
            onChange={handleChange}
            as="textarea"
            rows={3}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          {formInputData.id ? "Update" : "Add"}
        </Button>
      </Form>

      {/* Todo List showing */}

      <h1>Todos</h1>
      {todos.length > 0 ? (
        <ListGroup>
          {todos.map((todo: TodoFormat) => (
            <ListGroup.Item
              key={todo.id}
              as="li"
              className="d-flex justify-content-between align-items-start"
            >
              <div className="ms-2 me-auto">
                <div className="fw-bold">{todo.title}</div>
                {todo.description}
              </div>
              <div className="align-self-center">
                <Button
                  className="mx-2"
                  onClick={() => handleEdit(todo)}
                >
                  Edit
                </Button>
                <CloseButton onClick={() => handleDelete(todo.id)} />
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <div>No todos available</div>
      )}
      <ToastContainer position="top-center"
        autoClose={2000}
        hideProgressBar={true} />
    </>
  )
}


export default Todo;