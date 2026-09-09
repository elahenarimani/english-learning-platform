// "use client";

// import { useEffect } from "react";
// import toast from "react-hot-toast";
// import { useTranslations } from "next-intl";

// export default function LoginSuccessToast() {
//   const t = useTranslations("Login");

//   useEffect(() => {
//     const loginSuccess = sessionStorage.getItem("login_success");

//     if (!loginSuccess) {
//       return;
//     }

//     try {
//       const { firstName } = JSON.parse(loginSuccess);

//       toast.success(
//         t("welcomeBack", {
//           name: firstName,
//         }),
//       );

//       sessionStorage.removeItem("login_success");
//     } catch (error) {
//       console.error(
//         "Unable to read login success data:",
//         error,
//       );

//       sessionStorage.removeItem("login_success");
//     }
//   }, [t]);

//   return null;
// }