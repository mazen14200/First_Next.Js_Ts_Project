'use client';

import Image from 'next/image';
import styles from './LoginForm.module.css';

import { useState, type SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const router = useRouter()


const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    router.push("/");
  } catch (err) {
    console.log("Failed", err);
  }
};


  return (
    <main className={styles.authBg}>
      <div className={styles.row}>
        <div className={styles.authContainer}>

          {/* Login Form */}
          <div className={styles.loginSide}>

            <a href="#" className={styles.authBrand}>
              <Image
                src="/images/sv-logo.png"
                alt="Smart Vision"
                width={255}
                height={55}
              />
            </a>

            <h4>سجل الدخول إلى حسابك</h4>

            <p className={styles.description}>
              أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى لوحة التحكم.
            </p>

            <form className={styles.form} onSubmit={handleLogin}>

              <div className={styles.formGroup}>
                <label htmlFor="email">
                  البريد الإلكتروني
                </label>

                <input
                  type="email"
                  id="email"
                  placeholder="أدخل بريدك الإلكتروني هنا"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">
                  كلمة المرور
                </label>

                <input
                  type="password"
                  id="password"
                  placeholder="أدخل كلمة المرور هنا"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <div className={styles.forgotPassword}>
                  <a href="#">
                    هل نسيت كلمة المرور؟
                  </a>
                </div>
              </div>

              <div className={styles.language}>
                <label>
                  <input
                    type="radio"
                    name="language"
                    value="ar"
                    defaultChecked
                  />
                  عربي
                </label>

                <label>
                  <input
                    type="radio"
                    name="language"
                    value="en"
                  />
                  English
                </label>
              </div>

              <div className={styles.remember}>
                <label>
                  <input
                    type="checkbox"
                    id="remember"
                  />
                  تذكرني
                </label>
              </div>

              <div className={styles.buttonWrapper}>
                <button type="submit" className={styles.button}>
                  <span>تسجيل الدخول</span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 66 43"
                  >
                    <polygon points="26.42,4.46 21.89,0 0,21.5 21.89,43 26.42,38.54 9.06,21.5" />
                    <polygon points="46.21,4.46 41.68,0 19.79,21.5 41.68,43 46.21,38.54 28.85,21.5" />
                    <polygon points="66,4.46 61.47,0 39.58,21.5 61.47,43 66,38.54 48.64,21.5" />
                  </svg>
                </button>
              </div>

            </form>

            <p className={styles.register}>
              ليس لديك حساب؟
              <a href="#">إنشاء حساب جديد</a>
            </p>

            <p className={styles.copyright}>
              {new Date().getFullYear()} © Smart Vision
            </p>

          </div>

          {/* Welcome Side */}
          <div className={styles.welcomeSide}>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              fill="white"
              viewBox="0 0 16 16"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              <path d="M8 9a5 5 0 0 0-5 5v1h10v-1a5 5 0 0 0-5-5z" />
            </svg>

            <span className={styles.welcomeTitle}>
              مرحباً بك
            </span>

            <span className={styles.welcomeDescription}>
              يرجى تسجيل الدخول للوصول إلى لوحة التحكم.
            </span>

          </div>

        </div>
      </div>
    </main>
  );
}