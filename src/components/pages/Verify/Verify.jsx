import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

import useQuery from "../../../hooks/useQuery";
import { verifyEmail } from "../../../utils/api";
import "./verify.scss";

const Verify = () => {
  const history = useHistory();
  const [, setCookie] = useCookies(["accessToken"]);
  const query = useQuery();

  async function verify() {
    try {
      const { data } = await verifyEmail({
        verificationCode: query.get("code"),
      });
      const { accessToken, alertOnSignUp, signupPopup, wallet } = data;
      setCookie("accessToken", accessToken);
      setCookie("alertOnSignUp", alertOnSignUp);
      setCookie("signupPopup", signupPopup);
      setCookie("wallet", wallet);
      setCookie('user_session', "artyst_ai_registered");
      history.push("/");
      toast("Your Email is Verified");
    } catch (error) {
      if (error?.response?.data?.error === "ALREADY_VERIFIED")
        history.push("/");
      else alert(error?.response?.data?.message || "Something went wrong");
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  useEffect(() => {
    if (query.get("code")) {
      verify();
    }
  }, [query, verify]);

  return (
    <div className="verify">
      <div className="verify__heading">Verify your email</div>
      <div className="verify__description">
        Please check your email inbox for a verification link. If you haven’t
        received an email in inbox please check your Spam/Junk folder.
      </div>
    </div>
  );
};

export default Verify;
