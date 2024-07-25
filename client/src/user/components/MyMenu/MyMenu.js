import { useState } from "react";
import "./MyMenu.css";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

function MyMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { text: "RULES", link: "/rules" },
    { text: "STORE", link: "https://technoscaperp.tebex.io/" },
    { text: "SOCIALS", link: "#" },
    { text: "DISCORD", link: "https://discord.gg/U63nnSua49" },
  ];

  return (
    <>
      {isMobile ? (
        <AppBar position="static">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <a href="/">
              <Avatar
                src="/media/d77.png"
                alt="Logo"
                sx={{ borderRadius: 0 }}
              />
            </a>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{
                ".MuiPaper-root": {
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
                  border: "1px solid white",
                  color: "white",
                  borderRadius: "0px",
                },
              }}
            >
              {menuItems.map((item, index) => (
                <MenuItem
                  onClick={handleClose}
                  component="a"
                  href={item.link}
                  key={index}
                >
                  {item.text}
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
        </AppBar>
      ) : (
        <nav className="header-top psticky">
          <a className="menu-logo" href="/">
            <img src="./media/TSLogo.png" alt="logo" />
          </a>
          <div className="menu">
            <ul className="menu-list">
              <li className="menu-item">
                <a href="/rules">RULES</a>
              </li>
              <li className="menu-item">
                <a href="https://technoscaperp.tebex.io/">STORE</a>
              </li>
              <li className="menu-item dropdown">
                <a href="#">SOCIALS</a>
                <div className="dropdown-content">
                  <a href="https://www.tiktok.com/@technoscaperp">TikTok</a>
                  <a href="https://www.youtube.com/@TechnoScapeRP">Youtube</a>
                  <a href="https://twitter.com/technoscaperp">X</a>
                </div>
              </li>
              <li className="menu-item menu-item-discord">
                <a href="https://discord.gg/U63nnSua49">DISCORD</a>
              </li>
            </ul>
          </div>
        </nav>
      )}
    </>
  );
}

export default MyMenu;
