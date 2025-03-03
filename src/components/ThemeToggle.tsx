import React from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb, LightbulbOff } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="rounded-full w-9 h-9 transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {theme === "dark" ? (
        <Lightbulb className="h-5 w-5 text-amber-400" />
      ) : (
        <LightbulbOff className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
