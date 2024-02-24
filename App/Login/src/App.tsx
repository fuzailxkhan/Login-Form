import { useEffect, useState } from "react"
import "./App.css"
import Navbar from "./components/Navbar"
import { FieldValues } from "react-hook-form"
import axios from "axios"
import SignUpModal from "./components/SignUpModal"
import LoginModal from "./components/LoginModal"
import { jwtDecode } from "jwt-decode"

const App = () => {

    const [createAccData,setCreateAccData] = useState<FieldValues>()
    const [sendCreateAcc,setSendCreateAcc]=useState(false);
    const [serverResponse,setServerResponse] = useState("");
    const [loginData,setLoginData] = useState<FieldValues>();
    const [sendLogin,setSendLogin] = useState(false);
    const [role,setRole] = useState("");

    useEffect(()=>{
      const controller = new AbortController();

      if(sendCreateAcc){
        axios.post("http://localhost:3000/createAccount",createAccData,{signal:controller.signal})
        .then(res=>{console.log(res);setServerResponse(res.data.Message);})
        .catch(err=>console.log(err))
        .finally(()=>{setSendCreateAcc(false);})
        console.log(createAccData)
      }

      
      
      return ()=>controller.abort();
    },[sendCreateAcc])

    useEffect(()=>{
      const controller = new AbortController();

      if(sendLogin){
        axios.post("http://localhost:3000/loginAccount",loginData,{signal:controller.signal})
        .then(res=>{console.log(res);setServerResponse(res.data.Message);const token = jwtDecode<{uid:string,role:string}>(res.data.token) ;setRole(token.role)})
        .catch(err=>console.log(err))
        .finally(()=>{setSendLogin(false);})
        console.log(loginData)
      }

      
      return ()=>controller.abort();
    },[loginData])

    const handleButton = () =>{
      axios.post("http://localhost:3000/addProduct")
      
    }

    
  return (
    <>
      <Navbar role={role}/>
      <div className="background-div">
        <div className="main-div">
          <SignUpModal onCreateAccount={(data)=>{setCreateAccData(data);setSendCreateAcc(true);}} serverResponse={serverResponse}/>
          <LoginModal onLogin={(data)=>{setLoginData(data);setSendLogin(true);}} serverResponse={serverResponse}/> 
          <button onClick={handleButton} />
        </div>
      </div>
    </>
  )
}

export default App