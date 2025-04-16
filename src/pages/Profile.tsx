import React from 'react';
import ProfilePage from '../components/ProfilePage';

interface ProfileProps {
  userType: 'client' | 'provider' | null;
}

const Profile: React.FC<ProfileProps> = ({ userType }) => {
  return <ProfilePage userType={userType} />;
};

export default Profile;