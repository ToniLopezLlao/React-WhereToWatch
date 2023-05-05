import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import film_styles from "../../module/filmpage.module.css";
import navbar_styles from "../../module/navbar.module.css";
import ReactPlayer from "react-player";
import FilmList from "../home/FilmList";

// interface FilmInfoProps {
//   adult: boolean;
//   backdrop_path: string;
//   belongs_to_collection: {
//     id: number;
//     name: string;
//     poster_path: string;
//   };
//   budget: number;
//   genres: {
//     id: number;
//     name: string;
//   }[];
//   homepage: string;
//   id: number;
//   imdb_id: string;
//   original_language: string;
//   original_title: string;
//   overview: string;
//   popularity: number;
//   poster_path: string;
//   production_companies: {
//     id: number;
//     logo_path: string;
//     name: string;
//     origin_country: string;
//   }[];
//   production_countries: {
//     iso_3166_1: string;
//     name: string;
//   }[];
//   release_date: string;
//   revenue: number;
//   runtime: number;
//   spoken_languages: {
//     english_name: string;
//     iso_639_1: string;
//     name: string;
//   }[];
//   status: string;
//   tagline: string;
//   title: string;
//   video: boolean;
//   vote_average: number;
//   vote_count: number;
// }

interface FilmVideoProps {
  id: string;
  name: string;
  video: string;
}

interface FilmVideoProps {
  link: string;
  flatrate: Array<{
    logo_path: string;
    provider_id: number;
    provider_name: string;
  }>;
  rent: Array<{
    logo_path: string;
    provider_id: number;
    provider_name: string;
  }>;
  buy: Array<{
    logo_path: string;
    provider_id: number;
    provider_name: string;
  }>;
}

export const FilmPage = () => {
  const [page, setPage] = useState(1);

  const [providersAvailable, setProvidersAvailable] = useState(false);
  const [filmData, setfilmData] = useState();

  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // const [filmData, setfilmData] = useState<FilmInfoProps>();
  const [filmDataVideo, setfilmDataVideo] = useState<FilmVideoProps>();
  const [filmDataSimilar, setfilmDataSimilar] = useState<FilmVideoProps>();
  const [filmDataProviders, setfilmDataProviders] = useState<FilmVideoProps>();

  let location = useLocation();
  const urlId = location.pathname.split("/")[2];
  const scroller = useRef(null);

  //Consultes al BackEnd
  //Dades pelicula completes

  async function fetchData() {
    try {
      const response = await fetch(
        "https://wheretowatch-vps.herokuapp.com/getFilmData/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            movie_id: urlId,
            language:
              navigator.language.split("-").length < 1
                ? navigator.language
                : navigator.language.split("-")[1].toLowerCase(),
          }).toString(),
        }
      );
      const data = await response.json();
      setfilmData(data);
      console.log("data recived");
      console.log(data);
      console.log(filmData);
      fetchDataVideo();
      fetchDataProviders();
      fetchDataLocalitat();
      fetchDataCinemes();
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  }

  //Dades trailer pelicula

  async function fetchDataVideo() {
    try {
      const response = await fetch(
        "https://wheretowatch-vps.herokuapp.com/getMovieVideos/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            movie_id: urlId,
            language:
              navigator.language.split("-").length < 1
                ? navigator.language
                : navigator.language.split("-")[1].toLowerCase(),
          }).toString(),
        }
      );
      const datavideo = await response.json();
      setfilmDataVideo(datavideo);
      console.log("data video");
      console.log(datavideo);
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  }

  //Dades localitat on fan la pelicula i on hi han cines

  async function fetchDataLocalitat() {
    try {
      const response = await fetch(
        "https://wheretowatch-vps.herokuapp.com/getFilmDataCinema/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            movie_id: urlId,
            language:
              navigator.language.split("-").length < 1
                ? navigator.language
                : navigator.language.split("-")[1].toLowerCase(),
          }).toString(),
        }
      );
      const datalocalitat = await response.json();
      setfilmDataProviders(datalocalitat);
      console.log("data localitat");
      console.log(datalocalitat);
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  }

  //Dades tots els cinemes de cada localitat

  async function fetchDataCinemes() {
    try {
      const response = await fetch(
        "https://wheretowatch-vps.herokuapp.com/getCinemaData/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            movie_id: urlId,
            language:
              navigator.language.split("-").length < 1
                ? navigator.language
                : navigator.language.split("-")[1].toLowerCase(),
          }).toString(),
        }
      );
      const datacinema = await response.json();
      setfilmDataProviders(datacinema);
      console.log("data cinemes");
      console.log(datacinema);
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  }

  //Dades tots proveidors de la pelicula

  async function fetchDataProviders() {
    try {
      const response = await fetch(
        "https://wheretowatch-vps.herokuapp.com/getProviders/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            movie_id: urlId,
            language:
              navigator.language.split("-").length < 1
                ? navigator.language
                : navigator.language.split("-")[1].toLowerCase(),
          }).toString(),
        }
      );
      const dataproviders = await response.json();
      console.log("data providers");
      let foundObject = null;
      for (let key in dataproviders.results) {
        if (key === "ES") {
          foundObject = dataproviders.results[key];
        }
      }
      console.log("------------------------------");
      console.log(foundObject);
      setfilmDataProviders(foundObject);
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  }

  //Auto Scroll Al inici

  useEffect(() => {
    scroller.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  //Use Effect de les funcions

  useEffect(() => {
    fetchDataVideo();
    fetchData();

    scroller.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      <div ref={scroller} style={{ overflowY: "scroll" }}>
        <div
          className={`${film_styles.play_container} ${navbar_styles.container}`}
        >
          <img
            src={`https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${filmData?.backdrop_path}`}
            alt=""
            className={film_styles.play_img}
          />
          <div className={film_styles.container_no}>
            <img
              src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${filmData?.poster_path}`}
              alt=""
              className={film_styles.play_img_portada_no}
            />
            <div className={film_styles.play_text}>
              <h1>
                {filmData?.title} ({filmData?.release_date.split("-")[0]})
              </h1>
              <h1>{filmData?.tagline}</h1>
            </div>
          </div>
        </div>
        <div
          className={`${film_styles.play_container} ${navbar_styles.container}`}
        >
          <h1>Valoració:</h1>
          <div className="rating">
            <i className="bx bxs-star">{filmData?.vote_average}</i>
          </div>
          <br />
          <h1>Genere:</h1>
          <br />
          <div className="tags">
            {filmData?.genres.map((genre) => (
              <span key={genre.id}>
                {" "}
                <a href={`/#${genre.name}`}>{genre.name} </a>
              </span>
            ))}
          </div>
          <br />
          <h1>Sinopsis:</h1>
          <br />
          <div className="tags">
            <label>{filmData?.overview}</label>
          </div>
          <br />
          <h1>Estudis:</h1>
          <div className="tags">
            {filmData?.production_companies.map((production_companies) => (
              <span key={production_companies.id}>
                <br />· {production_companies.name}
              </span>
            ))}
          </div>
          <br />
          <br />
          <div className="plaltaformes"></div>
          <button onClick={handleOpenModal} id="btn-abrir-trailer">
            <h1>TRAILER</h1>
          </button>
          {showModal && (
            <div
              id="modal"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
              }}
            >
              <div>
                <button
                  onClick={handleCloseModal}
                  id="btn_cerrar_trailer"
                  className={`${film_styles.btn_cerrar_trailer}`}
                ></button>
                <p>
                  {" "}
                  <div className={`${film_styles.video_source}`}>
                    <ReactPlayer
                      url={`${filmDataVideo[0]?.video}`}
                      width="100%"
                      height="100%"
                      controls
                      playing
                      muted
                      loop
                      className="react-player"
                    />
                  </div>
                </p>
              </div>
            </div>
          )}
          <br />
          <br />
          <h1>Tarifa:</h1>
          <br />
          <div className={`${film_styles.providers}`}>
            <div className={`${film_styles.providers_container}`}>
              {filmDataProviders?.flatrate?.length ? (
                filmDataProviders.flatrate.map((provider) => (
                  <div key={provider.provider_id}>
                    <img
                      src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                      alt={provider.provider_name}
                    />
                    <p>{provider.provider_name}</p>
                  </div>
                ))
              ) : (
                <p>No no está disponible en ninguna plataforma.</p>
              )}
            </div>
          </div>
          <br />
          <h1>Llogar:</h1>
          <br />
          <div className={`${film_styles.providers}`}>
            <div className={`${film_styles.providers_container}`}>
              {filmDataProviders?.rent?.length ? (
                filmDataProviders.rent.map((provider) => (
                  <div key={provider.provider_id}>
                    <img
                      src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                      alt={provider.provider_name}
                    />
                    <p>{provider.provider_name}</p>
                  </div>
                ))
              ) : (
                <p>No está disponible en ninguna plataforma.</p>
              )}
            </div>
          </div>
          <br />
          <h1>Comprar:</h1>
          <br />
          <div className={`${film_styles.providers}`}>
            <div className={`${film_styles.providers_container}`}>
              {filmDataProviders?.buy?.length ? (
                filmDataProviders.buy.map((provider) => (
                  <div key={provider.provider_id}>
                    <img
                      src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                      alt={provider.provider_name}
                    />
                    <p>{provider.provider_name}</p>
                  </div>
                ))
              ) : (
                <p>No está disponible en ninguna plataforma.</p>
              )}
            </div>
          </div>

          <FilmList
            key={"popular"}
            propsReceive={{
              title: "Pelicules Similars",
              url: "getSimilarMovie/",
              moveId: urlId,
            }}
          />
          <br />
          <br />
          <br />
        </div>
      </div>
    </>
  );
};
