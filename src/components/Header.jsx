import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { FcRating, FcPlus, FcApproval } from "react-icons/fc";
import { IoMusicalNotes, IoTrash } from "react-icons/io5"; // import IoTrash correctly

const Header = () => {
    const [showInput, setShowInput] = useState(false); // 입력 박스 표시 여부 상태
    const [newItem, setNewItem] = useState(''); // 새 항목의 제목 상태
    const [playlists, setPlaylists] = useState([]); // 플레이리스트 배열 상태
    const navigate = useNavigate();

    useEffect(() => {
        const playlistCount = Number(localStorage.getItem('playlistCount') || 0);
        const loadedPlaylists = [];
        for (let i = 1; i <= playlistCount; i++) {
            const playlistKey = `playlist${i}`;
            const playlist = JSON.parse(localStorage.getItem(playlistKey));
            if (playlist) {
                loadedPlaylists.push(playlist);
            }
        }
        setPlaylists(loadedPlaylists);
    }, []);

    const handleAddClick = () => {
        setShowInput(true); // 'Create' 버튼 클릭 시 입력 박스 표시
    };

    const handleInputChange = (e) => {
        setNewItem(e.target.value); // 입력 박스의 값이 변경될 때 상태 업데이트
    };

    const handleAddItem = () => {
        if (newItem.trim() !== '') { // 입력 값이 비어있지 않은 경우
            const newCount = playlists.length + 1; // 새로운 플레이리스트 번호
            const playlistKey = `playlist${newCount}`; // 플레이리스트 키 (예: playlist1, playlist2)
            const newPlaylist = {
                id: playlistKey,
                name: newItem, // 입력 받은 이름으로 플레이리스트 생성
                items: [] // 초기 항목 배열
            };

            // 로컬 스토리지에 새로운 플레이리스트와 개수를 저장
            localStorage.setItem(playlistKey, JSON.stringify(newPlaylist));
            localStorage.setItem('playlistCount', newCount.toString());

            // 상태 업데이트
            setPlaylists([...playlists, newPlaylist]); // 새로운 플레이리스트를 배열에 추가
            setNewItem(''); // 입력 값 초기화
            setShowInput(false); // 입력 박스 숨기기
        }
    };

    const handleCancel = () => {
        setNewItem(''); // 입력 값 초기화
        setShowInput(false); // 입력 박스 숨기기
    };

    const handleDeletePlaylist = (key) => {
        localStorage.removeItem(key); // 로컬 스토리지에서 해당 플레이리스트 삭제
        const updatedPlaylists = playlists.filter(playlist => playlist.id !== key);
        setPlaylists(updatedPlaylists);

        const updatedCount = updatedPlaylists.length;
        localStorage.setItem('playlistCount', updatedCount.toString());

        // 플레이리스트 재정렬
        updatedPlaylists.forEach((playlist, index) => {
            const newKey = `playlist${index + 1}`;
            localStorage.setItem(newKey, JSON.stringify({ ...playlist, id: newKey }));
        });

        // 불필요한 키 제거
        for (let i = updatedCount + 1; i <= playlists.length; i++) {
            localStorage.removeItem(`playlist${i}`);
        }

        // 현재 페이지가 삭제된 플레이리스트 페이지인 경우 홈으로 리디렉션
        navigate('/');
    };

    return (
        <header id='header' role='banner'>
            <h1 className='logo'>
                <Link to='/'><IoMusicalNotes />Soundgallery</Link> {/* 메인 페이지로 링크 */}
            </h1>
            <h2>음악차트</h2>
            <ul>
                <li><Link to='chart/melon'><span className='icon'></span>Melon Chart</Link></li>
                <li><Link to='chart/bugs'><span className='icon'></span>Bugs Chart</Link></li>
                <li><Link to='chart/apple'><span className='icon'></span>Apple Chart</Link></li>
                <li><Link to='chart/genie'><span className='icon'></span>Genie Chart</Link></li>
                <li><Link to='chart/billboard'><span className='icon'></span>Billboard Chart</Link></li>
            </ul>
            <h2>플레이리스트</h2>
            <ul>
                <li><Link to='/mymusic'><span className='icon2'><FcRating /></span>My Music</Link></li>
                {playlists.map((playlist, index) => (
                    <li key={index} className="playlist-item">
                        <Link to={`/playlist/${playlist.id}`}><span className='icon2'><FcApproval /></span>{playlist.name}</Link>
                        <button className="delete-button" onClick={() => handleDeletePlaylist(playlist.id)}><IoTrash /></button> {/* 플레이리스트 삭제 버튼 */}
                    </li>
                ))}
                <li>
                    {showInput ? (
                        <div className='input-container'>
                            <input
                                type='text'
                                value={newItem}
                                onChange={handleInputChange}
                                className='input-box'
                            />
                            <button onClick={handleAddItem} className='add-button'>추가</button>
                            <button onClick={handleCancel} className='cancel-button'>취소</button>
                        </div>
                    ) : (
                        <Link to='#' onClick={handleAddClick}><span className='icon2'><FcPlus /></span>Create</Link>
                        // 'Create' 버튼 클릭 시 입력 박스 표시
                    )}
                </li>
            </ul>
        </header>
    );
}

export default Header;
