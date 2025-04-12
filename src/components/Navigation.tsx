
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, KeyRound, MessageSquare, Settings, Users, Menu, Clock, Lock, FileArchive } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NavigationProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
  onLogin: () => void;
  onLogout: () => void;
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
});
ListItem.displayName = "ListItem";

const Navigation: React.FC<NavigationProps> = ({ user, onLogin, onLogout }) => {
  const location = useLocation();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <motion.nav 
      className="w-full px-4 py-3 flex items-center justify-between border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="flex items-center space-x-2" variants={itemVariants}>
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full legacy-gradient flex items-center justify-center">
            <Lock className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-xl">Final Thread</span>
        </Link>
      </motion.div>

      <div className="hidden md:flex items-center">
        <NavigationMenu>
          <NavigationMenuList>
            <motion.div variants={itemVariants}>
              <NavigationMenuItem>
                <Link to="/">
                  <Button variant="ghost" className={location.pathname === '/' ? 'text-primary' : ''}>
                    Home
                  </Button>
                </Link>
              </NavigationMenuItem>
            </motion.div>

            <motion.div variants={itemVariants}>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <ListItem
                      href="/features"
                      title="Overview"
                    >
                      Explore all the powerful features Final Thread offers
                    </ListItem>
                    <ListItem
                      href="/features#messages"
                      title="Final Messages"
                    >
                      Create heartfelt messages to be delivered at the right time
                    </ListItem>
                    <ListItem
                      href="/features#digital-vault"
                      title="Digital Asset Vault"
                    >
                      Securely store your most important digital possessions
                    </ListItem>
                    <ListItem
                      href="/features#trusted-contacts"
                      title="Trusted Contacts"
                    >
                      Designate trusted individuals to handle your digital legacy
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </motion.div>

            <motion.div variants={itemVariants}>
              <NavigationMenuItem>
                <Link to="/pricing">
                  <Button variant="ghost" className={location.pathname === '/pricing' ? 'text-primary' : ''}>
                    Pricing
                  </Button>
                </Link>
              </NavigationMenuItem>
            </motion.div>

            <motion.div variants={itemVariants}>
              <NavigationMenuItem>
                <Link to="/about">
                  <Button variant="ghost" className={location.pathname === '/about' ? 'text-primary' : ''}>
                    About
                  </Button>
                </Link>
              </NavigationMenuItem>
            </motion.div>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <motion.div className="flex items-center space-x-4" variants={itemVariants}>
        {user ? (
          <>
            <Link to="/dashboard">
              <Button variant="outline" className="hidden md:flex">
                Dashboard
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name && user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Link to="/dashboard" className="flex items-center w-full">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Link to="/messages" className="flex items-center w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Messages</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Link to="/trusted-contacts" className="flex items-center w-full">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Trusted Contacts</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Link to="/digital-assets" className="flex items-center w-full">
                    <FileArchive className="mr-2 h-4 w-4" />
                    <span>Digital Assets</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Link to="/settings" className="flex items-center w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Button onClick={onLogin} variant="default">
              Sign In
            </Button>
            <Link to="/register">
              <Button variant="outline" className="hidden md:inline-flex">
                Register
              </Button>
            </Link>
          </>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger className="block md:hidden">
            <Menu className="h-6 w-6" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
              <Link to="/">Home</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
              <Link to="/features">Features</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
              <Link to="/pricing">Pricing</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
              <Link to="/about">About</Link>
            </DropdownMenuItem>
            {!user && (
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <Link to="/register">Register</Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    </motion.nav>
  );
};

export default Navigation;
