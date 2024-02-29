import { FieldValues } from "react-hook-form";
import LoginForm from "./LoginForm"


interface LoginModalProps{
    onLogin :(data:FieldValues)=>void;
    serverResponse:String;
}


const LoginModal = ({onLogin,serverResponse}:LoginModalProps) => {
  return (
    <>
            <div className="modal fade" id="loginModal" data-bs-backdrop="static" tabIndex={-1} aria-labelledby="loginModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5 " id="loginModalLabel">Login</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    {serverResponse?<p>{serverResponse}</p>:<LoginForm onLogin={onLogin} />}
                </div>
                
                </div>
            </div>
            </div>
        </>
  )
}

export default LoginModal