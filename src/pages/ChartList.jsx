import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import useFetchData from '../hook/useFetchData';
import Loading from '../components/Loading';
import Error from '../components/Error';
import Chart from '../components/Chart';
import { MusicPlayerContext } from '../context/MusicPlayerProvider';
import axios from 'axios';
import { FaMusic } from "react-icons/fa6";

const ChartList = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { id } = useParams();
    const [selectedDate, setSelectedDate] = useState(yesterday);

    const formattedDate = selectedDate.toISOString().split('T')[0];
    const url = `https://raw.githubusercontent.com/webs9919/music-best/main/${id}/${id}100_${formattedDate}.json`;
    const { data, loading, error } = useFetchData(url);

    const { addTrackToList, playTrack, musicData } = useContext(MusicPlayerContext);

    const handlePlayTrack = async (track) => {
        const trackIndex = musicData.findIndex(item => item.videoID === track.videoID);

        if (trackIndex === -1) {
            try {
                const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                    params: {
                        part: 'snippet',
                        q: track.title,
                        type: 'video',
                        maxResults: 1,
                        key: 'AIzaSyBeYTa9y60nTubhyama5EZjv271IF9OMPw', // YouTube API 키를 여기에 입력하세요
                    },
                });

                if (response.data.items.length > 0) {
                    const video = response.data.items[0];
                    const newTrack = {
                        ...track,
                        videoID: video.id.videoId,
                        imageURL: video.snippet.thumbnails.default.url,
                    };
                    addTrackToList(newTrack); // 목록의 맨 위에 추가
                    playTrack(0); // 첫 번째 트랙 재생
                }
            } catch (error) {
                console.error('YouTube 검색에 실패했습니다.', error);
            }
        } else {
            playTrack(trackIndex);
        }
    };

    if (loading) return <Loading loading={loading} />;
    if (error) return <Error message={error.message} />;

    return (
        <Chart
            title={<><FaMusic /> {`${id} Chart Top 100`}</>}
            data={data}
            showCalendar={true}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            minDate={new Date('2024-05-01')}
            maxDate={yesterday}
            onPlay={handlePlayTrack} // onPlay 함수 전달
        />
    );
    }
export default ChartList;
