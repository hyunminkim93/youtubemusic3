import React, { createContext, useEffect, useState } from 'react';

// 음악 플레이어 컨텍스트 생성
export const MusicPlayerContext = createContext();

const MusicPlayerProvider = ({children}) => {
    // 현재 트랙 인덱스를 추적하는 상태
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    // 트랙 재생 여부를 관리하는 상태
    const [isPlaying, setIsPlaying] = useState(false);
    // 재생된 시간을 추적하는 상태
    const [played, setPlayed] = useState(0);
    // 트랙의 총 길이를 저장하는 상태
    const [duration, setDuration] = useState(0);
    // 셔플 모드를 관리하는 상태
    const [isShuffling, setIsShuffling] = useState(false);
    // 반복 모드를 관리하는 상태
    const [isRepeating, setIsRepeating] = useState(false);
    // 음악 데이터를 저장하는 상태
    const [musicData, setMusicData] = useState([]);

    // 특정 인덱스의 트랙을 재생하는 함수
    const playTrack = (index) => {
        setCurrentTrackIndex(index);
        setIsPlaying(true);
        setPlayed(0);
    };

    // 트랙을 일시정지하는 함수
    const pauseTrack = () => {
        setIsPlaying(false);
    };

    // 다음 트랙을 재생하는 함수
    const nextTrack = () => {
        if (isShuffling) {
            // 셔플 모드인 경우 랜덤 인덱스를 설정
            setCurrentTrackIndex(Math.floor(Math.random() * musicData.length));
        } else {
            // 셔플 모드가 아닌 경우 다음 인덱스로 설정
            setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % musicData.length);
        }
        setIsPlaying(true);
        setPlayed(0);
    };

    // 이전 트랙을 재생하는 함수
    const prevTrack = () => {
        setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + musicData.length) % musicData.length);
        setIsPlaying(true);
        setPlayed(0);
    };

    // 재생된 시간을 업데이트하는 함수
    const updatePlayed = (played) => {
        setPlayed(played);
    };

    // 트랙의 총 길이를 업데이트하는 함수
    const updateDuration = (duration) => {
        setDuration(duration);
    };

    // 셔플 모드를 토글하는 함수
    const toggleShuffle = () => {
        setIsShuffling(!isShuffling);
    };

    // 반복 모드를 토글하는 함수
    const toggleRepeat = () => {
        setIsRepeating(!isRepeating);
    };

    // 트랙이 끝났을 때 처리하는 함수
    const handleTrackEnd = () => {
        if (isRepeating) {
            // 반복 모드인 경우 재생 시간을 초기화하고 재생 상태 유지
            setPlayed(0);
            setIsPlaying(true);
        } else {
            // 반복 모드가 아닌 경우 다음 트랙 재생
            nextTrack();
        }
    };

    // 재생 목록에 트랙을 추가하는 함수
    const addTrackToList = (track) => {
        setMusicData((prevMusicData) => [track, ...prevMusicData]);
    };

    // 재생 목록의 끝에 트랙을 추가하는 함수
    const addTrackToEnd = (track) => {
        setMusicData((prevMusicData) => [...prevMusicData, track]);
    };

    // 컴포넌트가 마운트될 때 음악 데이터를 가져오는 효과
    useEffect(() => {
        const fetchData = async () => {
            try {
                // JSON 파일에서 음악 데이터 가져오기
                const response = await fetch(`${process.env.PUBLIC_URL}/data/hyunmin.json`);
                const data = await response.json();
                setMusicData(data);
            } catch (error) {
                console.error('데이터를 가져오는데 실패했습니다.', error);
            }
        };
        fetchData();
    }, []);
    
    // 컨텍스트 프로바이더를 사용하여 자식 컴포넌트에 상태와 함수를 전달
    return (
        <MusicPlayerContext.Provider 
        value={{
            musicData,
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
            addTrackToEnd
        }}>
        {children}
        </MusicPlayerContext.Provider>
    )
}
export default MusicPlayerProvider;
