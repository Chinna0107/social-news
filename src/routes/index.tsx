import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { PublicLayout } from "@/components/layouts/PublicLayout";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { AdminLayout } from "@/components/layouts/AdminLayout";

// Public Pages
import Home from "@/pages/public/Home";
import CategoryPage from "@/pages/public/CategoryPage";
import ArticlePage from "@/pages/public/ArticlePage";
import PublicEventsPage from "@/pages/public/EventsPage";
import PublicMarketplacePage from "@/pages/public/MarketplacePage";
import PublicDonationsPage from "@/pages/public/DonationsPage";
import PublicCampaignsPage from "@/pages/public/CampaignsPage";
import PrivacyPolicy from "@/pages/public/PrivacyPolicy";
import TermsOfService from "@/pages/public/TermsOfService";
import RefundPolicy from "@/pages/public/RefundPolicy";
import PublicEnquiryPage from "@/pages/public/EnquiryPage";

// Auth Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminCampaigns from "@/pages/admin/Campaigns";
import AdminMarketplace from "@/pages/admin/Marketplace";
import AdminOrders from "@/pages/admin/Orders";
import AdminTasks from "@/pages/admin/Tasks";
import AdminQuizzes from "@/pages/admin/Quizzes";
import AdminMedia from "@/pages/admin/Media";
import AdminSubmissions from "@/pages/admin/Submissions";
import AdminCertificates from "@/pages/admin/Certificates";
import AdminIdCards from "@/pages/admin/IdCards";
import AdminBanners from "@/pages/admin/Banners";
import AdminDonations from "@/pages/admin/Donations";
import AdminEnquiries from "@/pages/admin/Enquiries";
import AdminContent from "@/pages/admin/Content";
import AdminAdsense from "@/pages/admin/Adsense";
import AdminReports from "@/pages/admin/Reports";
import AdminNews from "@/pages/admin/News";
import AdminSelfieManagement from "@/pages/admin/SelfieManagement";

// Student Pages
import StudentDashboard from "@/pages/student/Dashboard";
import CampaignsPage from "@/pages/student/CampaignsPage";
import TasksPage from "@/pages/student/TasksPage";
import QuizzesPage from "@/pages/student/QuizzesPage";
import CertificatesPage from "@/pages/student/CertificatesPage";
import MarketplacePage from "@/pages/student/MarketplacePage";
import CheckoutPage from "@/pages/student/CheckoutPage";
import OrdersPage from "@/pages/student/OrdersPage";
import DonationsPage from "@/pages/student/DonationsPage";
import IdCardPage from "@/pages/student/IdCardPage";
import SelfieFramePage from "@/pages/student/SelfieFramePage";
import ProfilePage from "@/pages/student/Profile";
import NotificationsPage from "@/pages/student/Notifications";
import EnquiryPage from "@/pages/student/Enquiry";
import ActivityPage from "@/pages/student/Activity";
import TaskSubmissionPage from "@/pages/student/TaskSubmission";
import QuizParticipationPage from "@/pages/student/QuizParticipation";
import ProgressPage from "@/pages/student/Progress";

import { UserLayout } from "@/components/layouts/UserLayout";
import UserDashboard from "@/pages/user/Dashboard";

// Shared Pages
import ComingSoon from "@/pages/shared/ComingSoon";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "category/:categoryId", element: <CategoryPage /> },
      { path: "article/:articleId", element: <ArticlePage /> },
      { path: "events", element: <PublicEventsPage /> },
      { path: "campaigns", element: <PublicCampaignsPage /> },
      { path: "marketplace", element: <PublicMarketplacePage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "donations", element: <PublicDonationsPage /> },
      { path: "privacy", element: <PrivacyPolicy /> },
      { path: "terms", element: <TermsOfService /> },
      { path: "refund-policy", element: <RefundPolicy /> },
      { path: "enquiry", element: <PublicEnquiryPage /> },
      { path: "*", element: <ComingSoon /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/student",
    element: <StudentLayout />,
    children: [
      { index: true, element: <Navigate to="/student/dashboard" replace /> },
      { path: "dashboard", element: <StudentDashboard /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "campaigns", element: <CampaignsPage /> },
      { path: "tasks", element: <TasksPage /> },
      { path: "tasks/:taskId/submit", element: <TaskSubmissionPage /> },
      { path: "quizzes", element: <QuizzesPage /> },
      { path: "quizzes/:quizId/participate", element: <QuizParticipationPage /> },
      { path: "progress", element: <ProgressPage /> },
      { path: "certificates", element: <CertificatesPage /> },
      { path: "marketplace", element: <MarketplacePage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "donations", element: <DonationsPage /> },
      { path: "id-card", element: <IdCardPage /> },
      { path: "selfie-frame", element: <SelfieFramePage /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "enquiry", element: <EnquiryPage /> },
      { path: "activity", element: <ActivityPage /> },
      { path: "*", element: <ComingSoon /> },
    ],
  },
  {
    path: "/user",
    element: <UserLayout />,
    children: [
      { index: true, element: <Navigate to="/user/dashboard" replace /> },
      { path: "dashboard",                        element: <UserDashboard /> },
      { path: "campaigns",                        element: <CampaignsPage /> },
      { path: "tasks",                            element: <TasksPage /> },
      { path: "tasks/:taskId/submit",             element: <TaskSubmissionPage /> },
      { path: "quizzes",                          element: <QuizzesPage /> },
      { path: "quizzes/:quizId/participate",      element: <QuizParticipationPage /> },
      { path: "certificates",                     element: <CertificatesPage /> },
      { path: "id-card",                          element: <IdCardPage /> },
      { path: "selfie-frame",                     element: <SelfieFramePage /> },
      { path: "marketplace",                      element: <MarketplacePage /> },
      { path: "checkout",                         element: <CheckoutPage /> },
      { path: "orders",                           element: <OrdersPage /> },
      { path: "donations",                        element: <DonationsPage /> },

      { path: "profile",                          element: <ProfilePage /> },
      { path: "enquiry",                          element: <EnquiryPage /> },
      { path: "activity",                         element: <ActivityPage /> },
      { path: "progress",                         element: <ProgressPage /> },
      { path: "*",                                element: <ComingSoon /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "users", element: <AdminUsers /> },
      { path: "campaigns", element: <AdminCampaigns /> },
      { path: "marketplace", element: <AdminMarketplace /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "tasks", element: <AdminTasks /> },
      { path: "quizzes", element: <AdminQuizzes /> },
      { path: "media", element: <AdminMedia /> },
      { path: "submissions", element: <AdminSubmissions /> },
      { path: "certificates", element: <AdminCertificates /> },
      { path: "id-cards", element: <AdminIdCards /> },
      { path: "banners", element: <AdminBanners /> },
      { path: "donations", element: <AdminDonations /> },
      { path: "enquiries", element: <AdminEnquiries /> },
      { path: "content", element: <AdminContent /> },
      { path: "adsense", element: <AdminAdsense /> },
      { path: "reports", element: <AdminReports /> },
      { path: "news", element: <AdminNews /> },
      { path: "selfie-management", element: <AdminSelfieManagement /> },
      { path: "*", element: <ComingSoon /> },
    ],
  },
  {
    path: "*",
    element: <ComingSoon />
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
