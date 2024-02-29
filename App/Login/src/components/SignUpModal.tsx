
import { FieldValues } from "react-hook-form";
import SignUpForm from "./SignUpForm"


interface SignUpModalProps{
    onCreateAccount:(data:FieldValues)=>void
}

const SignUpModal = ({onCreateAccount}:SignUpModalProps) => {

    


  return (
        <>
            <div className="modal fade" id="signUpModal" data-bs-backdrop="static" tabIndex={-1} aria-labelledby="signUpModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5 " id="signUpModalLabel">Sign Up</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <SignUpForm onCreateAccount={onCreateAccount} />
                </div>
                
                </div>
            </div>
            </div>
        </>
  )
}

export default SignUpModal