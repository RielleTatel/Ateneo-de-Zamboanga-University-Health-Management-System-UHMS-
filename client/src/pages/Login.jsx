const Login = () => {
    return (
      <div className="flex flex-row bg-background-primary w-screen min-h-screen"> 
  
        {/* LEFT SIDE */}
        <div className="w-1/2 bg-blue-300"></div> 
  
        {/* RIGHT SIDE */}
        <div className="w-1/2 flex flex-col items-center justify-start ">
          <div className="flex flex-col items-center w-full py-4 rounded">
            <p className="text-black font-semibold m-6 text-[21px]"> ADZU HEALTH MANAGEMENT SYSTEM </p> 
            <hr className="w-full border-black border-1"/> 
          </div> 

          <div> 
            <div className="flex flex-col"> 
                <p className="text-[24px]"> Sign in </p>
                <p className="text-[24px]"> You must sign in first to  </p>
            </div>
          </div>
        </div> 

      </div>
    )
  }
  export default Login;
  