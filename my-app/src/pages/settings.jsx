import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { auth, db as database, storage } from '../firebase';
import DefaultImage from '../image/default.jpg';
import EditIcon from '../image/edit.svg';
import styles from './App.module.css';

const Settings = () => {
    const fileUploadeReference = useRef();
    const [avatarUrl, setAvatarUrl] = useState(DefaultImage);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAvatarUrl = async () => {
            const userDocumentReference = doc(database, 'users', auth.currentUser.uid);
            const userDocument = await getDoc(userDocumentReference);

            if (userDocument.exists()) {
                setAvatarUrl(userDocument.data().avatarUrl); // Встановлюємо URL аватарки з Firestore
            }
        };

        fetchAvatarUrl();
    }, []);

    const handleImageUplode = (event) => {
        event.preventDefault();
        fileUploadeReference.current.click();
    };

    const uploadImageDisplay = async () => {
        const uploudFile = fileUploadeReference.current.files[0];

        if (uploudFile) {
            const storageReference = ref(storage, `avatars/${auth.currentUser.uid}/${uploudFile.name}`);
            await uploadBytes(storageReference, uploudFile);
            const url = await getDownloadURL(storageReference);
            setAvatarUrl(url);

            const userDocumentReference = doc(database, 'users', auth.currentUser.uid);
            await setDoc(userDocumentReference, { avatarUrl: url }, { merge: true });
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
                            <input type="text" className={styles.userNameInput} placeholder="Name" />
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
                                    ref={fileUploadeReference}
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
