import storage, { generateId } from './storage';

/**
 * Populates localStorage with sample data the first time the app runs,
 * so the project is immediately explorable without manual setup.
 * Safe to call on every load - it only seeds if no users exist yet.
 */
export function seedIfEmpty() {
  const existingUsers = storage.getUsers();
  if (existingUsers.length > 0) return;

  const now = Date.now();
  const daysAgo = (n) => new Date(now - n * 86400000).toISOString();

  const users = [
    {
      id: 'usr_seed_asad',
      name: 'Asad Khan',
      email: 'asad@test.com',
      password: 'Password123',
      bio: 'React developer from Lahore. Coffee-powered.',
      location: 'Lahore, Pakistan',
      avatar: 'https://i.pravatar.cc/150?img=12',
      coverImage: null,
      bookmarks: [],
      joinedAt: daysAgo(60),
    },
    {
      id: 'usr_seed_hina',
      name: 'Hina Raza',
      email: 'hina@test.com',
      password: 'Password123',
      bio: 'Designer & photographer. Always exploring new places.',
      location: 'Karachi, Pakistan',
      avatar: 'https://i.pravatar.cc/150?img=32',
      coverImage: null,
      bookmarks: [],
      joinedAt: daysAgo(45),
    },
  ];

  const posts = [
    {
      id: 'post_seed_1',
      authorId: 'usr_seed_asad',
      description: 'Hello everyone! This is my first post on SocialApp. Excited to be here!',
      image: null,
      isPublic: true,
      isDraft: false,
      createdAt: daysAgo(10),
      updatedAt: daysAgo(10),
    },
    {
      id: 'post_seed_2',
      authorId: 'usr_seed_hina',
      description: 'Sunset from my rooftop today. Karachi skies never disappoint.',
      image: 'https://picsum.photos/seed/sunset1/800/500',
      isPublic: true,
      isDraft: false,
      createdAt: daysAgo(8),
      updatedAt: daysAgo(8),
    },
    {
      id: 'post_seed_3',
      authorId: 'usr_seed_asad',
      description: 'Finally shipped a big feature at work today. Feels great to see it live!',
      image: null,
      isPublic: true,
      isDraft: false,
      createdAt: daysAgo(6),
      updatedAt: daysAgo(6),
    },
    {
      id: 'post_seed_4',
      authorId: 'usr_seed_hina',
      description: 'Working on a new mockup for a client. Loving how this palette is turning out.',
      image: 'https://picsum.photos/seed/design2/800/500',
      isPublic: true,
      isDraft: false,
      createdAt: daysAgo(4),
      updatedAt: daysAgo(4),
    },
    {
      id: 'post_seed_5',
      authorId: 'usr_seed_asad',
      description: 'Draft: thoughts on React 19 that I am not ready to publish yet.',
      image: null,
      isPublic: true,
      isDraft: true,
      createdAt: daysAgo(2),
      updatedAt: daysAgo(2),
    },
    {
      id: 'post_seed_6',
      authorId: 'usr_seed_hina',
      description: 'A private note to self - remember to back up the portfolio site this weekend.',
      image: null,
      isPublic: false,
      isDraft: false,
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
    },
  ];

  const comments = [
    {
      id: 'cmt_seed_1',
      postId: 'post_seed_1',
      authorId: 'usr_seed_hina',
      text: 'Welcome to SocialApp! Great to have you here.',
      createdAt: daysAgo(9),
    },
    {
      id: 'cmt_seed_2',
      postId: 'post_seed_2',
      authorId: 'usr_seed_asad',
      text: 'Stunning shot! What camera did you use?',
      createdAt: daysAgo(7),
    },
    {
      id: 'cmt_seed_3',
      postId: 'post_seed_2',
      authorId: 'usr_seed_hina',
      text: 'Thank you! Just my phone actually.',
      createdAt: daysAgo(7),
    },
  ];

  const likes = [
    { id: 'like_seed_1', postId: 'post_seed_1', userId: 'usr_seed_hina', createdAt: daysAgo(9) },
    { id: 'like_seed_2', postId: 'post_seed_2', userId: 'usr_seed_asad', createdAt: daysAgo(7) },
    { id: 'like_seed_3', postId: 'post_seed_4', userId: 'usr_seed_asad', createdAt: daysAgo(3) },
  ];

  storage.setUsers(users);
  storage.setPosts(posts);
  storage.setComments(comments);
  storage.setLikes(likes);
}

export default seedIfEmpty;
