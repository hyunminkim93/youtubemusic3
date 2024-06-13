import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { FcRating, FcPlus, FcApproval } from "react-icons/fc";
import { IoMusicalNotes } from "react-icons/io5";

const Header = () => {
    const [showInput, setShowInput] = useState(false); // 입력 박스 표시 여부 상태
    const [newItem, setNewItem] = useState(''); // 새 항목의 제목 상태
    const [playlistCount, setPlaylistCount] = useState(0); // 플레이리스트 개수 상태

    useEffect(() => {
        // 컴포넌트가 마운트될 때 로컬 스토리지에서 플레이리스트 개수를 가져와 상태 업데이트
        const count = localStorage.getItem('playlistCount') || 0; 
        setPlaylistCount(Number(count)); // 상태 업데이트
    }, []);

    const handleAddClick = () => {
        setShowInput(true); // 'Create' 버튼 클릭 시 입력 박스 표시
    };

    const handleInputChange = (e) => {
        setNewItem(e.target.value); // 입력 박스의 값이 변경될 때 상태 업데이트
    };

    const handleAddItem = () => {
        if (newItem.trim() !== '') { // 입력 값이 비어있지 않은 경우
            const newCount = playlistCount + 1; // 새로운 플레이리스트 번호
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
            setPlaylistCount(newCount); 
            setNewItem(''); // 입력 값 초기화
            setShowInput(false); // 입력 박스 숨기기
        }
    };

    const playlistLinks = []; // 플레이리스트 링크를 저장할 배열
    for (let i = 1; i <= playlistCount; i++) {
        const playlistKey = `playlist${i}`; // 각 플레이리스트 키 생성
        const playlist = JSON.parse(localStorage.getItem(playlistKey)); // 로컬 스토리지에서 플레이리스트 가져옴
        playlistLinks.push(
            <li key={i}>
                <Link to={`/playlist/${playlistKey}`}><span className='icon2'><FcApproval /></span>{playlist.name}</Link>
            </li>
        );
    }

    return (
        <header id='header' role='banner'>
            <h1 className='logo'>
                <Link to='/'><IoMusicalNotes />나의 뮤직 챠트</Link> {/* 메인 페이지로 링크 */}
            </h1>
            <h2>chart</h2>
            <ul>
                <li><Link to='chart/melon'><span className='icon'></span>멜론 챠트</Link></li>
                <li><Link to='chart/bugs'><span className='icon'></span>벅스 챠트</Link></li>
                <li><Link to='chart/apple'><span class='icon'></span>애플 챠트</Link></li>
                <li><Link to='chart/genie'><span className='icon'></span>지니 챠트</Link></li>
                <li><Link to='chart/billboard'><span className='icon'></span>빌보드 챠트</Link></li>
            </ul>
            <h2>playlist</h2>
            <ul>
                <li><Link to='/mymusic'><span className='icon2'><FcRating /></span>Mymusic</Link></li>
                {playlistLinks} {/* 동적으로 생성된 플레이리스트 링크 */}
                <li>
                    {showInput ? (
                        <div>
                            <input
                                type='text'
                                value={newItem}
                                onChange={handleInputChange}
                            />
                            <button onClick={handleAddItem}>ADD</button>
                            
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
