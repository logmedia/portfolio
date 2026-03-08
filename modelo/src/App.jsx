import { Header } from "./components/Header";
import { Post } from "./components/Post";
import { Sidebar } from "./components/Sidebar";

import styles from './App.module.css';
import './global.css';

const profileData = {
  name: 'José Renato',
  role: 'Web Developer',
  avatarUrl: 'https://avatars.githubusercontent.com/u/99501874?v=4',
  coverUrl:
    'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?q=60&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
};

export function App() {

  const handleEditProfile = () => {
    window.alert('Funcionalidade de edição em desenvolvimento.');
  };

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <Sidebar profile={profileData} onEditProfile={handleEditProfile} />
        <main>
            <Post />
            <Post />
        </main>
      </div>
    </>
  )
}

