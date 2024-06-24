# Youtube API를 이용한 나만의 음악 사이트

<img width="1710" alt="스크린샷 2024-06-17 오후 6 38 44" src="https://github.com/hyunminkim93/youtubemusic3/assets/163366255/23eb3ba3-ff00-4c7b-8635-bec544ef14fc">

# 설치

```
npx create-react-app .
npm i react-router-dom
npm i sass
npm i react-icons
npm i react-player
npm i react-spinners
npm i react-datepicker
npm i react-toastify
npm i react-modal
npm i axios
```

---

#### 개요

React와 YouTube API를 이용하여 개인 맞춤형 음악 사이트를 만드는 것을 목표로 합니다. 사용자는 음악을 검색하고, 플레이리스트에 노래를 추가하며, 이를 관리할 수 있습니다.

---

#### 주요 기능

1. **검색 기능**

   - YouTube API를 활용하여 음악 검색 기능 구현
   - 사용자가 검색어를 입력하면 관련 음악 리스트를 표시

2. **플레이리스트 관리**

   - 사용자가 원하는 음악을 플레이리스트에 추가
   - 플레이리스트에서 음악을 삭제하는 기능 추가

   ![alt text](/src/assets/img/list.png)

3. **차트 기능**

   - 여러 음악 차트를 기반으로 인기 음악을 확인할 수 있는 기능

   ![alt text](/src/assets/img/chart.png)

4. **마이 뮤직**

   - 사용자가 즐겨 듣는 음악을 모아놓은 개인 플레이리스트

   ![alt text](/src/assets/img/mymusic.png)

---

#### 개발 과정에서의 어려움

1. **검색 기능 구현 문제**

   - `axios`를 사용하여 여러 JSON 파일에서 데이터를 가져오는 로직 구현이 까다로웠음.
   - 여러 JSON 파일에서 데이터를 가져와 하나의 배열로 합치는 방식으로 구현되어 있음.
     ```jsx
     useEffect(() => {
       const fetchData = async () => {
         let allData = [];
         for (const file of jsonFiles) {
           try {
             const response = await axios.get(file);
             allData = allData.concat(response.data);
           } catch (error) {
             console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
           }
         }
         setData(allData);
       };
       fetchData();
     }, []);
     ```
   - 검색어 입력 시, 해당 검색어가 포함된 제목이나 아티스트를 가진 데이터를 필터링하여 표시하는 로직에서 문제가 발생함.
   - 검색어를 입력하면 `searchTerm` 상태가 업데이트되고, 이 상태를 기반으로 데이터를 필터링하여 `filteredData`에 저장함.
     ```jsx
     useEffect(() => {
       setFilteredData(
         data.filter(
           (item) =>
             item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             item.artist.toLowerCase().includes(searchTerm.toLowerCase())
         )
       );
     }, [searchTerm, data]);
     ```
   - 클릭 이벤트 핸들링 및 검색 결과 외부 클릭 시 검색 결과가 닫히도록 하는 기능 구현에 어려움을 겪음. 이를 위해 `useRef`와 `useEffect`를 활용하여 외부 클릭을 감지하는 로직을 구현함.

     ```jsx
     useEffect(() => {
       const handleClickOutside = (event) => {
         if (
           inputRef.current &&
           !inputRef.current.contains(event.target) &&
           resultsRef.current &&
           !resultsRef.current.contains(event.target)
         ) {
           setIsFocused(false);
         }
       };

       document.addEventListener("mousedown", handleClickOutside);
       return () => {
         document.removeEventListener("mousedown", handleClickOutside);
       };
     }, []);
     ```

2. **음악 플레이어 컨텍스트 관리**

   - 음악 재생 관련 상태와 함수를 관리하는 컨텍스트를 생성하고 제공하는 과정에서 어려움이 있었음.
   - 로컬 스토리지에서 데이터를 불러오고 저장하는 로직을 구현하는 데 시간이 걸렸음.

     ```jsx
     useEffect(() => {
       const savedMusicData = localStorage.getItem("musicData");
       if (savedMusicData) {
         setMusicData(JSON.parse(savedMusicData));
       } else {
         fetchMusicData();
       }

       const savedMusicList = localStorage.getItem("musicList");
       if (savedMusicList) {
         setMusicList(JSON.parse(savedMusicList));
       }
     }, []);
     ```

   - 트랙 재생, 일시정지, 다음 트랙 재생, 이전 트랙 재생 등의 기능을 구현하는 과정에서 상태 관리의 복잡성으로 인해 어려움을 겪음. 예를 들어, 다음 트랙 재생 기능은 다음과 같이 구현됨.
     ```jsx
     const nextTrack = () => {
       if (isShuffling) {
         const randomIndex = Math.floor(Math.random() * musicData.length);
         setCurrentTrackIndex(randomIndex);
         setCurrentTrack(musicData[randomIndex]);
       } else {
         const nextIndex = (currentTrackIndex + 1) % musicData.length;
         setCurrentTrackIndex(nextIndex);
         setCurrentTrack(musicData[nextIndex]);
       }
       setIsPlaying(true);
       setPlayed(0);
     };
     ```

3. **모달 창 구현**

   - 플레이리스트에 노래를 추가할 수 있는 모달 창을 구현하는 과정에서 어려움이 있었음.
   - 로컬 스토리지에서 플레이리스트를 불러와 모달 창에 표시하고, 선택한 플레이리스트에 노래를 추가하는 로직을 구현하는 데 시간이 걸렸음.
     ```jsx
     useEffect(() => {
       if (isOpen) {
         const count = Number(localStorage.getItem("playlistCount")) || 0;
         const loadedPlaylists = [];
         for (let i = 1; i <= count; i++) {
           const playlistKey = `playlist${i}`;
           const playlist = JSON.parse(localStorage.getItem(playlistKey));
           if (playlist) {
             loadedPlaylists.push({ ...playlist, id: playlistKey });
           }
         }
         const myMusicPlaylist = JSON.parse(localStorage.getItem("musicList"));
         if (myMusicPlaylist) {
           loadedPlaylists.push({
             ...myMusicPlaylist,
             id: "musicList",
             name: "My Music",
           });
         }
         setPlaylists(loadedPlaylists);
       }
     }, [isOpen]);
     ```

4. **마이 뮤직 기능**
   - 사용자가 즐겨 듣는 음악을 모아놓은 개인 플레이리스트 기능을 구현하는 과정에서 어려움이 있었음.
   - 로컬 스토리지에서 데이터를 불러오고, 음악 리스트를 관리하는 로직을 구현하는 데 시간이 걸렸음.
     ```jsx
     useEffect(() => {
       const storedPlaylist = JSON.parse(localStorage.getItem(id)) || {
         name: "",
         items: [],
       };
       setPlaylist(storedPlaylist);
     }, [id]);
     ```
   - 삭제 및 재생 기능을 구현하는 과정에서 발생한 상태 관리의 복잡성으로 인해 어려움을 겪음.
     ```jsx
     const handlePlayTrack = (track) => {
       const trackIndex = musicData.findIndex(
         (item) => item.videoID === track.videoID
       );
       if (trackIndex === -1) {
         addTrackToList(track);
         playTrack(0);
       } else {
         playTrack(trackIndex);
       }
     };
     ```

---

#### 파일 구조

- scss/

  - \_aside.scss
  - \_chart.scss
  - \_common.scss
  - \_fonts.scss
  - \_header.scss
  - \_modal.scss
  - \_Notification.scss
  - \_reset.scss
  - \_search.scss
  - \_vars.scss
  - index.scss

- components/

  - Aside.jsx
  - Chart.jsx
  - Error.jsx
  - Header.jsx
  - Loading.jsx
  - Main.jsx
  - Modal.jsx
  - Search.jsx

- context/
  - MusicPlayerProvider.jsx
- hook/
  - useFetchData.jsx
- pages/

  - ChartList.jsx
  - Home.jsx
  - Mymusic.jsx
  - PlayList.jsx

- App.js
- index.js
- Notification.js

---

#### 느낀 점

이 프로젝트를 진행하면서, 처음으로 다양한 API와 라이브러리를 활용하여 실제로 작동하는 웹 애플리케이션을 만들면서 많은 것을 배웠습니다. 특히, 상태 관리의 중요성과 복잡성을 체감할 수 있었고, 이를 해결하기 위한 다양한 패턴과 접근 방식을 학습할 수 있었습니다. 또한, 로컬 스토리지를 활용한 데이터 관리와 사용자 인터페이스의 상호작용을 구현하면서 실제 사용자 경험을 개선하는 방법에 대해 깊이 고민할 수 있었습니다.
