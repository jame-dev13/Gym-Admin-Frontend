import { Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeBtn } from "@/components/buttons/Buttons";
import { Navbar } from "@/components/navbar/Navbar";

export const AdministrationNavbar = () => (
  <Navbar
    aria-label="Administration"
    position="static"
    brand={
      <Link
        to="/administration"
        className="inline-flex items-center gap-2 text-text-primary transition-colors hover:text-accent"
      >
        <Dumbbell size={22} aria-hidden="true" className="text-accent" />
        <span className="text-lg font-bold tracking-tight">
          Gym Admin · Administration
        </span>
      </Link>
    }
    links={[]}
    actions={<ThemeBtn />}
  />
);
