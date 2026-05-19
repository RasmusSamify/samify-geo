import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type Role = "konsult" | "vd" | "owner";

export type RoleProfile = {
  id: Role;
  name: string;
  initials: string;
  title: string;
  department: string;
  email: string;
  // Vilka routes denna roll får se
  allowedRoutes: string[];
};

export const ROLES: Record<Role, RoleProfile> = {
  konsult: {
    id: "konsult",
    name: "Anna Lindqvist",
    initials: "AL",
    title: "Senior miljötekniker",
    department: "Geosyntec · Stockholm",
    email: "anna.lindqvist@geosyntec.com",
    allowedRoutes: [
      "/",
      "/dashboard",
      "/projects",
      "/knowledge",
      "/templates",
      "/integrations",
      "/roadmap",
    ],
  },
  vd: {
    id: "vd",
    name: "Gustav Holmberg",
    initials: "GH",
    title: "VD",
    department: "Geosyntec Sweden",
    email: "gustav.holmberg@geosyntec.com",
    allowedRoutes: [
      "/",
      "/dashboard",
      "/projects",
      "/knowledge",
      "/templates",
      "/integrations",
      "/roadmap",
      "/billing",
    ],
  },
  owner: {
    id: "owner",
    name: "Rasmus Karlsson",
    initials: "RK",
    title: "Samify Owner",
    department: "Samify · Leverantör",
    email: "rasmus@samify.se",
    allowedRoutes: [
      "/",
      "/dashboard",
      "/projects",
      "/knowledge",
      "/templates",
      "/integrations",
      "/roadmap",
      "/billing",
    ],
  },
};

type RoleContextValue = {
  role: Role;
  setRole: (r: Role) => void;
  profile: RoleProfile;
  canAccess: (route: string) => boolean;
};

const RoleContext = createContext<RoleContextValue | null>(null);

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside RoleProvider");
  return ctx;
};

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>("konsult");
  const profile = ROLES[role];

  const canAccess = (route: string) => profile.allowedRoutes.includes(route);

  return (
    <RoleContext.Provider value={{ role, setRole, profile, canAccess }}>
      {children}
    </RoleContext.Provider>
  );
};
