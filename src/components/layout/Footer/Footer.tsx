import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.row}>

          <div className={styles.copyright}>
            <a
              href="https://esmart-vision.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/images/sv-logo.png"
                alt="Smart Vision"
                width={90}
                height={30}
                className={styles.logo}
              />
            </a>

            <span>Powered by</span>
          </div>

          <div className={styles.rights}>
            ALL RIGHT RESERVED {new Date().getFullYear()} © SMART VISION — IT
            SOLUTIONS
          </div>

        </div>
      </div>
    </footer>
  );
}