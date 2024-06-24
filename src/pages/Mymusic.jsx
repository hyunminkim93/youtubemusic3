import React, { useContext, useEffect } from 'react';
import useFetchData from '../hook/useFetchData';
import Loading from '../components/Loading';
import Error from '../components/Error';
import Chart from '../components/Chart';
import { MusicPlayerContext } from '../context/MusicPlayerProvider';

const Mymusic = () => {
    const { data: musicData, loading, error } = useFetchData('/data/hyunmin.json');
    const { musicList, setMusicList, removeFromMusicList, playTrack, addTrackToList } = useContext(MusicPlayerContext);

    useEffect(() => {
        if (musicData && musicData.length > 0) {
            setMusicList(musicData);
        }
    }, [musicData, setMusicList]);

    const handleDelete = (index) => {
        removeFromMusicList(index);
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
                onPlay={handlePlayTrack}
            />
        </section>
    );
}

export default Mymusic;
