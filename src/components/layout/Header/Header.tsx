"use client";

import { useLogout } from "@/feature/auth/hooks/useLogout";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function Header() {
  const { data: user } = useMe();
  const locale = useLocale();
  const isRtl = locale === "fa";
  const logoutMutation = useLogout();
  const router = useRouter();
  const queryClient = useQueryClient();
  const drawerAnchor = isRtl ? "right" : "left";
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations("Header");

  const handleOpenMenu = () => {
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };
  const handleNavigation = (path: string) => {
  handleCloseMenu();

  router.push(
    path
      ? `/${locale}/dashboard/student/${path}`
      : `/${locale}/dashboard/student`
  );
};
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.removeQueries({
          queryKey: ["me"],
        });

        toast.success(t("logoutSuccess"));

        router.replace(`/${locale}/login`);
      },

      onError: (error) => {
        console.error("Logout error:", error);

        toast.error(t("logoutError"));
      },
    });
  };
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
            <ListItemButton onClick={() => handleNavigation("")}>
              <ListItemIcon>
                <LayoutDashboard size={18} />
              </ListItemIcon>

              <ListItemText primary={t("dashboard")} />
            </ListItemButton>

            <ListItemButton onClick={() => handleNavigation("courses")}>
              <ListItemIcon>
                <BookOpen size={18} />
              </ListItemIcon>

              <ListItemText primary={t("myCourses")} />
            </ListItemButton>

            <ListItemButton onClick={() => handleNavigation("assignments")}>
              <ListItemIcon>
                <FileText size={18} />
              </ListItemIcon>

              <ListItemText primary={t("homework")} />
            </ListItemButton>

            <ListItemButton onClick={() => handleNavigation("payment")}>
              <ListItemIcon>
                <CreditCard size={18} />
              </ListItemIcon>

              <ListItemText primary={t("payment")} />
            </ListItemButton>

            <ListItemButton onClick={() => handleNavigation("profile")}>
              <ListItemIcon>
                <User size={18} />
              </ListItemIcon>

              <ListItemText primary={t("profile")} />
            </ListItemButton>

            <ListItemButton
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
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
