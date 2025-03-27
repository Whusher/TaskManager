import { useNavigate,Link } from "react-router-dom"; // Asegúrate de importar 'react-router-dom'
import { useState } from "react";
import { registerUser } from "../../services/authService";
import Mountains from "../../assets/Glorious-blue-mountain-range.jpg";
import { toast } from "react-toastify";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // Nuevo estado para el username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para alternar la visibilidad

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !username || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      const res = await registerUser(email, username, password);
      if (res.success) {
        toast.success("Registration successful! You can now log in.");
        navigate("/login");
      } else {
        console.log("HEELLOO", res);
        toast.error(`Error: ${res.response.data.message}`);
      }
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  return (
    <div
      className="absolute top-0 bg-sky-200 left-0 w-full h-screen flex items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${Mountains})` }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-4xl font-extrabold text-light mb-2">
          Task Manager
        </h1>
        <h2 className="text-center text-green-200 text-2xl font-bold text-light">
          Your Help for Everything
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-light"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-secondary text-light"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-light"
              >
                Username
              </label>{" "}
              {/* Campo nuevo para username */}
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-secondary text-light"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-light"
              >
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

            <div className="flex flex-col items-center w-full">
  <Link 
    to={'/login'} 
    className="mb-4 text-center w-full text-md underline"
  >
    You already have an account? <span className="text-blue-600">Login</span>
  </Link>

  <button
    type="submit"
    className="w-full flex justify-center py-2 px-4 border border-transparent font-semibold rounded-md shadow-sm text-sm text-secondary bg-gradient-to-br from-sky-700/80 via-45% to-sky-400 hover:bg-gradient-to-bl delay-50 hover:translate-y-2 hover:text-xl text-white hover:font-semibold transition-all focus:ring-2 focus:ring-offset-2 focus:ring-sky-400"
    disabled={loading}
  >
    {loading ? "Registering..." : "Register"}
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
  );
}
