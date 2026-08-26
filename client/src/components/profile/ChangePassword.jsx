import React, { useState } from "react";
import { changePassword } from "../../api/authApi";
import { alertService } from "../../utils/alertService";
import { validatePassword } from "../../utils/validators";
import styles from "./ChangePassword.module.css";

export default function ChangePasswordForm(props) {
  const { onSuccess } = props;

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    verifyPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const currentErr = validatePassword(formData.currentPassword);
    if (currentErr) {
      newErrors.currentPassword = currentErr;
    }

    const newErr = validatePassword(formData.newPassword);
    if (newErr) {
      newErrors.newPassword = newErr;
    }

    if (!formData.verifyPassword) {
      newErrors.verifyPassword = "יש לאשר את הסיסמה החדשה";
    } else if (formData.newPassword !== formData.verifyPassword) {
      newErrors.verifyPassword = "הסיסמאות אינן תואמות";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      alertService.success("הסיסמה שונתה בהצלחה!");

      setFormData({
        currentPassword: "",
        newPassword: "",
        verifyPassword: "",
      });
      setErrors({});

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      alertService.errorToast(err.message || "אירעה שגיאה בשינוי הסיסמה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>שינוי סיסמה</h2>

      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            סיסמה נוכחית
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={`${styles.input} ${errors.currentPassword ? "input-error" : ""}`}
            />
          </label>
          {errors.currentPassword && (
            <p className="error-text">{errors.currentPassword}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            סיסמה חדשה
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`${styles.input} ${errors.newPassword ? "input-error" : ""}`}
            />
          </label>
          {errors.newPassword && (
            <p className="error-text">{errors.newPassword}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            אימות סיסמה חדשה
            <input
              type="password"
              name="verifyPassword"
              value={formData.verifyPassword}
              onChange={handleChange}
              className={`${styles.input} ${errors.verifyPassword ? "input-error" : ""}`}
            />
          </label>
          {errors.verifyPassword && (
            <p className="error-text">{errors.verifyPassword}</p>
          )}
        </div>

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? "מעדכן סיסמה..." : "עדכן סיסמה"}
        </button>
      </form>
    </div>
  );
}