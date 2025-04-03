import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import { AppLayout } from "@/layouts/app-layout";
import Dashboard from "@/pages/dashboard";
import DealFlow from "@/pages/deal-flow";
import FinancialAnalysis from "@/pages/financial-analysis";
import PortfolioManagement from "@/pages/portfolio-management";
import MarketIntelligence from "@/pages/market-intelligence";
import CompliancePage from "@/pages/compliance";
import DocumentsPage from "@/pages/documents";
import RiskPage from "@/pages/risk";
import Web3InvestmentsPage from "@/pages/web3-investments";
import ICOTrackerPage from "@/pages/ico-tracker";
import GasTrackerPage from "@/pages/gas-tracker";
import { AuthProvider } from "@/hooks/use-auth";
import AuthRoutes from "../src/routes/auth-routes";

function App() {
  return (
    <AuthProvider>
      <AuthRoutes 
        publicRoutes={{
          "/auth": <AuthPage />
        }}
        privateRoutes={{
          "/": <Dashboard />,
          "/dashboard": <Dashboard />,
          "/deal-flow": <DealFlow />,
          "/financial-analysis": <FinancialAnalysis />,
          "/portfolio-management": <PortfolioManagement />,
          "/market-intelligence": <MarketIntelligence />,
          "/compliance": <CompliancePage />,
          "/documents": <DocumentsPage />,
          "/risk": <RiskPage />,
          "/web3-investments": <Web3InvestmentsPage />,
          "/ico-tracker": <ICOTrackerPage />,
          "/gas-tracker": <GasTrackerPage />,
          "*": <NotFound />
        }}
        appLayout={AppLayout}
      />
    </AuthProvider>
  );
}

export default App;
