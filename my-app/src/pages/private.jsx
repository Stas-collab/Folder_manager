import { signOut } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db as database, storage } from '../firebase';
import DefaultImage from '../image/default.jpg';
import styles from './App.module.css';

const Private = () => {
    const [avatarUrl, setAvatarUrl] = useState(DefaultImage); // Стан для URL аватарки
    const [isHidden, setIsHidden] = useState(true);
    const [folderName, setFolderName] = useState('');
    const [folderColor, setFolderColor] = useState('#ffffff');
    const [folders, setFolders] = useState([]);

    const fileInputRefs = useRef({});
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
    const handleFileUpload = async (folderId, event) => {
        const files = event.target.files;
        if (files.length === 0) return;

        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const fileRef = ref(storage, `folders/${folderId}/${file.name}`);
                await uploadBytes(fileRef, file);
                const fileUrl = await getDownloadURL(fileRef);

                await addDoc(collection(database, `folders/${folderId}/files`), { name: file.name, url: fileUrl });
            });

            await Promise.all(uploadPromises);
            alert('Усі файли завантажено успішно');
        } catch (error) {
            console.error('Помилка при завантаженні файлів:', error);
            alert('Помилка при завантаженні файлів. Спробуйте ще раз.');
        }
    };

    const handleSpanClick = (folderId) => {
        if (fileInputRefs.current[folderId]) {
            fileInputRefs.current[folderId].click();
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
                const userFolders = await Promise.all(
                    querySnapshot.docs.map(async (document_) => {
                        const folderId = document_.id;
                        const filesSnapshot = await getDocs(collection(database, `folders/${folderId}/files`));
                        const files = filesSnapshot.docs.map((fileDoc) => ({ id: fileDoc.id, ...fileDoc.data() }));
                        return { id: folderId, ...document_.data(), files };
                    }),
                );
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
                        <p className={styles.userName}></p>
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
                                <button
                                    data-testid="cypressCrtBtn"
                                    className={styles.crossButton}
                                    onClick={toggleWindow}
                                >
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
                                            <span
                                                className="material-symbols-outlined"
                                                onClick={() => handleSpanClick(folder.id)}
                                            >
                                                attach_file
                                            </span>
                                            <input
                                                type="file"
                                                className={styles.fileInput}
                                                onChange={(event) => handleFileUpload(folder.id, event)}
                                                ref={(ref) => (fileInputRefs.current[folder.id] = ref)}
                                                hidden
                                                multiple
                                            />
                                        </button>
                                    </div>
                                    <div className={styles.fileList}>
                                        <ul className={styles.fileList}>
                                            {folder.files &&
                                                folder.files.map((file) => (
                                                    <li key={file.name}>
                                                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                                                            {file.name}
                                                        </a>
                                                    </li>
                                                ))}
                                        </ul>
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
