import React from 'react';
import styles from '../../styles/KnowMoreModal.module.css';

interface KnowMoreModalProps {
    onClose: () => void;
    data: {
        text?: string;
        url?: string; // External link
        imageUrl?: string;
        youtubeUrl?: string; // YouTube video URL
        title?: string;
    };
}

export default function KnowMoreModal({ onClose, data }: KnowMoreModalProps) {

    // Extract YouTube ID if full URL provided
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const youTubeId = data.youtubeUrl ? getYouTubeId(data.youtubeUrl) : null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContainer} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        <span className={styles.icon}>💡</span>
                        Know More
                    </h2>
                    <button onClick={onClose} className={styles.closeBtn}>✕</button>
                </div>

                <div className={styles.content}>
                    {/* Description Text */}
                    {data.text && (
                        <div className={styles.description}>
                            {data.text}
                        </div>
                    )}

                    {/* YouTube Video */}
                    {youTubeId && (
                        <div className={styles.videoContainer}>
                            <iframe
                                width="100%"
                                height="315"
                                src={`https://www.youtube.com/embed/${youTubeId}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                            <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                <a
                                    href={data.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#4caf50', textDecoration: 'none', fontSize: '14px' }}
                                >
                                    ⚠️ Video not playing? Watch on YouTube
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Image */}
                    {data.imageUrl && (
                        <div className={styles.imageContainer}>
                            <img src={data.imageUrl} alt="Reference" className={styles.image} />
                        </div>
                    )}

                    {/* External Link Button */}
                    {data.url && (
                        <div className={styles.linkContainer}>
                            <a
                                href={data.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.linkBtn}
                            >
                                <span>🔗</span> Read Full Article
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
