import { useState } from "react";
import styles from "./loginSignup.module.css";
import { useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LOG_IN_MUTATION, SIGN_UP_MUTATION } from "../../graphql/Mutation";
import type {
  LogInMutation,
  SignUpMutation,
} from "../../types/__generated__/graphql";
import { getCurUser_Query } from "../../graphql/Query";

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(false);
  const [loginInput, setLoginInput] = useState({
    password: "",
    email: "",
  });
  const [signupInput, setSignUpInput] = useState({
    firstname: "",
    lastname: "",
    password: "",
    email: "",
  });
  const navigate = useNavigate();

  const [singUpUserMutation] = useMutation<SignUpMutation>(SIGN_UP_MUTATION);

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpInput((prev) => ({ ...prev, [name]: value }));
  };
  const handleSignUpSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await singUpUserMutation({
        variables: {
          firstname: signupInput.firstname,
          lastname: signupInput.lastname,
          email: signupInput.email,
          password: signupInput.password,
        },
      });
      if (!response) {
        toast("Invalid credentials! ", {
          position: "top-right",
          type: "warning",
        });
        return;
      }

      console.log("response for signup data : ", response);

      if (response?.data?.signUp) {
        toast("Signup successfylly", {
          position: "top-right",
          type: "success",
        });
        setSignUpInput({
          firstname: "",
          lastname: "",
          password: "",
          email: "",
        });
        setIsLogin(false);
      }
    } catch (error) {
      const err = error as Error;
      if (err) {
        toast(err.message, {
          position: "top-right",
          type: "info",
        });
      }
      console.log("error in signupSubmit : ", error);
    }
  };

  const [logInuserMutation] = useMutation<LogInMutation>(LOG_IN_MUTATION, {
    refetchQueries: [
      {
        query: getCurUser_Query,
      },
    ],
  });

  const handleLogInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogInSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await logInuserMutation({
        variables: {
          email: loginInput.email,
          password: loginInput.password,
        },
      });
      console.log("response from login : ", response);
      if (!response?.data?.logIn) {
        toast("Invalid credentials! ", {
          position: "top-right",
          type: "warning",
        });
        return;
      }
      console.log("response is : ", response);

      if (response?.data?.logIn) {
        toast("Login successfully", {
          position: "top-right",
          type: "success",
        });
        navigate("/");
        setLoginInput({
          password: "",
          email: "",
        });
      }
    } catch (error) {
      toast("Invalid credenetials", {
        position: "top-right",
        type: "info",
      });
      console.log("error in logInSubmit : ", error);
    }
  };

  return (
    <>
      <div className={styles.bodyCon}>
        <div className={styles.container}>
          <div className={styles.signupCon}>
            <div className={styles.userBtn}>
              <button
                onClick={() => setIsLogin(false)}
                className={isLogin ? "" : styles.btncolor}
              >
                SignIn
              </button>
              <button
                onClick={() => setIsLogin(true)}
                className={isLogin ? styles.btncolor : ""}
              >
                SignUp
              </button>
            </div>
            <br />
            {isLogin ? (
              <form onSubmit={handleSignUpSubmit}>
                <div>
                  <label htmlFor="firstname">First Name</label>
                  <input
                    type="text"
                    name="firstname"
                    value={signupInput.firstname}
                    onChange={handleSignUpChange}
                  />
                </div>
                <div>
                  <label htmlFor="lastname">Last Name</label>
                  <input
                    type="text"
                    name="lastname"
                    value={signupInput.lastname}
                    onChange={handleSignUpChange}
                  />
                </div>
                <div>
                  <label htmlFor="email">Enter email</label>
                  <input
                    type="text"
                    name="email"
                    value={signupInput.email}
                    onChange={handleSignUpChange}
                  />
                </div>
                <div>
                  <label htmlFor="password">Password</label>
                  <input
                    type="text"
                    name="password"
                    value={signupInput.password}
                    onChange={handleSignUpChange}
                  />
                </div>
                <button type="submit" className={styles.submitbtn}>
                  Submit
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogInSubmit}>
                <div>
                  <label htmlFor="email">Enter email</label>
                  <input
                    type="text"
                    name="email"
                    value={loginInput.email}
                    onChange={handleLogInChange}
                  />
                </div>
                <div>
                  <label htmlFor="password">Password</label>
                  <input
                    type="text"
                    name="password"
                    value={loginInput.password}
                    onChange={handleLogInChange}
                  />
                </div>
                <button type="submit" className={styles.submitbtn}>
                  Submit
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
