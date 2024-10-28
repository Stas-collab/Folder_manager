import { signOut } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { auth, db as database } from '../firebase';
import DefaultImage from '../image/default.jpg';
import styles from './App.module.css';

const Private = () => {
    const [avatarUrl, setAvatarUrl] = useState(DefaultImage); // Стан для URL аватарки
    const [isHidden, setIsHidden] = useState(true);
    const [folderName, setFolderName] = useState('');
    const [folderColor, setFolderColor] = useState('#ffffff');
    const [folders, setFolders] = useState([]);

    const toggleWindow = () => {
        setIsHidden(!isHidden);
    };

    const handleCreateFolder = async (event) => {
        event.preventDefault();
        const newFolder = { name: folderName, color: folderColor, userId: auth.currentUser.uid };
        try {
            const folderReference = await addDoc(collection(database, 'folders'), newFolder);
            setFolders([...folders, { ...newFolder, id: folderReference.id }]);

            setFolderName('');
            setFolderColor('#ffffff');

            toggleWindow();
        } catch (error) {
            console.log('Помилка при створенні папки:', error);
        }
    };
    const handleDeleteFolder = async (folderId) => {
        try {
            const folderReference = doc(database, 'folders', folderId);
            await deleteDoc(folderReference);

            setFolders((previousFolders) => previousFolders.filter((folder) => folder.id !== folderId));
        } catch (error) {
            console.log('Помилка при видаленні папки:', error);
            alert('Не вдалося видалити папку. Спробуйте ще раз.');
        }
    };

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

    useEffect(() => {
        const fetchUserFolders = async () => {
            if (!auth.currentUser) return;

            const q = query(collection(database, 'folders'), where('userId', '==', auth.currentUser.uid));

            try {
                const querySnapshot = await getDocs(q);
                const userFolders = querySnapshot.docs.map((document_) => ({
                    id: document_.id,
                    ...document_.data(),
                }));
                setFolders(userFolders);
            } catch (error) {
                console.log('Помилка при завантаженні папок:', error);
            }
        };

        fetchUserFolders();
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
                            <span className="material-symbols-outlined">groups</span>
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
                            <div className={styles.newFolder} onClick={toggleWindow}>
                                <button className={styles.crossButton} onClick={toggleWindow}>
                                    &#x2715;
                                </button>
                            </div>
                            {folders.map((folder) => (
                                <div
                                    key={folder.id}
                                    className={styles.mainDecorationFolders}
                                    style={{
                                        backgroundColor: folder.color,
                                    }}
                                >
                                    <div className={styles.foldersInf}>
                                        <p className={styles.crtFOlderName}>{folder.name}</p>
                                        <button
                                            className={styles.foldersInfBtn}
                                            onClick={() => handleDeleteFolder(folder.id)}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                    <div className={styles.folderIcons}>
                                        <button className={styles.fileFilters}>
                                            <span className="material-symbols-outlined">download</span>
                                        </button>
                                        <button className={styles.fileFilters}>
                                            <span className="material-symbols-outlined">attach_file</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.underManage}>
                        <p>
                            Create folders to sort files and have
                            <br /> quick access to documents
                        </p>
                    </div>
                    <div className={styles.createBtnWindow} hidden={isHidden}>
                        <button className={styles.btnFolderClose} onClick={toggleWindow}>
                            &times;
                        </button>
                        <h1 className={styles.headText}>Make your folder</h1>
                        <form onSubmit={handleCreateFolder} className={styles.createBtnForm}>
                            <input
                                type="text"
                                className={styles.inputNameFolder}
                                placeholder="Folder name"
                                value={folderName}
                                onChange={(event) => setFolderName(event.target.value)}
                            />
                            <p>Choose color</p>
                            <input
                                type="color"
                                className={styles.inputColorFolder}
                                value={folderColor}
                                onChange={(event) => setFolderColor(event.target.value)}
                            />
                            <input type="submit" value="Create folder" className={styles.inputCreateFolder} />
                        </form>
                    </div>
                </section>
            </article>
        </div>
    );
};

export default Private;
