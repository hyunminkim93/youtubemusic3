import React, { useContext } from 'react';
import useFetchData from '../hook/useFetchData';
import Loading from '../components/Loading';
import Error from '../components/Error';
import Chart from '../components/Chart';
import { MusicPlayerContext } from '../context/MusicPlayerProvider';

const Mymusic = () => {
    const { loading, error } = useFetchData('/data/hyunmin.json'); // data 변수를 사용하지 않으므로 제거했습니다.
    const { musicList, removeFromMusicList, playTrack, addTrackToList, musicData } = useContext(MusicPlayerContext);

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
                onPlay={handlePlayTrack} // onPlay 함수 전달
            />
        </section>
    );
}

export default Mymusic;
