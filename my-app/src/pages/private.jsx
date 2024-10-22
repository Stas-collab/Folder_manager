import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';

import { auth, db as database, storage } from '../firebase';
import DefaultImage from '../image/default.jpg';
import styles from './App.module.css';

const Private = () => {
    const [avatarUrl, setAvatarUrl] = useState(DefaultImage); // Стан для URL аватарки

    useEffect(() => {
        // Функція для завантаження аватарки
        const fetchAvatarUrl = async () => {
            const userDocumentReference = doc(database, 'users', auth.currentUser.uid); // Отримуємо документ користувача з Firestore
            const userDocument = await getDoc(userDocumentReference); // Викликаємо getDoc

            if (userDocument.exists()) {
                setAvatarUrl(userDocument.data().avatarUrl); // Встановлюємо URL аватарки з Firestore
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
                            <Link to={'/private'} className={`${styles.links} ${styles.home}`}>
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
                                Settings
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
                            <div className={styles.userBtn}>
                                <button className={styles.ring}>
                                    <span className="material-symbols-outlined">notifications</span>
                                </button>
                                <div className={styles.ringWindow} hidden>
                                    <button className={styles.closeWindow}>&times;</button>
                                </div>
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
                        </div>
                    </div>

                    <div className={styles.underManage}>
                        <p>
                            Create folders to sort files and have
                            <br /> quick access to documents
                        </p>
                    </div>
                    <div className={styles.createBtnWindow} hidden>
                        <h1 className={styles.headText}>Створення папки</h1>
                        <div className={styles.createBtnForm}>
                            <input
                                type="text"
                                name=""
                                id=""
                                className={styles.inputNameFolder}
                                placeholder="Folder name"
                            />
                            <p>Виберіть колір</p>
                            <input type="color" name="" id="" className={styles.inputColorFolder} />
                            <input type="submit" value="Створити папку" className={styles.inputCreateFolder} />
                        </div>
                    </div>
                </section>
            </article>
        </div>
    );
};

export default Private;
