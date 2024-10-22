import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { auth, db as database, storage } from '../firebase';
import DefaultImage from '../image/default.jpg';
import styles from './App.module.css';

const About = () => {
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
                            <span class="material-symbols-outlined">groups</span>
                            <Link to={'/about'} className={styles.links}>
                                About us
                            </Link>
                        </div>

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
                            <h1 className={styles.overviewText}>About us</h1>
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
                    <div className={styles.aboutUsText}>
                        <p className={styles.headText}>
                            Welcome to FolderManager – your go-to solution for organizing, storing, and managing files
                            effortlessly. Whether you’re an individual looking to keep personal files neat, or a
                            business seeking efficient document management, FolderManager provides a simple yet powerful
                            platform to help you stay organized.
                        </p>
                        <h2 className={styles.mission}>Our Mission</h2>
                        <p className={styles.missionText}>
                            At FolderManager, we believe that file organization should be seamless and intuitive. We are
                            committed to providing a tool that not only allows users to create and manage folders but
                            also ensures that their files are stored securely and easily accessible at any time. Our
                            mission is to make file management stress-free, allowing you to focus on what truly matters.
                        </p>
                        <h2 className={styles.reasone}>Why FolderManager?</h2>
                        <ul>
                            <li>
                                <strong> Simple and Intuitive Interface:</strong> Our platform is designed to be
                                user-friendly, with a clean interface that makes it easy to create folders, upload
                                files, and manage them with just a few clicks.
                            </li>
                            <li>
                                <strong>Secure Storage:</strong> We prioritize the security of your files. With advanced
                                encryption and data protection features, your information stays safe in the cloud.
                            </li>
                            <li>
                                <strong>Flexibility:</strong> From personal projects to large business archives,
                                FolderManager is built to scale with your needs. Store, sort, and retrieve files without
                                any hassle.
                            </li>
                            <li>
                                <strong>Anytime, Anywhere:</strong> Access your folders and files from any device.
                                Whether you’re at home, in the office, or on the go, FolderManager ensures your
                                documents are always within reach.
                            </li>
                        </ul>
                        <h2>Our Vision</h2>
                        <p>
                            We aim to transform how people and businesses handle their documents, making organization
                            and file retrieval more efficient than ever before. Our goal is to become the leading
                            platform for file management by continuously innovating and improving our services to meet
                            the evolving needs of our users. <br />
                            Thank you for choosing FolderManager. We're here to help you organize your digital life with
                            ease and confidence.
                        </p>
                    </div>
                </section>
            </article>
        </div>
    );
};

export default About;
