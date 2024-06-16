import React, { forwardRef, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FcCalendar } from 'react-icons/fc';
import { MdOutlinePlayCircleFilled, MdDelete, MdPlaylistAdd } from 'react-icons/md';
import { MusicPlayerContext } from '../context/MusicPlayerProvider';

const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <button onClick={onClick} ref={ref}>
        <FcCalendar size={24} />
        <span>{value}</span>
    </button>
));

const Chart = ({ title, showCalendar, selectedDate, onDateChange, minDate, maxDate, data, onDelete, onPlay, onAddToPlaylistClick }) => {
    const { addTrackToList, playTrack } = useContext(MusicPlayerContext);

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
                        {data.map((item, index) => (
                            <li key={index}>
                                <span className='rank'>#{index + 1}</span>
                                <span className='img' style={{ backgroundImage: `url(${item.imageURL})` }}></span>
                                <span className='title'>{item.title}</span>
                                {onPlay && (
                                    <span className='play' onClick={(e) => { e.stopPropagation(); onPlay(item); }}>
                                        <MdOutlinePlayCircleFilled /><span className='ir'>재생</span>
                                    </span>
                                )}
                                {onDelete && (
                                    <span className='delete' onClick={(e) => { e.stopPropagation(); onDelete(index); }}>
                                        <MdDelete /><span className='ir'>삭제</span>
                                    </span>
                                )}
                                {onAddToPlaylistClick && (
                                    <span className='add-to-playlist' onClick={(e) => { e.stopPropagation(); onAddToPlaylistClick(item); }}>
                                        <MdPlaylistAdd /><span className='ir'>플레이리스트에 추가</span>
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
            <ToastContainer />
        </>
    );
};

export default Chart;
