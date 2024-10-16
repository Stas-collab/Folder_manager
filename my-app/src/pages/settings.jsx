import { signOut } from 'firebase/auth';
import React, { useState, useRef, useEffect } from 'react';
import DefaultImage from '../image/default.jpg';
import EditIcon from '../image/edit.svg';
import { auth, storage, db } from '../firebase';
import styles from './App.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const Settings = () => {
    const fileUploadeRef = useRef();
    const [avatarUrl, setAvatarUrl] = useState(DefaultImage);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAvatarUrl = async () => {
            const userDocRef = doc(db, 'users', auth.currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                setAvatarUrl(userDoc.data().avatarUrl); // Встановлюємо URL аватарки з Firestore
            }
        };

        fetchAvatarUrl();
    }, []);

    const handleImageUplode = (event) => {
        event.preventDefault();
        fileUploadeRef.current.click();
    };

    const uploadImageDisplay = async () => {
        const uploudFile = fileUploadeRef.current.files[0];

        if (uploudFile) {
            const storageRef = ref(storage, `avatars/${auth.currentUser.uid}/${uploudFile.name}`);
            await uploadBytes(storageRef, uploudFile);
            const url = await getDownloadURL(storageRef);
            setAvatarUrl(url);

            const userDocRef = doc(db, 'users', auth.currentUser.uid);
            await setDoc(userDocRef, { avatarUrl: url }, { merge: true });
        }
    };

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
                            <img src={avatarUrl} className={styles.profilImg} alt="" />
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
                            <h1 className={styles.overviewText}>Settings</h1>
                        </div>
                        <div className={styles.rightPanel}>
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
                    <div className={styles.settingsPage}>
                        <div className={styles.inputsSetting}>
                            <input type="text" className={styles.userNameInput} />
                            <input type="submit" value="Save" className={styles.userNameSumbit} />
                        </div>
                        <div className={styles.userEditIcon}>
                            <img src={avatarUrl} alt="Avatar" className={styles.avatar} />
                            <form id="form" encType="multipart/form-data">
                                <button type="submit" onClick={handleImageUplode} className={styles.btnEdit}>
                                    <img src={EditIcon} alt="Edit" className={styles.editIcon}></img>
                                </button>

                                <input
                                    type="file"
                                    ref={fileUploadeRef}
                                    onChange={uploadImageDisplay}
                                    id="file"
                                    hidden
                                />
                            </form>
                        </div>
                    </div>
                </section>
            </article>
        </div>
    );
};

export default Settings;
