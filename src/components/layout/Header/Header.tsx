"use client";

import { useEffect, useState } from "react";
import {
  Menu,
  Layers,
  User,
  BookOpen,
  CreditCard,
  LayoutDashboard,
  FileText,
  LogOut,
} from "lucide-react";

import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import styles from "./Header.module.scss";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import { ThemeToggle } from "../theme-toggle/ThemeToggle";
import Button from "@/components/kit/Button/Button";
import { useMe } from "@/feature/auth/hooks/useMe";
import { useLocale, useTranslations } from "next-intl";

export function Header() {
  const { data: user, refetch } = useMe();
  const locale = useLocale();
  const isRtl = locale === "fa";
  const drawerAnchor = isRtl ? "right" : "left";
  const [menuOpen, setMenuOpen] = useState(false);
const t = useTranslations("Header");
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleOpenMenu = () => {
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };
  console.log("locale:", locale);
  console.log("drawerAnchor:", drawerAnchor);
  return (
    <>
      <div className={styles["header-wrapper"]}>
        <div className={styles["flex-item"]}>
          <Button
            type="button"
            variant="text"
            aria-label="Open menu"
            className={styles["icon-button"]}
            onClick={handleOpenMenu}
          >
            <Menu size={17} />
          </Button>

          <Button
            type="button"
            variant="contained"
            aria-label="Layers"
            className={styles["icon-button"]}
          >
            <Layers size={17} />
          </Button>
        </div>

        <div className={styles["flex-item"]}>
          <LanguageSwitcher />
          <ThemeToggle />

          <div className="text-black">
            {user?.first_name} {user?.last_name}
          </div>
        </div>
      </div>

      <Drawer anchor={drawerAnchor} open={menuOpen} onClose={handleCloseMenu}>
        <div className={styles["drawer"]}>
          <List className={styles["menu-list"]}>
            <ListItemButton onClick={handleCloseMenu}>
              <ListItemIcon>
                <LayoutDashboard size={18} />
              </ListItemIcon>

              <ListItemText primary={t("dashboard")} />
            </ListItemButton>

            <ListItemButton onClick={handleCloseMenu}>
              <ListItemIcon>
                <BookOpen size={18} />
              </ListItemIcon>

              <ListItemText primary={t("myCourses")} />
            </ListItemButton>

            <ListItemButton onClick={handleCloseMenu}>
              <ListItemIcon>
                <FileText size={18} />
              </ListItemIcon>

               <ListItemText primary={t("homework")} />
            </ListItemButton>

            <ListItemButton onClick={handleCloseMenu}>
              <ListItemIcon>
                <CreditCard size={18} />
              </ListItemIcon>

              <ListItemText primary={t("payment")} />
            </ListItemButton>

            <ListItemButton onClick={handleCloseMenu}>
              <ListItemIcon>
                <User size={18} />
              </ListItemIcon>

            <ListItemText primary={t("profile")} />
            </ListItemButton>

            <ListItemButton onClick={handleCloseMenu}
            className={styles.logout}>
              <ListItemIcon>
                <LogOut size={18} />
              </ListItemIcon>

              <ListItemText primary={t("logout")} />
            </ListItemButton>
          </List>
        </div>
      </Drawer>
    </>
  );
}
