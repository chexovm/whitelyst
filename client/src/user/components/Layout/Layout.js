import "./Layout.css";
import MyMenu from "../MyMenu/MyMenu.js";

function Layout({ children }) {
  return (
    <>
      <header>
        <MyMenu />
      </header>
      <section className="layout-wrapper">{children}</section>
    </>
  );
}

export default Layout;
