import { Routes, Route } from "react-router-dom";
import ApplicationForm from "./pages/ApplicationFormPage/ApplicationFormPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import RulesPage from "./pages/RulesPage/RulesPage";
import Layout from "./components/Layout/Layout";
import ResponseMsg from "./pages/ResponseMsgPage/ResponseMsgPage";

function MainWebsite() {
  return (
    <Layout>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="rules" element={<RulesPage />} />
        <Route path="application" element={<ApplicationForm />} />
        <Route path="thank-you" element={<ResponseMsg type="thankyou" />} />
        <Route path="error" element={<ResponseMsg type="error" />} />
        <Route path="not-in-discord" element={<ResponseMsg type="discord" />} />
      </Routes>
    </Layout>
  );
}

export default MainWebsite;
