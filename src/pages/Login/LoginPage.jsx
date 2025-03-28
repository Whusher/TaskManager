import Mountains from "../../assets/Glorious-blue-mountain-range.jpg"
import { useNavigate, Link } from "react-router"
import { useState,useEffect } from "react"
import { loginUser } from "../../services/authService"
import { useAuth } from "./../../context/AuthContext";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // Estado para alternar la visibilidad

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  useEffect(()=>{
      localStorage.clear()
    },[])

  const handleSubmit = async(e) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address")
      return
    }
    try {
      const data = await loginUser(email, password);
      if(data){
        await login(data,data.token)
        
        if(localStorage.getItem("admin")){
          toast.success("Welcome again Admin")
          navigate("/users");
        }else{
          // Redirigir al usuario a la página de inicio o a un endpoint protegido
          toast.success(`Welcome ${email}`)
          navigate("/dashboard");
        }
      }else {
        const error = "Password/Email incorrect";
        setError(error);  // Mostrar el error en la interfaz
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setError("An error occurred while trying to log in");
    }
  
  }

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  return (
      
<div className="absolute top-0 bg-sky-200 left-0 w-full h-screen flex items-center bg-cover bg-center" style={{ backgroundImage: `url(${Mountains})` }}>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-4xl font-extrabold text-light mb-2">Task Manager</h1>
        <h2 className="text-center text-green-200 text-2xl font-bold text-light">Your Help for Everything</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-light">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  // required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-secondary text-light"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-light">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"} // Cambiar tipo según showPassword
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-secondary text-light"
                />
                {/* Icono o botón para mostrar/ocultar contraseña */}
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>
            <div>
              <Link to={"/register"} className="text-blue-500 font-light underline">Sign Up</Link>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex cursor-pointer justify-center py-2 px-4 border border-transparent font-semibold rounded-md shadow-sm text-sm text-secondary bg-gradient-to-br from-sky-700/80 via-45% to-sky-400 hover:bg-gradient-to-bl delay-50 hover:translate-y-2 hover:text-xl text-white hover:font-semibold transition-all focus:ring-2 focus:ring-offset-2 focus:ring-sky-400"
              >
                Log in
              </button>
            </div>
          </form>
        </div>
          {error && (
            <div className="mt-4 p-5 text-white font-semibold text-sm bg-amber-900 border border-orange-400 rounded-md">
              {error} !
            </div>
          )}                 
      </div>
    </div>
  )
}

