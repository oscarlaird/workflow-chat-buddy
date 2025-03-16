
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { bumpPatchVersion } from "@/lib/version";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ConversationPage from "./pages/ConversationPage";
import WorkflowPage from "./pages/WorkflowPage";

const queryClient = new QueryClient();

const App = () => {
  // Bump the version when the app loads (this would typically be done on deployment)
  useEffect(() => {
    // In a real app, this would be handled differently
    // This is just for demonstration purposes
    bumpPatchVersion();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/conversation" element={<ConversationPage />} />
            <Route path="/conversation/:conversationId" element={<ConversationPage />} />
            <Route path="/workflow" element={<WorkflowPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
