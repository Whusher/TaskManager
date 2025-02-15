import AsideMenu from "./AsideMenu";
//Implemet TOAST CONTAINER
import { ToastContainer } from "react-toastify";

export default function DashboardLayout({child}) {
  return (
    <div className="grid grid-cols-10 h-screen">
      {/* Aside (barra lateral) */}
      <AsideMenu/>
      {/* Contenido principal */}
      <main className="col-span-8 bg overflow-y-scroll">
        {child}
      </main>
      <ToastContainer/>
    </div>
  );
}