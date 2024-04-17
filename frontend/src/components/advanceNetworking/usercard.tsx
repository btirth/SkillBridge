import React from 'react';

interface User {
  id: string;
  name: string;
  designation: string;
  company: string;
  profilePicture: string;
}

interface Props {
  user: User;
  onSendConnection: (userId: string) => void;
}

const UserCard: React.FC<Props> = ({ user, onSendConnection }) => {
  const { name, designation, company, profilePicture } = user;

  const handleSendConnection = () => {
    onSendConnection(user.id);
  };

  return (
    <div className="user-card">
      <div className="user-avatar">
        <img src={profilePicture} alt={`${name}'s avatar`} />
      </div>
      <div className="user-info">
        <h2>{name}</h2>
        <p>{designation}</p>
        <p>{company}</p>
      </div>
      <button onClick={handleSendConnection}>Send Connection</button>
    </div>
  );
};

export default UserCard;
