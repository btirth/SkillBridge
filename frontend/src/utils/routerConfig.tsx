import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import NotFoundPage from "../pages/not-found-page/NotFoundPage";
import LandingPage from "../pages/landing-page/LandingPage";
import FaqPage from "../pages/faq-page/FaqPage";
import SignIn from "../components/SignIn/SignIn";
import { NavigationItem } from "../models/NavigationItem.model";
import SignUp from "../components/SignUp/SignUp";
import ContactUsPage from "../pages/contact-us/ContactUsPage";
import ProtectedRoute from "../components/protected-route/ProtectedRoute";
import ApplyMentor from "../pages/mentorship/ApplyMentor";
import FindMentor from "../pages/mentorship/FindMentor";
import RateMentor from "../pages/mentorship/RateMentor";
import MentorProfile from "../pages/mentorship/MentorProfile";
import ContentFeed from "../components/ContentFeed/ContentFeed";
import PaymentPage from "../pages/payment-page/PaymentPage";
import ForgotPassword from "../components/ForgotPassword/ForgotPassword";
import ProfilePage from "../pages/profile-page/ProfilePage";
import DiscussionsPage from "../pages/discussions/discussions";
import DiscussionView from "../pages/discussions/discussionView";
import NewDiscussion from "../pages/discussions/newDiscussion";
import TranasactionsCardsPage from "../pages/transactions-cards-page/TranasactionsCardsPage";
import BookMentorPage from "../pages/book-mentor-page/BookMentorPage";
import NewJob from "../pages/jobs/newJob";
import JobsDashboard from "../pages/jobs/jobsDashboard";
import JobDetail from "../pages/jobs/jobDetail";
import MentorBookingsPage from "../pages/mentor-bookings-page/MentorBookingsPage";
import AdvanceNetworkPage from "../pages/advanceNetworking/advanceNetwork";
import MessageDashboard from "../pages/messages/MessageDashboard";
import DashboardPage from "../pages/dashboard-page/DashboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <LandingPage /> },
      {
        path: "/faqs",
        element: <FaqPage />,
      },
      {
        path: "/contact-us",
        element: <ContactUsPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/profile",
            element: <ProfilePage uid={""} />,
          },
          { path: "/contentfeed", element: <ContentFeed /> },
          {
            path: "/discussions",
            element: <DiscussionsPage />,
          },
          {
            path: "/discussions/:discussionId",
            element: <DiscussionView />,
          },
          {
            path: "/discussions/new",
            element: <NewDiscussion />,
          },
          { path: "/payments", element: <TranasactionsCardsPage /> },
          {
            path: "/mentors",
            element: <FindMentor />,
          },
          {
            path: "/applymentor",
            element: <ApplyMentor />,
          },
          {
            path: "/mentorprofile/:id?",
            element: <MentorProfile />,
          },
          {
            path: "/ratementor/:id?",
            element: <RateMentor />,
          },
          {
            path: "/jobs/new",
            element: <NewJob />,
          },
          {
            path: "/jobs",
            element: <JobsDashboard />,
          },
          {
            path: "/jobs/:jobId",
            element: <JobDetail />,
          },
          { path: "/bookings", element: <MentorBookingsPage /> },
          {
            path: "/networking",
            element: <AdvanceNetworkPage />,
          },
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          { path: "/messages", element: <MessageDashboard /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/book-mentor", element: <BookMentorPage /> },
      { path: "/pay", element: <PaymentPage /> },
    ],
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
]);

export const navigationItems: NavigationItem[] = [
  { path: "dashboard", label: "Dashboard", isProtected: true },
  { path: "discussions", label: "Discussions", isProtected: true },
  { path: "mentors", label: "Mentorship", isProtected: true },
  { path: "contentfeed", label: "Content Feed", isProtected: true },
  { path: "jobs", label: "Jobs", isProtected: true },
  { path: "networking", label: "Networking", isProtected: true },
  { path: "messages", label: "Messages", isProtected: true },
  { path: "contact-us", label: "Contact Us", isProtected: false },
  { path: "faqs", label: "FAQs", isProtected: false },
];

export const settings: Setting[] = [
  { label: "User profile", path: "profile" },
  { label: "Payments", path: "payments" },
  { label: "Bookings", path: "bookings" },
  { label: "Logout", path: "logout" },
];

export type Setting = {
  label: string;
  path: string;
};
