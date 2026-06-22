import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import RouteTracker from "./components/analytics/RouteTracker";
import LandingPage from "./pages/LandingPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import AccountPage from "./pages/AccountPage.tsx";
import InviteAcceptPage from "./pages/InviteAcceptPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import CheckoutReturnPage from "./pages/CheckoutReturnPage.tsx";
import OnboardingPage from "./pages/OnboardingPage.tsx";
import UpdatePasswordPage from "./pages/UpdatePasswordPage.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import PricingPage from "./pages/PricingPage.tsx";
import Eula from "./pages/Eula.tsx";
import { ForumLayout } from "@forum/ForumLayout";
import { FeedPage } from "@forum/routes/FeedPage";
import { PostPage } from "@forum/routes/PostPage";
import { NotFoundPage as ForumNotFoundPage } from "@forum/routes/NotFoundPage";

// The post composer pulls in TipTap/ProseMirror; load it only on
// /forum/new so the rest of the site stays light.
const NewPostPage = lazy(() =>
  import("@forum/routes/NewPostPage").then((m) => ({ default: m.NewPostPage })),
);

function App() {
  return (
    <AuthProvider>
      <RouteTracker />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/invite-accept" element={<InviteAcceptPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout-return" element={<CheckoutReturnPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/eula" element={<Eula />} />
        <Route path="/forum" element={<ForumLayout />}>
          <Route index element={<FeedPage />} />
          <Route path="p/:id" element={<PostPage />} />
          <Route
            path="new"
            element={
              <Suspense fallback={null}>
                <NewPostPage />
              </Suspense>
            }
          />
          <Route path="*" element={<ForumNotFoundPage />} />
        </Route>
        <Route path="/auth" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
