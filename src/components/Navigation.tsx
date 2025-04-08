
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, KeyRound, MessageSquare, Settings, Users, Menu, Clock, Lock } from 'lucide-react';

interface NavigationProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, onLogin, onLogout }) => {
  return (
    <nav className="w-full px-4 py-3 flex items-center justify-between border-b border-border">
      <div className="flex items-center space-x-2">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full legacy-gradient flex items-center justify-center">
            <Lock className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-xl">Final Thread</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-8">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          Home
        </Link>
        <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
          About
        </Link>
        <Link to="/features" className="text-muted-foreground hover:text-foreground transition-colors">
          Features
        </Link>
        <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
          Pricing
        </Link>
      </div>

      <div className="flex items-center space-x-4">
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
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center cursor-pointer">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/messages" className="flex items-center cursor-pointer">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Messages</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/trusted-contacts" className="flex items-center cursor-pointer">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Trusted Contacts</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/crypto-vault" className="flex items-center cursor-pointer">
                    <KeyRound className="mr-2 h-4 w-4" />
                    <span>Crypto Vault</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
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
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/">Home</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/about">About</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/features">Features</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/pricing">Pricing</Link>
            </DropdownMenuItem>
            {!user && (
              <DropdownMenuItem asChild>
                <Link to="/register">Register</Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navigation;
