import { useState } from "react";
import PersonalInfoForm from "../../components/profile/PersonalInfoForm";
import ChangePasswordForm from "../../components/profile/ChangePassword";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() 
{
  const [activeTab, setActiveTab] = useState("personalInfo");

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>  איזור אישי</h1>

      <div className={styles.topTabs}>
        <button
          className={`${styles.tabBtn} ${
            activeTab === "personalInfo" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("personalInfo")}
        >
          פרטים אישיים
        </button>
        <button
          className={`${styles.tabBtn} ${
            activeTab === "security" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("security")}
        >
          אבטחה וסיסמה
        </button>
      </div>

      <main className={styles.contentArea}>
        {activeTab === "personalInfo" && <PersonalInfoForm />}
        {activeTab === "security" && <ChangePasswordForm />}
      </main>
    </div>
  );
}