import React from "react";
import { Container, Navbar } from "react-bootstrap";
import Todo from "./components/Todo";

const App: React.FC = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand className="mx-5">Todo App</Navbar.Brand>
      </Navbar>
      <Container>
        <Todo />
      </Container>
    </>
  );
}

export default App;
