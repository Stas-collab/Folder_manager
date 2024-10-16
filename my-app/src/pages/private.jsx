import { signOut } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import styles from './App.module.css';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import DefaultImage from '../image/default.jpg';

const Private = () => {
    const [avatarUrl, setAvatarUrl] = useState(DefaultImage); // Стан для URL аватарки

    useEffect(() => {
        // Функція для завантаження аватарки
        const fetchAvatarUrl = async () => {
            const userDocRef = doc(db, 'users', auth.currentUser.uid); // Отримуємо документ користувача з Firestore
            const userDoc = await getDoc(userDocRef); // Викликаємо getDoc

            if (userDoc.exists()) {
                setAvatarUrl(userDoc.data().avatarUrl); // Встановлюємо URL аватарки з Firestore
            }
        };

        fetchAvatarUrl(); // Викликаємо функцію
    }, []);
    const handleSignOut = () => {
        signOut(auth)
            .then(() => console.log('SignOut'))
            .catch((error) => console.log(error));
    };
    return (
        <div>
            <article className={styles.container}>
                <section className={styles.profil}>
                    <h1 className={styles.logoName}>Folders manager</h1>
                    <div className={styles.imgProfil}>
                        <nav>
                            <img src={avatarUrl} alt="" className={styles.profilImg} />
                        </nav>
                        <p className={styles.userName}>Frog</p>
                        <div className={`${styles.icon} ${styles.dashboard}`}></div>
                        <div className={styles.icon}>
                            <Link to={'/private'} className={styles.links}>
                                <span className="material-symbols-outlined">home</span>
                            </Link>
                            <Link to={'/private'} className={styles.links}>
                                {' '}
                                Home
                            </Link>
                        </div>
                        <div className={`${styles.icon} ${styles.special}`}>
                            <div className={styles.icon}>
                                <button className={`${styles.btn} ${styles.folder}`}>
                                    <p>Folders</p>
                                </button>
                            </div>
                            <button className={`${styles.btn} ${styles.arrow}`}>
                                <div className={styles.arrow}></div>
                            </button>
                        </div>
                        <ul className={styles.folders}>
                            <li>Marketing</li>
                            <li>Design</li>
                            <li>WorkPlace</li>
                        </ul>
                        <div className={styles.icon}>
                            <Link to={'/settings'} className={styles.links}>
                                <span className="material-symbols-outlined">settings</span>
                            </Link>
                            <Link to={'/settings'} className={styles.links}>
                                Setting
                            </Link>
                        </div>
                    </div>
                </section>

                <section className={styles.userActivites}>
                    <div className={styles.panel}>
                        <div className={styles.overview}>
                            <h1 className={styles.overviewText}>Overview</h1>
                            <p className={styles.overviewGb}>185 GB</p>
                        </div>
                        <div className={styles.rightPanel}>
                            <div className={styles.searchBtn}>
                                <span className="material-symbols-outlined">search</span>
                                <input className={styles.searchText} type="text" placeholder="search..." />
                            </div>
                            <div className={styles.userBtn}>
                                <button className={styles.ring}>
                                    <span className="material-symbols-outlined">notifications</span>
                                </button>
                                <button onClick={handleSignOut} className={styles.logout}>
                                    <span className="material-symbols-outlined">logout</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.manageFolders}>
                        <h1 className={styles.manageFoldersText}>Manage your folders</h1>
                        <div className={styles.userFolders}>
                            <div className={styles.newFolder}>
                                <button className={styles.crossButton}>&#x2715;</button>
                            </div>
                            <div className={`${styles.marketing} ${styles.mainDecorationFolders}`}>
                                <div className={styles.number}>
                                    <p className={`${styles.textNumber} ${styles.text}`}>01</p>
                                    <p className={styles.text}>:</p>
                                </div>
                                <div className={styles.marketingFooter}>
                                    <p className={styles.colorText}>Marketing</p>
                                    <p className={styles.marketingGb}>124 GB</p>
                                </div>
                            </div>
                            <div className={`${styles.branding} ${styles.mainDecorationFolders}`}>
                                <div className={styles.number}>
                                    <p className={`${styles.textNumber} ${styles.text}`}>02</p>
                                    <p className={styles.text}>:</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.underManage}>
                        <p>
                            Create folders to sort files and have
                            <br /> quick access to documents
                        </p>
                    </div>
                </section>
            </article>
        </div>
    );
};

export default Private;
