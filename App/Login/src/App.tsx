import { useEffect, useState } from "react"
import "./App.css"
import Navbar from "./components/Navbar"
import { FieldValues } from "react-hook-form"
import axios from "axios"
import SignUpModal from "./components/SignUpModal"
import LoginModal from "./components/LoginModal"
import Alert from "./components/Alert"
const App = () => {

    const [createAccData,setCreateAccData] = useState<FieldValues>()
    const [sendCreateAcc,setSendCreateAcc]=useState(false);
    const [loginData,setLoginData] = useState<FieldValues>();
    const [sendLogin,setSendLogin] = useState(false);
    const [role,setRole] = useState("Guest");
    const [alertData,setAlertData] = useState("");
    const [serverResponse,setServerResponse] = useState("");

    const timeoutFunction = () =>{
      setTimeout(()=>{
        setAlertData('');
      },2000)
    }

    useEffect(()=>{
      const controller = new AbortController();

      axios.get('http://localhost:3000/profile', {signal:controller.signal,withCredentials: true})
      .then(res=>{console.log(res);setRole(res.data.role)});

    },[])

    useEffect(()=>{
      const controller = new AbortController();
      if(sendCreateAcc){
        axios.post("http://localhost:3000/createAccount",createAccData,{signal:controller.signal})
        .then(res=>{console.log(res);setAlertData(res.data.Message);timeoutFunction();})
        .catch(err=>console.log(err))
        .finally(()=>{setSendCreateAcc(false);})
        console.log(createAccData)
      }
      return ()=>controller.abort();
    },[sendCreateAcc])

    useEffect(()=>{
      const controller = new AbortController();

      if(sendLogin){
        axios.post("http://localhost:3000/loginAccount",loginData,{signal:controller.signal,withCredentials: true})
        .then(res=>{console.log(res);setAlertData(res.data.Message);timeoutFunction();setRole(res.data.role);if(res.data.Message==="Incorrect Password"){setServerResponse(res.data.Message);setRole("Guest")}})
        .catch(err=>console.log(err))
        .finally(()=>{setSendLogin(false);})
        console.log(loginData)
      }

      
      return ()=>controller.abort();
    },[loginData])

    const handleButton = async () =>{
      
      await axios.post("http://localhost:3000/addProduct",{},{withCredentials: true})
      .then((res)=>{setAlertData(res.data.Message);timeoutFunction()})
      .catch(err=>{if(err.response){console.log("You need to login first")}})
      .finally()
      
    }

    const handleLogout = async () => {
      try {
        await axios.post('http://localhost:3000/logout',{},{withCredentials: true});
        setRole('Guest');
        setAlertData('');
      } catch (err) {
        console.error('Logout failed:', err);
      }
    };

    
  return (
    <>
      <Alert alertData={alertData}/>
      <Navbar role={role} handleLogout={handleLogout} serverResponse={serverResponse}/>
      <div className="background-div">
        <div className="main-div">
          <SignUpModal onCreateAccount={(data)=>{setCreateAccData(data);setSendCreateAcc(true);}} />
          <LoginModal onLogin={(data)=>{setLoginData(data);setSendLogin(true);}} serverResponse={serverResponse}/> 
          <button className="btn btn-primary" onClick={handleButton} >Add Product</button>
          <button className="btn btn-primary" onClick={()=>{setAlertData("Hello");timeoutFunction();}}>Show Alert</button>
        </div>
      </div>
    </>
  )
}

export default App