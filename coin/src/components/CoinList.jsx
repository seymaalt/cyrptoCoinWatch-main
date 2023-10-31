import { useState, useEffect } from "react";
import Image from "react-bootstrap/Image";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import CircleIcon from "@mui/icons-material/Circle";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import moment from "moment";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

function ListItem({ item, onToggleFavorite }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = async () => {
    setIsFavorite(!isFavorite);
    onToggleFavorite(item, !isFavorite);
    console.log(isFavorite);
  };

  return (
    <div>
      <div style={{ align: "left" }} onClick={toggleFavorite}>
        {isFavorite ? <CircleIcon color="primary" /> : <PanoramaFishEyeIcon />}
        
      </div>
    </div>
  );
}

function Home() {
  const [coinData, setCoinData] = useState([]);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteCoins, setFavoriteCoins] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [coinChartData, setCoinChartData] = useState({});
  const [previousData, setPreviousData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/coins/list`,
        {
          currency: "USD",
          sort: "rank",
          order: "ascending",
          offset: 0,
          limit: 50,
          meta: true,
        },
        {
          headers: {
            "content-type": "application/json",
            "x-api-key": apiKey,
          },
        }
      );
      if (previousData.length > 0) {
        const updatedCoinData = response.data.map(coin);
        setCoinData(updatedCoinData);
      } else {
        setCoinData(response.data);
      }
      setPreviousData(response.data);

      const chartPromises = response.data.map(async (coin) => {
        const chartResponse = await axios.post(
          `${apiUrl}/coins/single/history`,
          {
            currency: "USD",
            code: coin.code,
            start: moment().subtract(7, "days").valueOf(),
            end: moment().valueOf(),
            meta: true,
          },
          {
            headers: {
              "content-type": "application/json",
              "x-api-key": apiKey,
            },
          }
        );
        if (!chartResponse || !chartResponse.data.history) {
          return null;
        }

        const coinChartData = chartResponse.data.history.map((value) => ({
          x: value.date,
          y: value.rate.toFixed(8),
        }));

        var color;
        {
          coin.delta.week > 1 ? (color = "green") : (color = "red");
        }

        setCoinChartData((prevData) => ({
          ...prevData,
          [coin.code]: {
            labels: coinChartData.map((val) =>
              moment(val.x).format("MMMM Do YYYY, h:mm:ss a")
            ),
            datasets: [
              {
                data: coinChartData.map((val) => val.y),
                borderColor: color,
                backgroundColor: color,
              },
            ],
          },
        }));
      });
    } catch (error) {
      console.error("API isteği başarısız oldu", error);
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 60000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const toggleFavoriteCount = async (item, isFavorite) => {
    if (isFavorite) {
      setFavoriteCount(favoriteCount + 1);
      setFavoriteCoins([...favoriteCoins, item]);
    } else {
      setFavoriteCount(favoriteCount - 1);
      setFavoriteCoins(favoriteCoins.filter((coin) => coin !== item));
    }
  };

  const options = {
    elements: {
      point: {
        radius: 0,
      },
      line: {
        tension: 0,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  
  return (
    <div style={{ marginTop: "10px" }}>
      <div style={{ display: "flex" }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            "& > :not(style)": {
              m: 1,
              width: 60,
              height: 30,
            },
          }}
        >
          <Paper
            elevation={3}
            style={{ textAlign: "center" }}
            onClick={() => setShowFavorites(!showFavorites)}
          >
            <div style={{ align: "left" }}>
              {" "}
              <div style={{ fontSize: "25px", width: "50px" }}>
                <CircleIcon color="primary" /> {favoriteCount}
              </div>
            </div>
          </Paper>
        </Box>
        <div style={{ align: "right" }}>
          <Search
            style={{ width: "150px", height: "40px", marginLeft: "850px" }}
            align="right"
          >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Arama..."
              inputProps={{ "aria-label": "search" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Search>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Kripto Para</TableCell>
              <TableCell align="right">Fiyat</TableCell>
              <TableCell align="right">24 Saatlik</TableCell>
              <TableCell align="right">Haftalık</TableCell>
              <TableCell align="right">24 Saatlik Hacim</TableCell>
              <TableCell align="right">Piyasa Değeri</TableCell>
              <TableCell align="right">Haftalık Grafik</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coinData
              .filter(
                (coin) =>
                  (coin.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                    coin.code
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())) &&
                      (showFavorites
                        ? favoriteCoins.includes(coin)
                        : true)
              )
              .map((coin) => (
                <TableRow
                  key={coin.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <ListItem
                      item={coin}
                      isFavorite={coin.isFavorite}
                      onToggleFavorite={toggleFavoriteCount}
                    />
                    <div style={{ marginLeft: "8px" }}>{coin.rank}</div>
                  </TableCell>
                  <TableCell >
                    <div style={{ display: "flex" }}>
                      <Image
                        src={coin.png32}
                        roundedCircle
                        style={{
                          marginRight: "10px",
                          width: "40px",
                          marginTop: "0px",
                        }}
                      />
                      <div>
                        <span style={{ fontWeight: "bold" }}>{coin.code}</span>
                        <br />
                        <div style={{}}>{coin.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="right">${coin.rate.toFixed(2)}</TableCell>
                  <TableCell
                    align="right"
                    style={{
                      color: (coin.delta.day - 1) * 100 < 0 ? "red" : "green",
                    }}
                  >
                    {`${((coin.delta.day - 1) * 100).toFixed(2)}%`}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{
                      color: (coin.delta.week - 1) * 100 < 0 ? "red" : "green",
                    }}
                  >
                    {`${((coin.delta.week - 1) * 100).toFixed(2)}%`}
                  </TableCell>
                  <TableCell align="right">
                    {(() => {
                      if (coin.volume >= 1000000000) {
                        return `$${(coin.volume / 1000000000).toFixed(2)} B`;
                      } else if (coin.volume >= 1000000) {
                        return `$${(coin.volume / 1000000).toFixed(2)} M`;
                      } else if (coin.volume >= 1000) {
                        return `$${(coin.volume / 1000).toFixed(2)} K`;
                      } else {
                        return `$${coin.volume}`;
                      }
                    })()}
                  </TableCell>
                  <TableCell align="right">
                    {(() => {
                      if (coin.volume >= 1000000000) {
                        return `$${(coin.cap / 1000000000).toFixed(2)} B`;
                      } else if (coin.cap >= 1000000) {
                        return `$${(coin.cap / 1000000).toFixed(2)} M`;
                      } else if (coin.cap >= 1000) {
                        return `$${(coin.cap / 1000).toFixed(2)} K`;
                      } else {
                        return `$${coin.cap}`;
                      }
                    })()}
                  </TableCell>
                  <TableCell align="right">
                    <div
                      style={{
                        width: "160px",
                        height: "80px",
                        float: "right",
                      }}
                    >
                      <Line
                        data={
                          coinChartData[coin.code] || {
                            labels: [],
                            datasets: [],
                          }
                        }
                        options={options}
                      ></Line>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Home;
