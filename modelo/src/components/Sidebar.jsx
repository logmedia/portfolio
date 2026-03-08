import PropTypes from 'prop-types';
import { PencilLine } from 'phosphor-react';
import styles from './Sidebar.module.css';

const DEFAULT_PROFILE = {
  name: 'José Renato',
  role: 'Web Developer',
  avatarUrl: 'https://avatars.githubusercontent.com/u/99501874?v=4',
  coverUrl:
    'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?q=60&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
};

const noop = () => {};

export function Sidebar({ profile = DEFAULT_PROFILE, onEditProfile = noop }) {
  const { name, role, avatarUrl, coverUrl } = { ...DEFAULT_PROFILE, ...profile };

  return (
    <aside className={styles.sidebar}>
      <img
        className={styles.cover}
        src={coverUrl}
        alt={`Imagem de capa do perfil de ${name}`}
      />
      <div className={styles.profile}>
        <img
          className={styles.avatar}
          src={avatarUrl}
          alt={`Foto de perfil de ${name}`}
        />
        <strong>{name}</strong>
        <span>{role}</span>
      </div>
      <footer>
        <button
          type="button"
          onClick={onEditProfile}
          className={styles.editButton}
          aria-label={`Editar perfil de ${name}`}
        >
          <PencilLine size={20} /> Editar seu perfil
        </button>
      </footer>
    </aside>
  );
}

Sidebar.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
    avatarUrl: PropTypes.string,
    coverUrl: PropTypes.string,
  }),
  onEditProfile: PropTypes.func,
};