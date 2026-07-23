"use client";

import React from 'react';
import styles from './team.module.css';

// SVG Icons for social links matching the image
const FbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const TWIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
);
const LIIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

import React from 'react';
const TeamMember = React.memo(function TeamMember({ member, isCenter, positionClass, onClick }) {
  const { name, title, image } = member;

  return (
    <div 
      className={`${styles.teamMemberWrapper} ${positionClass}`}
      onClick={() => onClick(member)}
    >
      <div className={styles.profileImageContainer}>
        <img 
          src={image} 
          alt={name} 
          className={styles.profileImage} 
        />
      </div>

      <div className={styles.infoBlock}>
        <h3 className={styles.memberNameSmall}>{name}</h3>
        <p className={styles.memberRoleSmall}>{title}</p>
        
        <div className={styles.socialIcons}>
          <div className={styles.socialCircle}><FbIcon /></div>
          <div className={styles.socialCircle}><TWIcon /></div>
          <div className={styles.socialCircle}><LIIcon /></div>
        </div>
      </div>
    </div>
  );
});

export default TeamMember;
