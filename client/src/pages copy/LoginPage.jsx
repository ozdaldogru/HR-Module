import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import "../styles/LoginPage.css";

const LoginPage = () => {
  return (
    <div className="login-main d-flex justify-content-center align-items-center login-background">
      <div className="text-center col-md-4 card m-3 p-3 login-card">
        <h2 className="login-header">Please Login / Sign Up</h2>
        <hr />
        <LoginForm />
        <SignupForm />
      </div>
    </div>
  );
}

export default LoginPage;
