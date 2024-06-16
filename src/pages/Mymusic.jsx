import React, { useState, useEffect, useContext } from 'react';
import useFetchData from '../hook/useFetchData';
import Loading from '../components/Loading';
import Error from '../components/Error';
import Chart from '../components/Chart';
import { MusicPlayerContext } from '../context/MusicPlayerProvider';

const Mymusic = () => {
    const { data, loading, error } = useFetchData('./data/hyunmin.json');
    const [musicList, setMusicList] = useState([]);
    const { addTrackToList, playTrack, musicData } = useContext(MusicPlayerContext);

    useEffect(() => {
        const storedMusicList = JSON.parse(localStorage.getItem('musicList'));
        if (storedMusicList) {
            setMusicList(storedMusicList);
        } else if (data) {
            setMusicList(data);
        }
    }, [data]);

    const handleDelete = (index) => {
        const updatedList = [...musicList];
        updatedList.splice(index, 1);
        setMusicList(updatedList);
        localStorage.setItem('musicList', JSON.stringify(updatedList));
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

    if (loading) return <Loading loading={loading} />;
    if (error) return <Error message={error.message} />;

    return (
        <section id='myMusic'>
            <Chart
                title="🎵 나만의 음악 리스트"
                data={musicList}
                showCalendar={false}
                onDelete={handleDelete}
                onPlay={handlePlayTrack} // onPlay 함수 전달
            />
        </section>
    );
}

export default Mymusic;
