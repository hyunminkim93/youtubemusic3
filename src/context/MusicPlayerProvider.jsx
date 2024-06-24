import React, { createContext, useEffect, useState } from 'react';

// 음악 플레이어 컨텍스트 생성
export const MusicPlayerContext = createContext();

const MusicPlayerProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [played, setPlayed] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isShuffling, setIsShuffling] = useState(false);
    const [isRepeating, setIsRepeating] = useState(false);
    const [musicData, setMusicData] = useState([]);
    const [musicList, setMusicList] = useState([]);

    useEffect(() => {
        const savedMusicData = localStorage.getItem('musicData');
        if (savedMusicData) {
            setMusicData(JSON.parse(savedMusicData));
        } else {
            fetchMusicData();
        }
        
        const savedMusicList = localStorage.getItem('musicList');
        if (savedMusicList) {
            setMusicList(JSON.parse(savedMusicList));
        }
    }, []);

    const fetchMusicData = async () => {
        try {
            const response = await fetch(`${process.env.PUBLIC_URL}/data/hyunmin.json`);
            const data = await response.json();
            setMusicData(data);
        } catch (error) {
            console.error('데이터를 가져오는데 실패했습니다.', error);
        }
    };

    const playTrack = (index) => {
        setCurrentTrackIndex(index);
        setCurrentTrack(musicData[index]);
        setIsPlaying(true);
        setPlayed(0);
    };

    const pauseTrack = () => {
        setIsPlaying(false);
    };

    const nextTrack = () => {
        if (isShuffling) {
            const randomIndex = Math.floor(Math.random() * musicData.length);
            setCurrentTrackIndex(randomIndex);
            setCurrentTrack(musicData[randomIndex]);
        } else {
            const nextIndex = (currentTrackIndex + 1) % musicData.length;
            setCurrentTrackIndex(nextIndex);
            setCurrentTrack(musicData[nextIndex]);
        }
        setIsPlaying(true);
        setPlayed(0);
    };

    const prevTrack = () => {
        const prevIndex = (currentTrackIndex - 1 + musicData.length) % musicData.length;
        setCurrentTrackIndex(prevIndex);
        setCurrentTrack(musicData[prevIndex]);
        setIsPlaying(true);
        setPlayed(0);
    };

    const updatePlayed = (played) => {
        setPlayed(played);
    };

    const updateDuration = (duration) => {
        setDuration(duration);
    };

    const toggleShuffle = () => {
        setIsShuffling(!isShuffling);
    };

    const toggleRepeat = () => {
        setIsRepeating(!isRepeating);
    };

    const handleTrackEnd = () => {
        if (isRepeating) {
            setPlayed(0);
            setIsPlaying(true);
        } else {
            nextTrack();
        }
    };

    const addTrackToList = (track) => {
        const updatedMusicData = [track, ...musicData];
        setMusicData(updatedMusicData);
        localStorage.setItem('musicData', JSON.stringify(updatedMusicData));
    };

    const addTrackToEnd = (track) => {
        const updatedMusicData = [...musicData, track];
        setMusicData(updatedMusicData);
        localStorage.setItem('musicData', JSON.stringify(updatedMusicData));
    };

    const removeTrack = (index) => {
        const updatedMusicData = musicData.filter((_, i) => i !== index);
        setMusicData(updatedMusicData);
        localStorage.setItem('musicData', JSON.stringify(updatedMusicData));
        if (currentTrackIndex === index) {
            const newIndex = index === musicData.length - 1 ? 0 : index;
            playTrack(newIndex);
        } else if (currentTrackIndex > index) {
            setCurrentTrackIndex((prevIndex) => prevIndex - 1);
        }
    };

    const addToMusicList = (track) => {
        const updatedMusicList = [...musicList, track];
        setMusicList(updatedMusicList);
        localStorage.setItem('musicList', JSON.stringify(updatedMusicList));
    };

    const removeFromMusicList = (index) => {
        const updatedMusicList = musicList.filter((_, i) => i !== index);
        setMusicList(updatedMusicList);
        localStorage.setItem('musicList', JSON.stringify(updatedMusicList));
    };

    return (
        <MusicPlayerContext.Provider
            value={{
                musicData,
                musicList,
                currentTrack,
                currentTrackIndex,
                isPlaying,
                played,
                duration,
                playTrack,
                pauseTrack,
                nextTrack,
                prevTrack,
                updatePlayed,
                updateDuration,
                isShuffling,
                toggleShuffle,
                isRepeating,
                toggleRepeat,
                handleTrackEnd,
                addTrackToList,
                addTrackToEnd,
                removeTrack,
                addToMusicList,
                removeFromMusicList,
            }}
        >
            {children}
        </MusicPlayerContext.Provider>
    );
};

export default MusicPlayerProvider;
