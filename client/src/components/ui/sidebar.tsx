import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import {
  HomeIcon,
  BriefcaseIcon,
  TrendingUpIcon,
  LayersIcon,
  GlobeIcon,
  ClipboardListIcon,
  PresentationIcon,
  FileTextIcon,
  UsersIcon,
  Settings,
  LogOut,
  ShieldIcon,
  AlertTriangleIcon,
  FolderIcon,
  CoinsIcon,
  NetworkIcon,
  BarChart3Icon,
  Users2Icon,
  HeartHandshakeIcon,
  BrainCircuitIcon
} from "lucide-react";
import { Button } from "./button";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    {
      title: "Main",
      items: [
        {
          icon: <HomeIcon className="mr-3 h-5 w-5" />,
          label: "Dashboard",
          href: "/",
        },
        {
          icon: <BriefcaseIcon className="mr-3 h-5 w-5" />,
          label: "Deal Flow",
          href: "/deal-flow",
        },
        {
          icon: <TrendingUpIcon className="mr-3 h-5 w-5" />,
          label: "Financial Analysis",
          href: "/financial-analysis",
        },
        {
          icon: <LayersIcon className="mr-3 h-5 w-5" />,
          label: "Portfolio Management",
          href: "/portfolio-management",
        },
        {
          icon: <GlobeIcon className="mr-3 h-5 w-5" />,
          label: "Market Intelligence",
          href: "/market-intelligence",
        },
        {
          icon: <AlertTriangleIcon className="mr-3 h-5 w-5" />,
          label: "Risk Assessment",
          href: "/risk",
        },
      ],
    },
    {
      title: "Web3 Investments",
      items: [
        {
          icon: <CoinsIcon className="mr-3 h-5 w-5" />,
          label: "Web3 Dashboard",
          href: "/web3-investments",
        },
        {
          icon: <NetworkIcon className="mr-3 h-5 w-5" />,
          label: "ICO Tracker",
          href: "/ico-tracker",
        },
        {
          icon: <BarChart3Icon className="mr-3 h-5 w-5" />,
          label: "Gas Tracker",
          href: "/gas-tracker",
        },
      ],
    },
    {
      title: "CRM",
      items: [
        {
          icon: <Users2Icon className="mr-3 h-5 w-5" />,
          label: "Lead Management",
          href: "/crm/leads",
        },
        {
          icon: <HeartHandshakeIcon className="mr-3 h-5 w-5" />,
          label: "Relationships",
          href: "/crm/relationships",
        },
      ],
    },
    {
      title: "Tools",
      items: [
        {
          icon: <FolderIcon className="mr-3 h-5 w-5" />,
          label: "Documents",
          href: "/documents",
        },
        {
          icon: <ShieldIcon className="mr-3 h-5 w-5" />,
          label: "Compliance",
          href: "/compliance",
        },
        {
          icon: <ClipboardListIcon className="mr-3 h-5 w-5" />,
          label: "Due Diligence",
          href: "/due-diligence",
        },
        {
          icon: <PresentationIcon className="mr-3 h-5 w-5" />,
          label: "Presentations",
          href: "/presentations",
        },
        {
          icon: <FileTextIcon className="mr-3 h-5 w-5" />,
          label: "Reports",
          href: "/reports",
        },
        {
          icon: <UsersIcon className="mr-3 h-5 w-5" />,
          label: "Team Management",
          href: "/team",
        },
      ],
    },
  ];

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 flex-shrink-0 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <svg className="h-8 w-8 text-primary-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"></path>
            <path fill="white" d="M8 11h8v2H8z"></path>
            <path fill="white" d="M12 7v10"></path>
          </svg>
          <span className="ml-2 text-lg font-semibold">VentureFlow</span>
        </div>
      </div>

      <div className="overflow-y-auto flex-grow">
        <nav className="py-4 px-2">
          {navItems.map((section, index) => (
            <div key={index} className="mb-6">
              <div className="px-2 mb-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {section.title}
              </div>
              {section.items.map((item, itemIndex) => (
                <Link key={itemIndex} href={item.href}>
                  <a
                    className={cn(
                      "flex items-center px-3 py-2 mb-1 text-sm font-medium rounded-md",
                      location === item.href
                        ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </a>
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user?.name || user?.username} 
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium">
                {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </span>
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{user?.name || user?.username}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role || "User"}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="ml-auto text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            aria-label="Log out"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
