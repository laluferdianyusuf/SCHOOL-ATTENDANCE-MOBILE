import { Category, MenuItemProps } from "@/types/types";

export const MenuItem: MenuItemProps[] = [
  {
    id: "history",
    label: "Activity History",
    icon: "chevron-forward-sharp",
    route: "/(screens)/activity",
  },
  {
    id: "help",
    label: "Help & Support",
    icon: "chevron-forward-sharp",
    route: "/(screens)/help",
  },
  {
    id: "about",
    label: "About Us",
    icon: "chevron-forward-sharp",
    route: "/(screens)/about",
  },
];

export const AccountMenu: MenuItemProps[] = [
  {
    id: "change",
    label: "Change Password",
    icon: "chevron-forward-sharp",
    route: "/(screens)/change",
  },
];
