
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
import AboutPage from "./pages/AboutPage";
import FeaturesPage from "./pages/FeaturesPage";
import PricingPage from "./pages/PricingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import MessagesPage from "./pages/MessagesPage";
import NotFoundPage from "./pages/NotFoundPage";
import DigitalAssetVaultPage from "./pages/DigitalAssetVaultPage";
import TrustedContactsPage from "./pages/TrustedContactsPage";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import ContactPage from "./pages/ContactPage";

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
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
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
                path="/about" 
                element={
                  <MotionLayout>
                    <AboutPage />
                  </MotionLayout>
                } 
              />
              <Route 
                path="/features" 
                element={
                  <MotionLayout>
                    <FeaturesPage />
                  </MotionLayout>
                } 
              />
              <Route 
                path="/pricing" 
                element={
                  <MotionLayout>
                    <PricingPage />
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
              <Route 
                path="/digital-assets" 
                element={
                  <ProtectedRoute>
                    <MotionLayout>
                      <DigitalAssetVaultPage />
                    </MotionLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/trusted-contacts" 
                element={
                  <ProtectedRoute>
                    <MotionLayout>
                      <TrustedContactsPage />
                    </MotionLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <MotionLayout>
                      <AccountSettingsPage />
                    </MotionLayout>
                  </ProtectedRoute>
                } 
              />
              {/* New pages */}
              <Route 
                path="/privacy" 
                element={
                  <MotionLayout>
                    <PrivacyPolicyPage />
                  </MotionLayout>
                } 
              />
              <Route 
                path="/terms" 
                element={
                  <MotionLayout>
                    <TermsPage />
                  </MotionLayout>
                } 
              />
              <Route 
                path="/contact" 
                element={
                  <MotionLayout>
                    <ContactPage />
                  </MotionLayout>
                } 
              />
              {/* Additional routes */}
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
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
