import { Toaster  } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import { AuthProvider } from "./context/auth-context";
import { router } from "./routes";

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster richColors closeButton className={{toast:'justify-between',closeButton: 'order-last'}} />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);


