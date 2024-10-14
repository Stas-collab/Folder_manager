import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import styles from './App.module.css';
import { Link } from 'react-router-dom';
import DefaultPhoto from '../assets/userPhoto.png';

const Settings = () => {
    const [avatarURL, setAvatarURL] = useState(DefaultPhoto);
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
                            <div className={styles.img}></div>
                            <i className="fas fa-heartbeat"></i>
                        </nav>
                        <p className={styles.userName}>Frog</p>
                        <div className={`${styles.icon} ${styles.dashboard}`}></div>
                        <div className={styles.icon}>
                            <span class="material-symbols-outlined">home</span>
                            <Link to={'/private'}> Home</Link>
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
                            <span className="material-symbols-outlined">settings</span>
                            <Link to={'/settings'} className={styles.setting}>
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
                    <h1>Settings</h1>
                </section>
            </article>
        </div>
    );
};

export default Settings;
