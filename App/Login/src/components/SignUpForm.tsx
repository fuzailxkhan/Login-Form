import { FieldValues, useForm } from "react-hook-form"
import "../App.css"

interface signUpFormProps{
    onCreateAccount:(data:FieldValues)=>void
}


const SignUpForm = ({onCreateAccount}:signUpFormProps) => {

    const {register,handleSubmit,formState:{errors}} = useForm();

  return (
    <div>
        <form onSubmit={handleSubmit((data)=>{onCreateAccount(data)})} >
          <h1>Create Account</h1>
          <div className="mb-3 input-div">
            <label className="form-label">Email</label>
            <input {...register("email", {required:{value:true,message:"Please enter your email."},pattern: {value: /\S+@\S+\.\S+/,message: "Enter a valid email."}})} className="form-control"  id="email"/>
            {errors.email&&<span >{errors.email.message?.toString()}</span>}
          </div>
          <div className="mb-3 input-div">
            <label className="form-label">Password</label>
            <input {...register("password",{required:true})} className="form-control" id="password"/>
            {errors.password&&<span > Please enter a password. </span>}
          </div>
               
          <div className="mb-3 button-div ">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" className="btn btn-primary ms-2" data-bs-dismiss="modal"> Create Account </button>
          </div>
        </form>
        
    </div>
  )
}

export default SignUpForm
