import { signOut } from 'firebase/auth';
import React from 'react';
import { auth } from '../firebase';
import styles from './App.module.css';
import { Link, useNavigate } from 'react-router-dom';

const Settings = () => {
    const navigate = useNavigate();
    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                console.log('SignOut');
                navigate('/'); // Перенаправляємо на домашню сторінку
            })
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
                            <span className="material-symbols-outlined">settings</span>
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
                </section>
            </article>
        </div>
    );
};

export default Settings;
