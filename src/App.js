import axios from "axios";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Navigation } from 'swiper';
import 'swiper/css';
import "swiper/css/free-mode";
import "swiper/css/navigation";

function App() {
  const narrow = useMediaQuery({query: '(max-width: 600px)'})
  const [firstLoad, setFirstLoad] = useState(false)
  const [firstItem, setFirstItem] = useState({
    comingSoon: [], 
    inTheaters: [], 
    trendingMovies: [], 
    trendingSeries: [], 
    bestMovies: [], 
    bestSeries: [], 
    boxOffice: [], 
    boxOfficeOfAllTime: []
  })
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchLoad, setSearchLoad] = useState(false)
  const [searchItem, setSearchItem] = useState([])
  const [mainLoad, setMainLoad] = useState(false)
  const [mainItem, setMainItem] = useState([])
  const [trailer, setTrailer] = useState('')

  useEffect(() => {
    setFirstLoad(true);
    const fetch = async () => {
      const inTheaters = axios.get('https://imdb-api.com/API/InTheaters/k_93uf6qu7')
      const comingSoon = axios.get('https://imdb-api.com/API/ComingSoon/k_93uf6qu7')
      const trendingMovies = axios.get('https://imdb-api.com/API/MostPopularMovies/k_93uf6qu7')
      const trendingSeries = axios.get('https://imdb-api.com/API/MostPopularTVs/k_93uf6qu7')
      const bestMovies = axios.get('https://imdb-api.com/API/Top250Movies/k_93uf6qu7')
      const bestSeries = axios.get('https://imdb-api.com/API/Top250TVs/k_93uf6qu7')
      const boxOffice = axios.get('https://imdb-api.com/API/BoxOffice/k_93uf6qu7')
      const boxOfficeOfAllTime = axios.get('https://imdb-api.com/API/BoxOfficeAllTime/k_93uf6qu7')
      const [it, cs, tm, ts, bm, bs, bo, boat] = await Promise.all([inTheaters, comingSoon, trendingMovies, trendingSeries,bestMovies, bestSeries, boxOffice, boxOfficeOfAllTime]);
      const itNew = it.data.items.map(item => {return {...item, typeMovie: 'inTheaters'}})
      setFirstItem({inTheaters: itNew, comingSoon: cs.data.items, trendingMovies: tm.data.items.slice(0, 50), trendingSeries: ts.data.items.slice(0, 50), bestMovies: bm.data.items.slice(0, 50), bestSeries: bs.data.items.slice(0, 50), boxOffice: bo.data.items, boxOfficeOfAllTime: boat.data.items.slice(0, 10)});
      setFirstLoad(false);
      console.log(it.data.items, cs.data.items, tm.data.items.slice(0, 50), ts.data.items.slice(0, 50), bm.data.items.slice(0, 50), bs.data.items.slice(0, 50), bo.data.items, boat.data.items.slice(0, 10));
    }

    fetch();
  }, []);

  const handleMain = (id) => {
    setMainLoad(true);
    axios.get(`https://imdb-api.com/en/API/Title/k_93uf6qu7/${id}/Wikipedia`)
    .then((res) => {
      setMainItem(res.data);
      setMainLoad(false);
      window.scrollTo(0, 0);
      console.log(res.data);
    })
    .catch((err) => {
      setMainLoad(false);
      console.log(err);
    })
    axios.get(`https://imdb-api.com/en/API/YouTubeTrailer/k_93uf6qu7/${id}`)
    .then((res) => {
      setTrailer(res.data.videoId);
      console.log(res.data.videoId);
    })
    .catch((err) => {
      console.log(err);
    })
  }

  const handleSearch = (evt) => {
    if (evt) {
      setSearchLoad(true);
      axios.get(`https://imdb-api.com/API/Search/k_93uf6qu7/${evt}`)
      .then((res) => {
        setSearchItem(res.data.results);
        setSearchLoad(false);
        console.log(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      })
    } else {
      setSearchItem([]);
    }
  }

  const Carousel  = ()  => {
    return (
        <Swiper modules={narrow ? [Autoplay] : [Autoplay, Navigation]} autoplay={{delay: 5000, disableOnInteraction: false}} allowTouchMove={narrow ? true : false}
        navigation={narrow ? false : true} loop={true} slidesPerView={narrow ? 1.1 : 1.3} spaceBetween={narrow ? 5 : 10} centeredSlides={true} className="carousel">
          {[...firstItem.inTheaters, ...firstItem.comingSoon].map((a) => 
            <SwiperSlide className="slider" key={a.id} onClick={() => handleMain(a.id)}>
              <div className="text">
                <h1 className="title">{a.title}</h1>
                {a.typeMovie ? 
                  <h2 className="release">In theaters</h2>
                : <h2 className="release">Release on {a.releaseState}</h2>}
                <h2 className="plot">{a.plot}</h2>
              </div>
              <div className="image">
                <img src={a.image.includes('nopicture') ? a.image : a.image.split('._V1')[0]+="._V1_Ratio0.6791_AL_.jpg"} alt="img" />
              </div>
            </SwiperSlide>
          )}
        </Swiper>
    );
  }

  const Box = ({part}) => {
    return (<>
      {narrow ?
        <Swiper modules={[FreeMode]} slidesPerView={3} spaceBetween={5} slidesOffsetBefore={15} slidesOffsetAfter={15} freeMode={{momentumRatio: 0.3}} className="box">
          {part}
        </Swiper>
      :
        <Swiper modules={[Navigation]} navigation={true} slidesPerView={8} slidesPerGroup={7} spaceBetween={10}
        slidesOffsetBefore={35} slidesOffsetAfter={35} allowTouchMove={false} className="box">
          {part}
        </Swiper>
      }
    </>);
  }

  const BoxTm = () => {
    return (
      <Box part={<>
        {firstItem.trendingMovies.map((a) => 
          <SwiperSlide className="box-slider" key={a.id}>
            <img src={a.image.includes('nopicture') ? a.image : a.image.split('._V1')[0]+="._V1_Ratio0.6791_AL_.jpg"} alt="img" onClick={() => handleMain(a.id)} />
            <h2 className="title">{a.title}</h2>
            {a.rankUpDown === '0' ? 
              <h2 className="sub">=</h2> 
            : a.rankUpDown.includes('-') ? 
              <h2 className="sub icon" style={{color: 'red'}}><span className="material-icons">arrow_downward</span>
              {a.rankUpDown.replace('-', '')}</h2>
            : a.rankUpDown.includes('+') ? 
              <h2 className="sub icon" style={{color: 'green'}}><span className="material-icons">arrow_upward</span>
              {a.rankUpDown.replace('+', '')}</h2>
            : <h2 className="sub icon" style={{color: 'green'}}><span className="material-icons">arrow_upward</span>
              {a.rankUpDown}</h2>}
          </SwiperSlide>
        )}
      </>} />
    );
  }

  const BoxTs = () => {
    return (
      <Box part={<>
        {firstItem.trendingSeries.map((a) => 
          <SwiperSlide className="box-slider" key={a.id}>
            <img src={a.image.includes('nopicture') ? a.image : a.image.split('._V1')[0]+="._V1_Ratio0.6791_AL_.jpg"} alt="img" onClick={() => handleMain(a.id)} />
            <h2 className="title">{a.title}</h2>
            {a.rankUpDown === '0' ? 
              <h2 className="sub">=</h2> 
            : a.rankUpDown.includes('-') ? 
              <h2 className="sub icon" style={{color: 'red'}}><span className="material-icons">arrow_downward</span>
              {a.rankUpDown.replace('-', '')}</h2>
            : a.rankUpDown.includes('+') ? 
              <h2 className="sub icon" style={{color: 'green'}}><span className="material-icons">arrow_upward</span>
              {a.rankUpDown.replace('+', '')}</h2>
            : <h2 className="sub icon" style={{color: 'green'}}><span className="material-icons">arrow_upward</span>
              {a.rankUpDown}</h2>}
          </SwiperSlide>
        )}
      </>} />
    );
  }

  const BoxBm = () => {
    return (
      <Box part={<>
        {firstItem.bestMovies.map((a) => 
          <SwiperSlide className="box-slider" key={a.id}>
            <img src={a.image.includes('nopicture') ? a.image : a.image.split('._V1')[0]+="._V1_Ratio0.6791_AL_.jpg"} alt="img" onClick={() => handleMain(a.id)} />
            <h2 className="title">{a.title}</h2>
            <h2 className="sub icon" style={{color: 'yellow'}}>
              <span className="material-icons">star</span>{a.imDbRating}
            </h2>
          </SwiperSlide>
        )}
      </>} />
    );
  }

  const BoxBs = () => {
    return (
      <Box part={<>
        {firstItem.bestSeries.map((a) => 
          <SwiperSlide className="box-slider" key={a.id}>
            <img src={a.image.includes('nopicture') ? a.image : a.image.split('._V1')[0]+="._V1_Ratio0.6791_AL_.jpg"} alt="img" onClick={() => handleMain(a.id)} />
            <h2 className="title">{a.title}</h2>
            <h2 className="sub icon" style={{color: 'yellow'}}>
              <span className="material-icons">star</span>{a.imDbRating}
            </h2>
          </SwiperSlide>
        )}
      </>} />
    );
  }

  const BoxBo = () => {
    return (
      <Box part={<>
        {firstItem.boxOffice.map((a) => 
          <SwiperSlide className="box-slider" key={a.id}>
            <img src={a.image.includes('nopicture') ? a.image : a.image.split('._V1')[0]+="._V1_Ratio0.6791_AL_.jpg"} alt="img" onClick={() => handleMain(a.id)} />
            <h2 className="title">{a.title}</h2>
            <h2 className="sub">{a.gross}</h2>
          </SwiperSlide>
        )}
      </>} />
    );
  }

  const BoxBoat = () => {
    return (
      <div className="box2">
        {firstItem.boxOfficeOfAllTime.map((a) => 
          <div className="bar" key={a.id}>
            <h1>{a.rank}</h1>
            <div className="text">
              <h2 className="title" onClick={() => handleMain(a.id)}>{a.title} ({a.year})</h2>
              <h2 className="sub">{a.worldwideLifetimeGross}</h2>
            </div>
          </div>
        )}
      </div>
    );
  }

  const Footer = () => {
    return (
      <div className="footer">
        <div className="column">
          <h2>Inspirated by</h2>
          <a href="https://www.hotstar.com/id" target="_blank" rel="noreferrer"><img src={require('./disney.png')} alt="img" /></a>
        </div>
        <div className="column">
          <h2>API by</h2>
          <a href="https://imdb-api.com/" target="_blank" rel="noreferrer"><img src={require('./imdb.png')} alt="img" /></a>
        </div>
        <div className="column">
          <h2>Repository by</h2>
          <a href="https://github.com/madanadra" target="_blank" rel="noreferrer"><img src={require('./github.png')} alt="img" /></a>
        </div>
      </div>
    );
  }

  const Main = () => {
    return (
      <div className="main">
        <h1>{mainItem.title}</h1>
        <h2 className="sub">{mainItem.year ? mainItem.year : '-'} &bull; {mainItem.contentRating ? mainItem.contentRating : '-'} &bull; {mainItem.type === 'TVSeries' ? <>{mainItem.tvSeriesInfo.seasons.length} Season</> : mainItem.runtimeStr}</h2>
        <div className="visual">
          <img src={mainItem.image} alt="img" />
          <div className="trailer">
            {trailer ? <iframe src={`https://www.youtube.com/embed/${trailer}`} title="trailer" allowFullScreen /> : <h1>Trailer not available</h1>}
            </div>
        </div>
        <div className="info">
          <div className="left">
            <h2 className="sub">Genre</h2>
            <h2 className="content">{mainItem.genres}</h2>
            <hr />
            <h2 className="sub">IMDb Rating</h2>
            <h2 className="content icon"><span className="material-icons" style={{color: 'yellow'}}>star</span>{mainItem.imDbRating ? mainItem.imDbRating : '0'} from {mainItem.imDbRatingVotes ? mainItem.imDbRatingVotes : '0'}</h2>
            <hr />
            <h2 className="sub">Plot</h2>
            <h2 className="content">{mainItem.plot}</h2>
            <hr />
            {mainItem.type === 'TVSeries' ? <>
            <h2 className="sub">Creator</h2>
            <h2 className="content">{mainItem.tvSeriesInfo.creators}</h2>
            <hr /></> : <>
            <h2 className="sub">Director</h2>
            <h2 className="content">{mainItem.directors}</h2>
            <hr />
            <h2 className="sub">Writer</h2>
            <h2 className="content">{mainItem.writers}</h2>
            <hr /></>
            }
            <h2 className="sub">Stars</h2>
            <h2 className="content">{mainItem.stars}</h2>
            <hr />
            <h2 className="sub">Companies</h2>
            <h2 className="content">{mainItem.companies}</h2>
            <hr />
            <h2 className="sub">Country</h2>
            <h2 className="content">{mainItem.countries}</h2>
            <hr />
            <h2 className="sub">Release Date</h2>
            <h2 className="content">{mainItem.releaseDate}</h2>
            <hr />
            <h2 className="sub">Award</h2>
            <h2 className="content">{mainItem.awards ? mainItem.awards : '-'}</h2>
            <hr />
            <h2 className="sub">Budget</h2>
            <h2 className="content">{mainItem.boxOffice.budget ? mainItem.boxOffice.budget : '-'}</h2>
            <hr />
            <h2 className="sub">Worldwide Gross</h2>
            <h2 className="content">{mainItem.boxOffice.cumulativeWorldwideGross ? mainItem.boxOffice.cumulativeWorldwideGross : '-'}</h2>
            <hr />
            <h2 className="sub">Wikipedia</h2>
            {mainItem.wikipedia.url ? 
            <a href={mainItem.wikipedia.url} target="_blank" rel="noreferrer"><h2 className="content">{mainItem.wikipedia.url}</h2></a> :
            <h2 className="content">-</h2>}
          </div>
          <div className="right">
            <h2 className="sub">Similar</h2>
            <div className="similars">
              {mainItem.similars.length === 0 ? '-' : mainItem.similars.slice(0, 10).map((a) => <img src={a.image} alt="img" onClick={() => handleMain(a.id)} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container" onClick={() => setSearchOpen(false)}>
      {firstLoad ? <span className="material-icons first-icon">movie</span> : <>
        {mainLoad ? <div className="progress" /> : []}
        <div className="search">
          {mainItem.length === 0 ? [] :<span className="material-icons back-icon" onClick={() => setMainItem([])}>arrow_back</span>}
          <div className="input">
            <span className="material-icons search-icon">search</span>
            <input placeholder="Search" onClick={(e) => e.stopPropagation()} onFocus={() => setSearchOpen(true)} autoFocus={searchOpen}
            onChange={(e) => {handleSearch(e.target.value); e.preventDefault()}} />
          </div>
          {searchOpen ? 
            <div className="list">
              {searchLoad ? <div className="load"><div class="lds-facebook"><div></div><div></div><div></div></div></div> : 
              searchItem?.map((a) => <h2 className="title" onClick={() => handleMain(a.id)}>{a.title} {a.description}</h2>)}
            </div>
          : []}
        </div>
        {mainItem.length === 0 ? <>
          <Carousel />
          <h1 className="menu">Trending movies</h1>
          <BoxTm />
          <h1 className="menu">Trending series</h1>
          <BoxTs />
          <h1 className="menu">Best movies</h1>
          <BoxBm />
          <h1 className="menu">Best series</h1>
          <BoxBs />
          <h1 className="menu">Box office</h1>
          <BoxBo />
          <h1 className="menu">Box office of all time</h1>
          <BoxBoat />
        </>
        : <Main /> }
        <Footer />
        <h2 className="copyright"><span className="material-icons">copyright</span>2022 Muhammad Laksmana Indra</h2>
      </>}  
    </div>
  );
}

export default App;
