import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Chart from '../components/Chart';
import { MusicPlayerContext } from '../context/MusicPlayerProvider';


const Playlist = () => {
    const { id } = useParams();
    const [playlist, setPlaylist] = useState({ name: '', items: [] });
    const { addTrackToList, playTrack, musicData } = useContext(MusicPlayerContext);

    useEffect(() => {
        const storedPlaylist = JSON.parse(localStorage.getItem(id)) || { name: '', items: [] };
        setPlaylist(storedPlaylist);
    }, [id]);

    const handleDelete = (index) => {
        const updatedItems = [...playlist.items];
        updatedItems.splice(index, 1);
        const updatedPlaylist = { ...playlist, items: updatedItems };
        setPlaylist(updatedPlaylist);
        localStorage.setItem(id, JSON.stringify(updatedPlaylist));
    };

    const handlePlayTrack = (track) => {
        const trackIndex = musicData.findIndex(item => item.videoID === track.videoID);
        if (trackIndex === -1) {
            addTrackToList(track);
            playTrack(0);
        } else {
            playTrack(trackIndex);
        }
    };

    return (
        <section id="playlist">
            {playlist.items.length > 0 ? (
                <Chart
                    title={`🎵  ${playlist.name} 리스트`}
                    data={playlist.items}
                    showCalendar={false}
                    onDelete={handleDelete}
                    onPlay={handlePlayTrack} // onPlay 함수 전달
                />
            ) : (
                <section className='music-chart'>
                    <div className="title">
                        <h2>{`🎵  ${playlist.name}`}</h2>
                    </div>
                    <div className="list">
                        <ul>
                            <li>!!아직 리스트가 없습니다. 노래를 추가해주세요!</li>
                        </ul>
                    </div>
                </section>
            )}
        </section>
    );
}

export default Playlist;
