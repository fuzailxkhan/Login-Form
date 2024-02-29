import "./Alert.css"

interface alertProps{
    alertData:string;
}


const Alert = ({alertData}:alertProps) => {
  return (
    <>
       <div className={`alert alert-dark ${alertData.length==0?"isNotVisible":"isVisible"}`}  role="alert">
            {alertData}
        </div>     
    </>
  )
}

export default Alert