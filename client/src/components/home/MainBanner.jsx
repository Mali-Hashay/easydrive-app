import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MainBanner.module.css';

const CAR_IMAGES = [
  "https://res.cloudinary.com/x6xidnvr/image/upload/v1784130173/%D7%99%D7%95%D7%A0%D7%93%D7%90%D7%99_%D7%90%D7%99%D7%9920_4_%D7%9E%D7%A7%D7%95%D7%9E%D7%95%D7%AA_yk2l1k.png",
  "https://res.cloudinary.com/x6xidnvr/image/upload/v1786880973/0521f01bd9da705fbd70c2097be77e882501dfee42af873a227a2d9d1853e6a2.png",
  "https://res.cloudinary.com/x6xidnvr/image/upload/v1786877951/3c258eeba9f0be07745950b774fd0c3da42934b066eb820c0b96c08a2c8678fc.png",
   "https://res.cloudinary.com/x6xidnvr/image/upload/v1787501412/d4c6973bfaef5ea8098f63fd6f9508e6edb5d019aef15eca659e4260b8ebfc88.png",
  "https://res.cloudinary.com/x6xidnvr/image/upload/v1786877145/f44af6535a97aef66bd8409166610dd152230908699289a6bd773c8632b119fb.png",
  "https://res.cloudinary.com/x6xidnvr/image/upload/v1786836938/a809ed25e3bda762615b336dc970bae9e74179c98ff9e411ce71f579e3e54828.png",
  "https://res.cloudinary.com/x6xidnvr/image/upload/v1784130403/%D7%A4%D7%95%D7%A8%D7%93_%D7%90%D7%93%D7%92_suiymv.png",
  "https://res.cloudinary.com/x6xidnvr/image/upload/v1786877177/de2693cee8873aed2c7db107bbd547a0cd699e68f9813deaf0d8b122f2d5264e.png"
];

export default function MainBanner() {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    
    useEffect(() => {
        if (CAR_IMAGES.length <= 1) 
            return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => 
                (prevIndex + 1) % CAR_IMAGES.length
            );
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className={styles.hero}>
            <div className={styles.container}>
                <div className={styles.imageContainer}>
                    <img 
                        key={currentImageIndex}
                        src={CAR_IMAGES[currentImageIndex]} 
                        alt="רכב להשכרה" 
                        className={styles.carImage} 
                    />
                </div>

                <div className={styles.content}>
                    <h1 className={styles.title}>
                        השכרת רכב <br />
                        <span className={styles.highlight}>בקליק</span> אחד.
                    </h1>
                    
                    <p className={styles.subtitle}>
                        תהליך השכרה פשוט, שקוף ומהיר. מצאו את הרכב המושלם עבורכם ללא עמלות נסתרות ובלי אותיות קטנות.
                    </p>
                    
                    <button
                        className={styles.ctaButton}
                        onClick={() => navigate('/rental')}
                    >
                        מעבר להשכרת רכב
                    </button>
                </div>
            </div>
        </section>
    );
}