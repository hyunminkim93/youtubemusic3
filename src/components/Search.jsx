import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { LuSearch } from 'react-icons/lu';
import { MdOutlinePlayCircleFilled, MdPlaylistAdd } from 'react-icons/md';
import { MusicPlayerContext } from '../context/MusicPlayerProvider';
import Modal from './Modal';
import Notification from '../Notification'; // Notification 컴포넌트 임포트

const jsonFiles = [
    '/data/byunghyun.json',
    '/data/daewon.json',
    '/data/hyeji_list.json',
    '/data/hyunmin.json',
    '/data/jungmin.json',
    '/data/seongmin.json',
    '/data/seonhwa.json',
    '/data/seoyeon.json',
    '/data/sohyun.json',
    '/data/yihyun.json',
];

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [notification, setNotification] = useState(null); // 알림 상태 추가
    const inputRef = useRef(null);
    const resultsRef = useRef(null);
    const { addTrackToList, playTrack, musicData } = useContext(MusicPlayerContext);

    useEffect(() => {
        const fetchData = async () => {
            let allData = [];
            for (const file of jsonFiles) {
                try {
                    const response = await axios.get(file);
                    allData = allData.concat(response.data);
                } catch (error) {
                    console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
                }
            }
            setData(allData);
        };

        fetchData();
    }, []);

    useEffect(() => {
        setFilteredData(
            data.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.artist.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, data]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                inputRef.current && !inputRef.current.contains(event.target) &&
                resultsRef.current && !resultsRef.current.contains(event.target)
            ) {
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handlePlayTrack = (track) => {
        const trackIndex = musicData.findIndex(item => item.videoID === track.videoID);
        if (trackIndex === -1) {
            addTrackToList(track);
            playTrack(0);
        } else {
            playTrack(trackIndex);
        }
    };

    const handleAddToPlaylistClick = (track) => {
        setSelectedTrack(track);
        setIsModalOpen(true);
    };

    const handleAddToPlaylist = (playlistId) => {
        const playlist = JSON.parse(localStorage.getItem(playlistId));
        if (playlist && selectedTrack) {
            playlist.items.push(selectedTrack);
            localStorage.setItem(playlistId, JSON.stringify(playlist));
            setNotification('리스트에 추가되었습니다.'); // 알림 설정
        }
    };

    return (
        <div className="search-container">
            <article className="search">
                <div className="search-input-wrapper">
                    <LuSearch className="search-icon" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="검색"
                        id="searchInput"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                    />
                </div>
                {isFocused && searchTerm && (
                    <ul className="search-results fade-in" ref={resultsRef}>
                        {filteredData.map((item, index) => (
                            <li key={index}>
                                <img src={item.imageURL} alt={item.title} className="result-image" />
                                <div>
                                    <h2>{item.title}</h2>
                                    <p>{item.artist}</p>
                                </div>
                                <div className="icons">
                                    <MdOutlinePlayCircleFilled onClick={() => handlePlayTrack(item)} />
                                    <MdPlaylistAdd onClick={() => handleAddToPlaylistClick(item)} />
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </article>
            {notification && (
                <Notification 
                    message={notification}
                    onClose={() => setNotification(null)}
                />
            )}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddToPlaylist={handleAddToPlaylist}
            />
        </div>
    );
};

export default Search;
