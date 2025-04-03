import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  return (
    <div className="flex items-center">
      <SunIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      <Switch
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
        className="mx-2"
        id="theme-toggle"
      />
      <MoonIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
    </div>
  );
}
