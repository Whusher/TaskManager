import React from 'react'
import { useNavigate } from "react-router";
import { Link } from 'react-router-dom';

export default function AsideMenu() {
  const handleLogout = ()=>{
    navigate('/')
  }

  const navigate = useNavigate();
  return (
    <aside className="col-span-2 bg-sky-800 p-5 max-w-[300px] flex flex-col sticky top-0 h-screen overflow-y-auto">
        <h3
          id="dsh-title"
          className="text-white text-center font-semibold text-3xl"
        >
          Dashboard
        </h3>
          <ul className="p-3 my-2 font-semibold text-white space-y-6">
            <Link to={'/dashboard'} className="cursor-pointer hover:shadow-white hover:shadow-contrast/70 shadow-md rounded-sm px-3 py-1 transition-all hover:scale-105 duration-300 ease-linear flex justify-between">
              Home
            </Link>
            <Link to={"/tasks"} className="cursor-pointer hover:shadow-white hover:shadow-contrast/70 shadow-md rounded-sm px-3 py-1 transition-all hover:scale-105 duration-300 ease-linear flex justify-between">
              Tasks
            </Link>
            <Link to={'/dayli'} className="cursor-pointer hover:shadow-white hover:shadow-contrast/70 shadow-md rounded-sm px-3 py-1 transition-all hover:scale-105 duration-300 ease-linear flex justify-between">
              Dayli
            </Link>
            <Link to={'/updates'} className="cursor-pointer hover:shadow-white hover:shadow-contrast/70 shadow-md rounded-sm px-3 py-1 transition-all hover:scale-105 duration-300 ease-linear flex justify-between" >
              Updates
            </Link>
            <button
              className="text-red-600 text-lg cursor-pointer hover:shadow-red-600/70 shadow-md rounded-sm px-14 py-1 transition-all hover:scale-105 duration-300 ease-linear flex justify-evenly space-x-3 items-center"
              onClick={handleLogout}
            >
              <span>Logout</span>
            </button>

          </ul>
        <div className="min-h-max flex flex-col mt-auto mx-0">
          <span id="MES-advise" className="text-white font-light">
            Task Manager
          </span>
        </div>
      </aside>
  )
}