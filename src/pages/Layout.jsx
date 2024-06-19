import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  return (
    <>
      <Header />
      <div className="px-4 mx-auto max-w-8xl sm:px-6 lg:px-8">
        <div className="lg:px-8">
        <Outlet />
        </div>
      </div>
    </>
  )
}

export default Layout