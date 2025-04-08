
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import MessagesPage from "./pages/MessagesPage";
import NotFoundPage from "./pages/NotFoundPage";

const queryClient = new QueryClient();

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.3,
};

const MotionLayout = ({ children }: { children: React.ReactNode }) => (
  <AnimatePresence mode="wait">
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route 
                path="/" 
                element={
                  <MotionLayout>
                    <HomePage />
                  </MotionLayout>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <MotionLayout>
                    <LoginPage />
                  </MotionLayout>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <MotionLayout>
                    <RegisterPage />
                  </MotionLayout>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <MotionLayout>
                      <DashboardPage />
                    </MotionLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/messages" 
                element={
                  <ProtectedRoute>
                    <MotionLayout>
                      <MessagesPage />
                    </MotionLayout>
                  </ProtectedRoute>
                } 
              />
              {/* Additional protected routes */}
              <Route 
                path="/trusted-contacts" 
                element={
                  <ProtectedRoute>
                    <MotionLayout>
                      <NotFoundPage />
                    </MotionLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/crypto-vault" 
                element={
                  <ProtectedRoute>
                    <MotionLayout>
                      <NotFoundPage />
                    </MotionLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/messages/new" 
                element={
                  <ProtectedRoute>
                    <MotionLayout>
                      <NotFoundPage />
                    </MotionLayout>
                  </ProtectedRoute>
                } 
              />
              {/* Not found route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
