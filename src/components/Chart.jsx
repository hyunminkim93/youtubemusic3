import React, { forwardRef, useContext, useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './Modal';

import { FcCalendar } from 'react-icons/fc';
import { MdOutlinePlayCircleFilled, MdClose, MdHive } from 'react-icons/md';
import { MusicPlayerContext } from '../context/MusicPlayerProvider';

const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <button onClick={onClick} ref={ref}>
        <FcCalendar size={24} />
        <span>{value}</span>
    </button>
));

const Chart = ({ title, showCalendar, selectedDate, onDateChange, minDate, maxDate, data }) => {
    const { addTrackToList, playTrack } = useContext(MusicPlayerContext);

    const [youtubeResults, setYoutubeResults] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [chartData, setChartData] = useState(data);

    const searchYoutube = async (query) => {
        try {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    q: query,
                    type: 'video',
                    maxResults: 5,
                    key: 'AIzaSyD4T3BJpx0Bjm6P9ZPuqKT2iSpcGbzgWCU',
                },
            });
            setYoutubeResults(response.data.items);
        } catch (error) {
            console.error('YouTube 검색에 실패했습니다.', error);
        }
    };

    const handleItemClick = (title) => {
        setSelectedTitle(title);
        searchYoutube(title);
    };

    const handlePlayNow = (result) => {
        const newTrack = {
            title: result.snippet.title,
            videoID: result.id.videoId,
            imageURL: result.snippet.thumbnails.default.url,
            artist: result.snippet.channelTitle,
            rank: 1
        };
        addTrackToList(newTrack);
        playTrack(0);
    };

    const handleAddToPlaylistClick = (result) => {
        setSelectedTrack({
            title: result.snippet.title,
            videoID: result.id.videoId,
            imageURL: result.snippet.thumbnails.default.url,
            artist: result.snippet.channelTitle,
            rank: 1
        });
        setIsModalOpen(true);
    };

    const handleAddToPlaylist = (playlistId) => {
        const playlist = JSON.parse(localStorage.getItem(playlistId));
        if (playlist && selectedTrack) {
            playlist.items.push(selectedTrack);
            localStorage.setItem(playlistId, JSON.stringify(playlist));
        }
    };

    const handleRemoveChartItem = (index) => {
        setChartData(prevData => prevData.filter((_, i) => i !== index));
    };

    const handleRemoveResult = (index) => {
        setYoutubeResults(prevResults => prevResults.filter((_, i) => i !== index));
    };

    return (
        <>
            <section className='music-chart'>
                <div className="title">
                    <h2>{title}</h2>
                    {showCalendar && (
                        <div className='date'>
                            <DatePicker
                                selected={selectedDate}
                                onChange={onDateChange}
                                dateFormat="yyyy-MM-dd"
                                minDate={minDate}
                                maxDate={maxDate}
                                customInput={<CustomInput />}
                            />
                        </div>
                    )}
                </div>
                <div className="list">
                    <ul>
                        {chartData.sort((a, b) => a.rank - b.rank).map((item, index) => (
                            <li key={index}>
                                <span className='rank'>#{index + 1}</span>
                                <span className='img' style={{ backgroundImage: `url(${item.imageURL})` }}></span>
                                <span className='title' onClick={() => handleItemClick(item.title)}>{item.title}</span>
                                <span className='remove' onClick={() => handleRemoveChartItem(index)}>
                                    <MdClose /><span className='ir'>삭제하기</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
            {youtubeResults.length > 0 && (
                <section className='youtube-result'>
                    <h3>"{selectedTitle}"에 대한 유튜브 검색 결과입니다.</h3>
                    <ul>
                        {youtubeResults.map((result, index) => (
                            <li key={index}>
                                <span className='img' style={{ backgroundImage: `url(${result.snippet.thumbnails.default.url})` }}></span>
                                <span className='title'>{result.snippet.title}</span>
                                <span className='playNow' onClick={() => handlePlayNow(result)}>
                                    <MdOutlinePlayCircleFilled /><span className='ir'>노래듣기</span>
                                </span>
                                <span className='chartAdd' onClick={() => handleAddToPlaylistClick(result)}>
                                    <MdHive /><span className='ir'>나의 리스트에 추가하기</span>
                                </span>
                                <span className='remove' onClick={() => handleRemoveResult(index)}>
                                    <MdClose /><span className='ir'>삭제하기</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                    <span className='close' onClick={() => setYoutubeResults([])}><MdClose /></span>
                </section>
            )}
            <ToastContainer />
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddToPlaylist={handleAddToPlaylist}
            />
        </>
    )
}

export default Chart;
