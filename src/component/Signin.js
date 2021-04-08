// add useContext
import React, { useContext } from "react";
import { firebaseAuth } from "../provider/AuthProvider";
import styled from "styled-components";
import { Button, TextField } from "@material-ui/core";

const Signin = () => {
  const { handleSignin, inputs, setInputs, errors } = useContext(firebaseAuth);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignin();
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container onSubmit={handleSubmit}>
      {/* replace the div tags with a form tag */}
      {/* make inputs  */}
      <h2>D&D - Crvor's League Manager</h2>
      <StyledTextField
        id="standard-basic"
        name="email"
        onChange={handleChange}
        placeholder="email"
        value={inputs.email}
        label="email"
      />
      <StyledTextField
        onChange={handleChange}
        name="password"
        placeholder="password"
        label="password"
        value={inputs.password}
      />
      <Button type="submit">signin</Button>
      {errors.length > 0
        ? errors.map((error) => <p style={{ color: "red" }}>{error}</p>)
        : null}
    </Container>
  );
};

export default Signin;
const Container = styled.form`
  display: flex;
  flex-direction: column;
  width: 350px;
  margin: auto;
  margin-top: 10%;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 20px;
`;
