import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import * as io from "socket.io-client";
import { useHistory } from "react-router-dom";
var socket;


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function LoginPage() {
  const history = useHistory();
  const classes = useStyles();
  const [state, setState] = useState({ username: "", password: "" });
  const [error, setError] = useState('');

  // socket io:
  useEffect(() => {
    socket = io("http://localhost:5000");
    return () => socket.disconnect()
  }, []);

  useEffect(() => {
    socket.on("login_response", (reply) => {
      if (reply.success === "true") {
        history.push("/UpdateProgram");
      } else {
        setError(reply.message);
      }
    });
    return () => {
      socket.off("login_response")
    }
  }, []);


  const onSubmitFunc = (e) => {
    e.preventDefault();
    const { username, password } = state;
    socket.emit("login_attempt", {
      username: username,
      password: password.toString(),
    });
  };

  const onInputChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <h1>
          Log in
        </h1>
        <br />
        <img src="netafim-logo.png" alt="logo" height="70"></img>
        <form onSubmit={onSubmitFunc} className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="User Name"
            name="username"
            autoComplete="email"
            autoFocus
            onChange={(e) => onInputChange(e)}
            value={state.username}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => onInputChange(e)}
            value={state.password}
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            onClick={onSubmitFunc}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}>
            Log In
          </Button>
        </form>
        <p>{error}</p>
      </div>
    </Container>
  );
}
